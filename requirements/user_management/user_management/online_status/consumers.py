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
        self.user = self.scope.get("user")
        if not self.user or self.user.is_anonymous:
            self.close()
            return
        self.accept()
        self.redis_client.sadd(REDIS_ONLINE_USERS, self.user.id)
        self.redis_client.sadd(f"{self.user.username}_channels", self.channel_name)
        self.group_name = f"{self.user.username}_group"
        async_to_sync(self.channel_layer.group_add(self.group_name, self.channel_name))
        channels = self.redis_client.smembers(f"{self.user.username}_channels")
        friends_qs = Friend.objects.friends(self.user)
        # friends_usernames = friends_qs.values_list("username", flat=True)
        self._inform_friends_user_online_status(self.user.id, friends_qs, "online")
        online_friends = self._get_online_friends(friends_qs)
        self.send(text_data=json.dumps({"type": "online_friends_list", "online_friends": online_friends}))
    
    def receive(self, text_data):
        try :
            json_data = json.loads(text_data)
            message_type = json_data.get('type', '')
            if message_type == 'new_friend':
                friend_id = json_data.get('friend_id', '')
                if not friend_id:
                    raise ValueError("missing friend id")
                online_users = self.redis_client.smembers(REDIS_ONLINE_USERS)
                if self.redis_client.sismember(REDIS_ONLINE_USERS, friend_id) == 1:
                    self.send(text_data=json.dumps({"type": "friend_online_status", "friend_id": friend_id, "status": "online"}))

        except ValueError as e:
            self.send(text_data=json.dumps({"error": str(e)}))
            self.close()
            return
        except Exception as e:
            self.send(text_data=json.dumps({"error": str(e)}))
            self.close()
            return
        except json.JSONDecodeError:
            self.send(text_data=json.dumps({"error": 'Invalid JSON format'}))
            self.close()
            return
    
    def _inform_friends_user_online_status(self, user_id, friends_qs, online_status):

        try:

            for friend in friends_qs:

                # friend_channels = self.redis_client.smembers(f"{friend.username}_channels")
                async_to_sync(self.channel_layer.group_send(
                    friend.username + "_group", 
                    {
                        "type": "friend_status",
                        "friend_id": user_id,
                        "status": online_status,
                    }))

        except Exception as e:
            logger.debug(f"error occured while ssending to friends the user's online status {str(e)}")
    
    def _get_online_friends(self, friends_qs):

        online_friends = []
        for friend in friends_qs:
            if self.redis_client.sismember(REDIS_ONLINE_USERS, friend.id) == 1:
                online_friends.append(friend.id)
            
        return online_friends

    
    def disconnect(self, close_code):
        if self.user != AnonymousUser():
            user_channels_set_size = self.redis_client.scard(f"{self.user.username}_channels")
            if user_channels_set_size == 1:
                friends_qs = Friend.objects.friends(self.user)
                # friends_usernames = friends_qs.values_list("username", flat=True)
                self._inform_friends_user_online_status(self.user.id, friends_qs, "offline")
                self.redis_client.srem(REDIS_ONLINE_USERS, self.user.username)
            self.redis_client.srem(f"{self.user.username}_channels", self.channel_name)
            async_to_sync(self.channel_layer.group_discard(self.group_name, self.channel_name))



    def friend_status(self, event):
        try :
            logger.debug(f"Received event: {event}")
            status = event.get("status")
            friend_id = event.get("friend_id")

            self.send(text_data=json.dumps({"type": "friend_online_status", "friend_id": friend_id, "status": status}))
        except Exception as e:
            logger.debug("================================================error occured in friend status method message:", str(e))
        
