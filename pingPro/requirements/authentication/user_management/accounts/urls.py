from django.urls import path, include

from . import views

urlpatterns = [
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.authtoken')),
	path('oauth2/login/', views.intraLogin),
    path('oauth2/login/redirect', views.intraLoginRedirect)
]