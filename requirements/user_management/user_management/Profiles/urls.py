from django.urls import path

from . import views

urlpatterns = [
	path('me', views.profile_detail_view, name='current-user-profile-detail'),
	path('<int:user__id>', views.other_user_profile_detail_view, name="other-user-profile-detail"),
	path('search/', views.search_users_profiles_view, name='search'),
	path('set_avatar/', views.profile_picture_update_view, name="picture-modify"),
	path('base_profile', views.base_profile_view, name="base-user-profile"),
]