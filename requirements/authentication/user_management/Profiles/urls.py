from django.urls import path

from . import views

urlpatterns = [
	path('me/', views.profile_detail_view),
	path('', views.Profile_list_view)
]