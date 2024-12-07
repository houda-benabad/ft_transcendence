from django.urls import path, include

from . import views

urlpatterns = [
    path('', include('djoser.urls')),
    path('', include('djoser.urls.authtoken')),
	path('oauth2/authorize', views.intra_auth_view, name="intra-authorize"),
    path('oauth2/callback', views.intra_callback_view, name="intra-callback"),
]