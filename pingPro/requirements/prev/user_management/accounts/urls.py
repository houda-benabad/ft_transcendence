from django.urls import path

from . import views

urlpatterns = [
	path('intra/auth/', views.intraLogin),
    path('login/redirect', views.intraLoginRedirect)
]