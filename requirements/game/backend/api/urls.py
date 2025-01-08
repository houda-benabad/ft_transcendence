from django.urls import path, include
from .views import PlayerDetailView, leaderBoardView, MeDetailView

urlpatterns = [
    path( 'game/player_info/<int:userId>', PlayerDetailView.as_view(  ), name="PlayerInfo"),
    path( 'game/player_info/me', MeDetailView.as_view(  ), name="MeInfo"),
    path( 'game/leaderboard/', leaderBoardView.as_view(  ) , name="LeaderBoard"),
    
]
