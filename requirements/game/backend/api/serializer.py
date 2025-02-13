from rest_framework import serializers
from game.models import Player, RemoteGame, MultiplayerGame
from django.db.models import Q
from itertools import chain



class GameSerializer( serializers.ModelSerializer ):
	date_time = serializers.SerializerMethodField( )
	status = serializers.SerializerMethodField()
	points = serializers.SerializerMethodField()
 
	def __init__(self, *args, **kwargs):
		model = kwargs.pop('model', None)
		if model:
			self.Meta.model = model
		super().__init__(*args, **kwargs)

	class Meta:
		model = None
		fields = [
			'id',
			'date_time',
			'type',
			'points',
			'status'
		]

	def get_date_time( self, obj ):
		return obj.formatted_date_time()

	def get_points( self, obj ):
		current_player = self.context.get('current_player')
		if not current_player:
			raise ValueError( 'Current player not found in serializer context' )
		return obj.get_point( current_player  )
	
	def get_status( self, obj ):
		current_player = self.context.get('current_player')
		if not current_player:
			raise ValueError( 'Current player not found in serializer context' )
		return obj.get_status( current_player )


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
		multiGame = MultiplayerGame.objects.filter( Q( player1=obj ) | Q( player2=obj ) | Q( player3=obj ) | Q( player4=obj ) )
		combined_data = list(chain(remoteGame , multiGame))

		combined_data.sort( key=lambda game: game.date_time , reverse=True)
		serializedGameHistory = []
		for game in combined_data :
			if isinstance(game, RemoteGame):
				serializer = GameSerializer(game, context={"current_player": obj}, model=RemoteGame).data
			elif isinstance(game, MultiplayerGame):
				serializer = GameSerializer(game, context={"current_player": obj}, model=MultiplayerGame).data
			serializedGameHistory.append( serializer )
		return serializedGameHistory


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
