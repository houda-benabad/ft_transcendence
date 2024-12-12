from django.urls import path, include
from rest_framework_simplejwt import views as jwt_views
from . import views

urlpatterns = [
    path('', include('djoser.urls')),
    path('', include('djoser.urls.authtoken')),
    # path("jwt/create/", jwt_views.TokenObtainPairView.as_view(), name="jwt-create"),
    # path("jwt/refresh/", jwt_views.TokenRefreshView.as_view(), name="jwt-refresh"),
    # path("jwt/verify/", jwt_views.TokenVerifyView.as_view(), name="jwt-verify"),
	path('oauth2/authorize', views.intra_auth_view, name="intra-authorize"),
    path('oauth2/callback', views.intra_callback_view, name="intra-callback"),
]