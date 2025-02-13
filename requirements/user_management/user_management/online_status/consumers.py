from channels.generic.websocket import WebsocketConsumer
from friendship.models import Friend
import json
from asgiref.sync import async_to_sync
from django.contrib.auth.models import AnonymousUser
import redis
from django.conf import settings
from rest_framework_simplejwt.authentication import JWTAuthentication


REDIS_ONLINE_USERS = "online_users"
class OnlineStatusConsumer(WebsocketConsumer):
    redis_client = redis.Redis(host=settings.REDIS_SERVER, port=settings.REDIS_PORT)

    def connect(self):
        self.user = self.scope.get("user")
        if not self.user or self.user.is_anonymous:
            self.close()
            return
        self.accept()
        self.group_name = f"{self.user.username}_group"
        async_to_sync(self.channel_layer.group_add)(self.group_name, self.channel_name)
        user_channels_set_size = self.redis_client.zcard(f"asgi:group:{self.group_name}")
        friends_qs = Friend.objects.friends(self.user)
        if user_channels_set_size == 1:
            self._inform_friends_user_online_status(self.user.id, friends_qs, "online")
            self.redis_client.sadd(REDIS_ONLINE_USERS, self.user.id)
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
                if self.redis_client.sismember(REDIS_ONLINE_USERS, friend_id) == 1:
                    self.send(text_data=json.dumps({"type": "friend_online_status", "friend_id": friend_id, "status": "online"}))

        except json.JSONDecodeError:
            self.send(text_data=json.dumps({"error": 'Invalid JSON format'}))
            self.close()
            return
        except ValueError as e:
            self.send(text_data=json.dumps({"error": str(e)}))
            self.close()
            return
        except Exception as e:
            self.send(text_data=json.dumps({"error": str(e)}))
            self.close()
            return
    
    def _inform_friends_user_online_status(self, user_id, friends_qs, online_status):

        for friend in friends_qs:
            async_to_sync(self.channel_layer.group_send)(
                f"{friend.username}_group", 
                {
                    "type": "friend_status",
                    "friend_id": user_id,
                    "status": online_status,
                })
    
    def _get_online_friends(self, friends_qs):

        online_friends = []
        for friend in friends_qs:
            if self.redis_client.sismember(REDIS_ONLINE_USERS, friend.id) == 1:
                online_friends.append(friend.id)
            
        return online_friends

    
    def disconnect(self, close_code):
        if self.user != AnonymousUser():
            user_channels_set_size = self.redis_client.zcard(f"asgi:group:{self.group_name}")
            if user_channels_set_size == 1:
                friends_qs = Friend.objects.friends(self.user)
                self._inform_friends_user_online_status(self.user.id, friends_qs, "offline")
                self.redis_client.srem(REDIS_ONLINE_USERS, self.user.id)
            async_to_sync(self.channel_layer.group_discard)(self.group_name, self.channel_name)



    def friend_status(self, event):
        status = event.get("status")
        friend_id = event.get("friend_id")

        self.send(text_data=json.dumps({"type": "friend_online_status", "friend_id": friend_id, "status": status}))
        
