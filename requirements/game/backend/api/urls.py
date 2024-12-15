from django.urls import path, include
from .views import PlayerDetailView

urlpatterns = [
    path( 'game/info/player/<str:username>', PlayerDetailView.as_view(  ), name="PlayerInfo"),
    # path( 'api/game/info/game/<str:username>/', views.ListGameHistoryView, name="GameHistory"),
]
