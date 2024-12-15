from rest_framework import serializers
from game.models import Player, Game
from django.db.models import Q

        
class GameSerializer( serializers.ModelSerializer ):
    status = serializers.SerializerMethodField()
    points = serializers.SerializerMethodField()
    date_time = serializers.SerializerMethodField()
    type = serializers.CharField( default='remote')

    class Meta:
        model = Game
        fields = [
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
    class Meta:
        model = Player
        fields = [
            'points',
            'rank',
            'level',
            'game_history'
        ]
    

    def get_game_history( self, obj ):
        game = Game.objects.filter( Q( player1=obj ) | Q( player2=obj ) )
        return GameSerializer( game, many=True, context={ "current_player" : obj } ).data