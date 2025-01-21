from django.urls import path

from . import views

urlpatterns = [
	path('me/', views.profile_detail_view, name='current-user-profile-detail'),
	path('', views.Profile_list_view),
	path('<int:user__id>', views.other_user_profile_detail_view, name="other-user-profile-detail"),
	path('search/', views.search_users_profiles_view, name='search'),
	# path('picture_update_delete/', views.profile_pic_update_delete_view, name="pic-update")
]