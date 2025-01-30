from channels.generic.websocket import WebsocketConsumer
from friendship.models import Friend
import json
from asgiref.sync import async_to_sync
from django.contrib.auth.models import AnonymousUser

class OnlineStatusConsumer(WebsocketConsumer):

    def connect(self):
        
        if self.scope.get("user") != AnonymousUser():
            self.accept()
            self.user = self.scope.get("user")
            self.group_name = user.username + "_friends"
            async_to_sync(self.channel_layer.group_add(self.group_name, self.channel_name))

            friends_qs = Friend.objects.friends(self.scope.get("user"))
            for friend in friends_qs:
                async_to_sync(self.channel_layer.group_add(friend.username + "_friends", self.channel_name))

            async_to_sync(self.channel_layer.group_send(
                self.group_name, {"type": "friend.status", "friend_username": self.scope.get("user").username, "status": "online"}
            ))
        
        # when the group is created add it to redis and then before adding self.channel to other groups
        # check if the user is already part of those groups  by checking group sets that were added in redis
        # also using redis keep track of the users that are online
        # so that when the user first logs in he sees the online status of the friends that connected before
        
    
    def disconnect(self, close_code):

        if self.scope.get("user") != AnonymousUser():
            friends_qs = Friend.objects.friends(self.user)

            async_to_sync(self.channel_layer.group_send(
                self.group_name, {"type": "friend.status", "friend_username": self.scope["user"].username, "status": "offline"}
            ))
    

    def friend_status(self, event):

        status = event["status"]
        friend_username = event["username"]

        self.send(text_data=json.dumps({"friend_username": friend_username, "status": status}))
        
