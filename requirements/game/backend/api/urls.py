from django.urls import path, include
from .views import PlayerDetailView, leaderBoardView

urlpatterns = [
    path( 'game/player_info/<str:username>', PlayerDetailView.as_view(  ), name="PlayerInfo"),
    path( 'game/leaderboard/', leaderBoardView.as_view(  ) , name="LeaderBoard"),
    
]
