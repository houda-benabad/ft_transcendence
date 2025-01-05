
from django.urls import path
from .views import profile_game_history_view

urlpatterns = [
    path('<int:user_id>', profile_game_history_view, name="other_user_detailed_profile"),
    path('me', profile_game_history_view, name="current_user_detailed_profile")
]