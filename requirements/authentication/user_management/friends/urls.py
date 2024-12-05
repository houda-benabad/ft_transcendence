from django.urls import path

from . import views

urlpatterns = [
    path("send_request/<int:to_user_id>", views.send_friend_request_view, name="send-request"),
    path("cancel_request/<int:to_user_id>", views.cancel_friend_request_view, name="cancel-request"),
    path("accept_request/<int:from_user_id>", views.accept_friend_request_view, name="accept-request"),
    path("reject_request/<int:from_user_id>", views.reject_Friend_request_view, name="reject-request"),
    path("remove_friend/<int:friend_id>", views.remove_friend_view, name="remove-friend"),
]