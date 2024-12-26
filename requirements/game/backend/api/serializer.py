from rest_framework import serializers
from game.models import Player, Game
from django.db.models import Q
from django.contrib.auth.models import User


        
class GameSerializer( serializers.ModelSerializer ):
    status = serializers.SerializerMethodField()
    points = serializers.SerializerMethodField()
    date_time = serializers.SerializerMethodField()
    type = serializers.CharField( default='remote')

    class Meta:
        model = Game
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
        

class PlayerSerializer( serializers.ModelSerializer ):
    game_history = serializers.SerializerMethodField()
    general_details = serializers.SerializerMethodField()
    class Meta:
        model = Player
        fields = [
            "general_details",
            'game_history'
        ]
        
    def get_rank( self, obj ):
        players = Player.objects.order_by( "-points" )
        rank = list(players).index(obj) + 1
        return rank
        
    def get_general_details( self, obj ):
        return {
            "total_points": obj.points,
            "total_games": obj.games,
            "rank": self.get_rank( obj ),
            "level": obj.level
        }

    

    def get_game_history( self, obj ):
        game = Game.objects.filter( Q( player1=obj ) | Q( player2=obj ) )
        return GameSerializer( game, many=True, context={ "current_player" : obj } ).data

class PlayerRankSerializer( serializers.ModelSerializer ):
    rank = serializers.SerializerMethodField()
    username = serializers.SerializerMethodField()
    class Meta:
        model= Player
        fields=[
            'id',
            'rank',
            'username',
            'total_games'
        ]

    def get_rank( self, obj ):
        players = Player.objects.order_by( "-total_points" )
        rank = list(players).index(obj) + 1
        return rank
    def get_username( self, obj ):
        user = User.objects.filter( id=obj.userId ).first(  )
        return user.username