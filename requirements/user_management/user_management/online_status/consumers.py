from channels.generic.websocket import WebsocketConsumer
from friendship.models import Friend
import json
from asgiref.sync import async_to_sync
from django.contrib.auth.models import AnonymousUser
import redis
from django.conf import settings
from rest_framework_simplejwt.authentication import JWTAuthentication
import logging

logging.basicConfig(level=logging.DEBUG)  

logger = logging.getLogger("consumers") 

REDIS_ONLINE_USERS = "online_users"
class OnlineStatusConsumer(WebsocketConsumer):
    redis_client = redis.Redis(host=settings.REDIS_SERVER, port=settings.REDIS_PORT)

    def connect(self):
        self.accept()
    
    def receive(self, text_data):
        try :
            logger.debug("=========================================received a meesage from frontend================")
            json_data = json.loads(text_data)
            message_type = json_data.get('type', '')
            logger.debug(f"=================type{message_type}")
            if message_type == 'auth':
                logger.debug("=================inside auth")
                token = json_data.get('token', '')
                if not token:
                    raise ValueError("missing token, rejected connection.")
                jwt_auth = JWTAuthentication()
                validated_token = jwt_auth.get_validated_token(token)
                self.user = jwt_auth.get_user(validated_token)

                self.redis_client.sadd(REDIS_ONLINE_USERS, self.user.id)
                self.redis_client.sadd(f"{self.user.username}_channels", self.channel_name)
                friends_qs = Friend.objects.friends(self.user)
                # friends_usernames = friends_qs.values_list("username", flat=True)
                self._inform_friends_user_online_status(self.user.id, friends_qs, "online")
                online_friends = self._get_online_friends(friends_qs)
                self.send(text_data=json.dumps({"type": "online_friends_list", "online_friends": online_friends}))
            elif message_type == 'new_friend':
                logger.debug("--------->here new friend check online")
                friend_id = json_data.get('friend_id', '')
                if not friend_id:
                    raise ValueError("missing friend id")
                logger.debug("--------->here new friend check redis membership")
                online_users = self.redis_client.smembers(REDIS_ONLINE_USERS)
                logger.debug(f"--------online users {online_users}-------friend_id: {friend_id}")
                if self.redis_client.sismember(REDIS_ONLINE_USERS, friend_id) == 1:
                    logger.debug("sending to frontend")
                    self.send(text_data=json.dumps({"type": "friend_online_status", "friend_id": friend_id, "status": "online"}))

        except ValueError as e:
            self.send(text_data=json.dumps({"error": str(e)}))
            self.close()
        except Exception as e:
            self.send(text_data=json.dumps({"error": str(e)}))
            self.close()
        except json.JSONDecodeError:
            self.send(text_data=json.dumps({"error": 'Invalid JSON format'}))
            self.close()
    
    def _inform_friends_user_online_status(self, user_id, friends_qs, online_status):

        for friend in friends_qs:

            friend_channels = self.redis_client.smembers(f"{friend.username}_channels")

            for friend_channel in friend_channels:
                async_to_sync(self.channel_layer.send(
                    friend_channel, 
                    {
                        "type": "friend.status",
                        "friend_id": user_id,
                        "status": online_status,
                    }))
    
    def _get_online_friends(self, friends_qs):

        online_friends = []
        for friend in friends_qs:
            if self.redis_client.sismember(REDIS_ONLINE_USERS, friend.id) == 1:
                online_friends.append(friend.id)
            
        return online_friends

    
    def disconnect(self, close_code):
        if self.user != AnonymousUser():
            self.redis_client.srem(REDIS_ONLINE_USERS, self.user.username)
            self.redis_client.srem(f"{self.user.username}_channels", self.channel_name)
            user_channels_set_size = self.redis_client.scard(f"{self.user.username}_channels")
            if user_channels_set_size == 0:
                friends_qs = Friend.objects.friends(self.user)
                # friends_usernames = friends_qs.values_list("username", flat=True)
                self._inform_friends_user_online_status(self.user.id, friends_qs, "offline")


    def friend_status(self, event):

        status = event["status"]
        friend_id = event["friend_id"]

        self.send(text_data=json.dumps({"type": "friend_online_status", "friend_id": friend_id, "status": status}))
        
