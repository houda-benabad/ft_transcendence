
from django.urls import path
from .views import profile_game_history_view

urlpatterns = [
    path('<int:user_id>', profile_game_history_view),
    path('me', profile_game_history_view)
    ]