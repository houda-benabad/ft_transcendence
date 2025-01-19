from channels.generic.websocket import WebsocketConsumer
from friendship.models import Friend
import json
from asgiref.sync import async_to_sync

class OnlineStatusConsumer(WebsocketConsumer):

    def connect(self):
        self.group_name = self.user.username + "_friends"
        async_to_sync(self.channel_layer.group_add(self.group_name, self.channel_name))

        friends_qs = Friend.objects.friends(self.user)
        for friend in friends_qs:
            async_to_sync(self.channel_layer.group_add(friend.username + "_friends", self.channel_name))

        async_to_sync(self.channel_layer.group_send(
            self.group_name, {"type": "friend.status", "friend_username": self.user.username, "status": "online"}
        ))
        
        self.accept()
    
    def disconnect(self, close_code):

        friends_qs = Friend.objects.friends(self.user)

        async_to_sync(self.channel_layer.group_send(
            self.group_name, {"type": "friend.status", "friend_username": self.user.username, "status": "offline"}
        ))
    
    def friend_status(self, event):

        status = event["status"]
        friend_username = event["username"]

        self.send(text_data=json.dumps({"friend_username": friend_username, "status": status}))
        
