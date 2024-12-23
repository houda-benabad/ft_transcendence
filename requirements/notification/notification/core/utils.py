from asgiref.sync import  sync_to_async
from channels.db import database_sync_to_async
from django.contrib.auth.models import User
from .models import Notification
from .serializer import NotificationSerializer


async def create_notification( sender_username, data ):
	receiver = data['receiver']
	notification = await sync_to_async( Notification.objects.create )( 
		sender=await get_user( sender_username ),
		receiver=await get_user( receiver ),
		content=data['content']
    )
	await sync_to_async( notification.save )(  )
	return notification


@database_sync_to_async
def get_all_notifications( username ):
	user =  User.objects.get( username=username )
	notifications = Notification.objects.filter( receiver=user )
	data = serialize_notifications( notifications )
	return data

def serialize_notifications( notifications, many=True):
	serializer = NotificationSerializer(notifications, many=many)
	return serializer.data


async def get_user(  username ):
	return await sync_to_async( User.objects.get )( username=username )
