from rest_framework import serializers
from game.models import Player, RemoteGame, MultiplayerGame
from django.db.models import Q
from django.contrib.auth.models import User


# PLAYER INFO 

class BaseGameSerializer( serializers.ModelSerializer ):
	date_time = serializers.SerializerMethodField()

	class Meta:
		fields = [
			'id',
			'date_time',
		]

	def get_date_time( self, obj ):
		return obj.formatted_date_time()
		
class RemoteGameSerializer(  BaseGameSerializer ):
	status = serializers.SerializerMethodField()
	points = serializers.SerializerMethodField()
	type = serializers.CharField( default='remote')

	class Meta( BaseGameSerializer.Meta ):
		model = RemoteGame
		fields = BaseGameSerializer.Meta.fields +  [
			'type',
			'points',
			'status'
		]

	def get_points( self, obj ):
		current_player = self.context.get('current_player')
		if not current_player:
			raise ValueError("Current player not found in serializer context")
		if (obj.player1 == current_player):
			return obj.player1_points
		if (obj.player2 == current_player):
			return obj.player2_points
	
	def get_status( self, obj ):
		current_player = self.context.get('current_player')
		if not current_player:
			raise ValueError( 'Current player not found in serializer context' )
		if current_player == obj.winner:
			return 'Won'
		return 'Lost'
	
class MultiGameSerializer(  BaseGameSerializer ):
	status = serializers.SerializerMethodField()
	points = serializers.SerializerMethodField()
	type = serializers.CharField( default='multiplayer')

	class Meta( BaseGameSerializer.Meta ):
		model = MultiplayerGame
		fields = BaseGameSerializer.Meta.fields +  [
			'type',
			'points',
			'status'
		]

	def get_points( self, obj ):
		current_player = self.context.get('current_player')
		if not current_player:
			raise ValueError("Current player not found in serializer context")
		if obj.player1 == current_player or obj.player2 == current_player:
			return obj.team1_points
		if obj.player3 == current_player or obj.player4 == current_player:
			return obj.team2_points
	
	def get_status( self, obj ):
		current_player = self.context.get('current_player')
		if not current_player:
			raise ValueError( 'Current player not found in serializer context' )
		if current_player == obj.winner1 or current_player == obj.winner2:
			return 'Won'
		return 'Lost'

class PlayerSerializer( serializers.ModelSerializer ):
	game_history = serializers.SerializerMethodField()
	general_details = serializers.SerializerMethodField()
	class Meta:
		model = Player
		fields = [
			"general_details",
			'game_history'
		]
		
	def get_general_details( self, obj ):
		return {
			"total_points": obj.total_points,
			"total_games": obj.total_games,
			"rank": obj.get_rank(),
			"level": obj.level
		}


	def get_game_history( self, obj ):
		remoteGame = RemoteGame.objects.filter( Q( player1=obj ) | Q( player2=obj ) )
		serializedRemoteGame = RemoteGameSerializer( remoteGame, many=True, context={ "current_player" : obj } ).data
	
		multiGame = MultiplayerGame.objects.filter( Q( player1=obj ) | Q( player2=obj ) | Q( player3=obj ) | Q( player4=obj ) )
		serializedMultiGame = MultiGameSerializer( multiGame, many=True, context={ "current_player" : obj } ).data

		return serializedMultiGame + serializedRemoteGame

# LEADERBORAD
class RankSerializer( serializers.ModelSerializer ):
	rank = serializers.SerializerMethodField( )
	class Meta:
		model= Player
		fields=[
			'id',
			'rank',
			'username',
			'total_points'
		]
	
	def get_rank( self, obj):
		players = Player.objects.order_by( "-total_points" )
		return list(players).index(obj) + 1
