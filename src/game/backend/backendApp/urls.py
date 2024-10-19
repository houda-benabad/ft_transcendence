from django.urls import path
from . import views

urlpatterns = [
    path('', views.home_view, name="home" ),
    path('websiteLayout.html', views.layouts, name="layout" ),
    path('signup', views.layouts, name="layout" ),
    # path('/signin', views.layouts, name="layout" ),
    # path('/home', views.layouts, name="layout" ),
]
