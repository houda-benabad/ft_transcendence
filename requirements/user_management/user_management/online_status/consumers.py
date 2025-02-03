from channels.generic.websocket import WebsocketConsumer
from friendship.models import Friend
import json
from asgiref.sync import async_to_sync
from django.contrib.auth.models import AnonymousUser
import redis
from django.conf import settings

REDIS_ONLINE_USERS = "online_users"

class OnlineStatusConsumer(WebsocketConsumer):
    redis_client = redis.Redis(host=settings.REDIS_SERVER, port=settings.REDIS_PORT)

    def connect(self):
        self.accept()
    
    def receive(self, text_data):
        try :
            json_data = json.loads(text_data)
            token = json_data.get('token', '')
            if not token:
                raise ValueError("missing token, rejected connection.")
            jwt_auth = JWTAuthentication()
            validated_token = jwt_auth.get_validated_token(token)
            self.user = jwt_auth.get_user(validated_token)

            self.redis_client.sadd(REDIS_ONLINE_USERS, self.user.username)
            self.redis_client.sadd(f"{self.user.username}_channels", self.channel_name)
            friends_qs = Friend.objects.friends(self.user)
            friends_usernames = friends_qs.values_list("username", flat=True)
            self._inform_friends_user_online_status(self.user.username, friends_usernames, "online")
            online_friends = self._get_online_friends(friends_usernames)
            self.send(text_data=json.dumps({"online_friends": online_friends}))

        except ValueError as e:
            self.send(text_data=json.dumps({"error": str(e)}))
            self.close()
        except Exception as e:
            self.send(text_data=json.dumps({"error": str(e)}))
            self.close()
        except json.JSONDecodeError:
            self.send(text_data=json.dumps({"error": 'Invalid JSON format'}))
            self.close()
    
    def _inform_friends_user_online_status(self, username, friends_usernames, online_status):

        for friend_username in friends_usernames:

            friend_channels = self.redis_client.smembers(f"{friend_username}_channels")

            for friend_channel in friend_channels:
                async_to_sync(self.channel_layer.send(
                    friend_channel, 
                    {
                        "type": "friend.status",
                        "friend_username": username,
                        "status": status,
                    }))
    
    def _get_online_friends(self, friends_usernames):

        online_friends = []
        for friend_username in friends_usernames:
            if self.redis_client.sismembers(REDIS_ONLINE_USERS, friend_username) == -1:
                online_friends.append(friend_username)
            
        return online_friends

    
    def disconnect(self, close_code):

        if self.user != AnonymousUser():

            self.redis_client.srem(REDIS_ONLINE_USERS, self.user.username)
            self.redis_client.srem(f"{self.user.username}_channels", self.channel_name)
            user_channels_set_size = self.redis_client.scard(f"{self.user.username}_channels")
            if user_channels_set_size == 0:
                friends_qs = Friend.objects.friends(self.user)
                friends_usernames = friends_qs.values_list("username", flat=True)
                self._inform_friends_user_online_status(self.user.username, friends_usernames, "offline")


    def friend_status(self, event):

        status = event["status"]
        friend_username = event["username"]

        self.send(text_data=json.dumps({"friend_username": friend_username, "status": status}))
        
