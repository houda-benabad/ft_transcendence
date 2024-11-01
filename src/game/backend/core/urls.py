from django.urls import path
from . import views


urlpatterns = [
    path('home', views.home_view, name="home" ),
    path('websiteLayout', views.layouts, name="websiteLayout" ),
]
