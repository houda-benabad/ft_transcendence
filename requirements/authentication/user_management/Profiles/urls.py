from django.urls import path

from . import views

urlpatterns = [
	path('me/', views.profile_detail_view),
	path('', views.Profile_list_view),
	path('<int:user__id>', views.other_user_profile_detail_view, name="other-user-profile-detail")
]