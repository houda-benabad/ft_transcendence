from django.urls import path, include
from rest_framework_simplejwt import views as jwt_views
from . import views
from djoser.views import UserViewSet

urlpatterns = [
    # path('users/', include('djoser.urls')),
    # path('', include('djoser.urls.authtoken')),
    path('users/signup/', UserViewSet.as_view({'post': 'create'}), name='user-create'),
    path('users/<int:id>', UserViewSet.as_view({'get': 'retrieve'}), name='user'),
    path("users/signin/", jwt_views.TokenObtainPairView.as_view(), name="jwt-create"),
    path("jwt/refresh/", jwt_views.TokenRefreshView.as_view(), name="jwt-refresh"),
    path("jwt/verify/", jwt_views.TokenVerifyView.as_view(), name="jwt-verify"),
	path('oauth2/authorize', views.intra_auth_view, name="intra-authorize"),
    path('oauth2/callback', views.intra_callback_view, name="intra-callback"),
]