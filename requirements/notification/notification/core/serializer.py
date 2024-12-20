from rest_framework import serializers
from .models import Notification

class NotificationSerializer( serializers.ModelSerializer ):
    sender = serializers.SerializerMethodField(  )
    class Meta:
        model = Notification
        fields = [
            "content",
            "sender",
            "time",
            "status"
            ]
    def get_sender( self, obj ):
        sender = obj.sender
        if not sender:
            return "anonymous"
        return sender.username