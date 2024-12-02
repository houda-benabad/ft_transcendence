from django.urls import path

from . import views

urlpatterns = [
    path("send_request/<int:to_user_id>", views.send_friend_request_view),
    path("cancel_request/<int:to_user_id>", views.cancel_friend_request_view),
    path("accept_request/<int:request_id>", views.accept_friend_request_view),
    path("reject_request/<int:request_id>", views.reject_Friend_request_view),
    path("remove_friend/<int:friend_id>", views.remove_friend_view),
]