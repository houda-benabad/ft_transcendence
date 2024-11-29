from django.urls import path

from . import views

urlpatterns = [
	path('<int:user__id>/', views.other_user_profile_detail_view),
	path('<int:user__id>/', views.other_user_basic_profile_detail_view)
]