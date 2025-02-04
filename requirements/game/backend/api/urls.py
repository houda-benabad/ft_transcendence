from django.urls import path, include
from .views import PlayerDetailView, leaderBoardView,  NewPlayerView, UpdatePlayerView

urlpatterns = [
    path( 'game/player_info/<int:userId>', PlayerDetailView.as_view(  ), name="PlayerInfo"),
    path( 'game/player_info/me', PlayerDetailView.as_view(  ), name="MeInfo"),
    path( 'game/new_player', NewPlayerView.as_view(  ), name="NewPlayer"),
    path( 'game/update_player/<int:userId>', UpdatePlayerView.as_view(  ), name="UpdatePlayer"),
    path( 'game/leaderboard/', leaderBoardView.as_view(  ) , name="LeaderBoard"),
    
]
