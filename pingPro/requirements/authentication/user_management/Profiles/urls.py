from django.urls import path

from . import views

urlpatterns = [
	path('<str:user__username>/', views.profile_detail_view),
]