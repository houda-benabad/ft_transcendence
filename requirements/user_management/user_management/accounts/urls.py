from django.urls import path, include
from rest_framework_simplejwt import views as jwt_views
from .views import CustomUserViewSet, UserViewSet
from . import views

urlpatterns = [
    path('auth/users/signup', CustomUserViewSet.as_view({'post': 'create'}), name='user-create'),
    path('api/users/<int:id>', UserViewSet.as_view({'get': 'retrieve'}), name='user'),
    path('api/users/me', UserViewSet.as_view({'get': 'me'}), name='current-user'),
    path("api/users/set_password", UserViewSet.as_view({'post': 'set_password'}), name="set-password"),
    path("api/users/set_username", views.set_username_api_view, name="set-username"),
    path("auth/users/signin", jwt_views.TokenObtainPairView.as_view(), name="jwt-create"),
    path("auth/jwt/refresh/", jwt_views.TokenRefreshView.as_view(), name="jwt-refresh"),
    path("auth/jwt/verify/", jwt_views.TokenVerifyView.as_view(), name="jwt-verify"),
	path('auth/oauth2/authorize', views.intra_auth_view, name="intra-authorize"),
    path('auth/oauth2/callback', views.intra_callback_view, name="intra-callback"),
]