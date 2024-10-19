from django.urls import path
from . import views

urlpatterns = [
    path('', views.home_view, name="home" ),
    path('websiteLayout', views.layouts, name="websiteLayout" ),
    path('signup', views.signup, name="signup" ),
    path('signin', views.signin, name="signin" ),
    # path('/home', views.layouts, name="layout" ),
]
