from django.urls import path, include

from . import views

urlpatterns = [
    path('', include('djoser.urls')),
    path('', include('djoser.urls.authtoken')),
	path('oauth2/authorize', views.intraLogin),
    path('oauth2/callback', views.intraLoginRedirect),
]