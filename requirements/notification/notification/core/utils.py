from asgiref.sync import  sync_to_async
from channels.db import database_sync_to_async
from django.contrib.auth.models import User
from .models import Notification
from channels.layers import get_channel_layer
from .serializer import NotificationSerializer
# from channels import Group
import json

async def create_notification( userId, data ):
	receiverId = data['receiver']
	notification = await sync_to_async( Notification.objects.create )( 
		senderId=userId,
		receiverId=receiverId,
		content=data['content']
	)
	await sync_to_async( notification.save )(  )
	return notification


@database_sync_to_async
def get_all_notifications( userId, token ):
	notifications = Notification.objects.filter( receiverId=userId )
	data = serialize_notifications( notifications, token )
	return data


def serialize_notifications( notifications, token, many=True ):
	serializer = NotificationSerializer(notifications, many=many, token=token)
	return serializer.data


async def send_notification_( data, userId, token ):
	print( "receiver =",data['receiver'] )
	channel_layer = get_channel_layer( )

	group_name = f"user_{data['receiver']}"

	notification = await create_notification( userId, data )

	serialized_notification = serialize_notifications( notification,token, many=False )
	await channel_layer.group_send( group_name,{
		"type" : 'send_notification',
		'data' : serialized_notification
	} )

@database_sync_to_async
def get_notification_info( self, notification ):
	return notification.sender.username


async def update_notification( self, data ):
	print( f"update called {data}" )
	notification_id = data["notification_id"]
	notification = await database_sync_to_async( Notification.objects.get )( id=notification_id )
	notification.status = data['status']
	await database_sync_to_async( notification.save )()
	await self.send_confirmation(  notification )