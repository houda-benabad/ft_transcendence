from friendship.models import Friend, FriendshipRequest
from django.contrib.auth.models import User
from friendship.exceptions import AlreadyFriendsError, AlreadyExistsError
from django.core.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework import status

#add a default permission class in permissions.py to check if to_user=request.user for accept and reject

class	SendFriendshipRequestMixin:

    def send_request(self, request, *args, **kwargs):
        to_user_id = self.kwargs.get('to_user_id')

        try:
            to_user = User.objects.get(id=to_user_id)
            Friend.objects.add_friend(request.user, to_user)
        except User.DoesNotExist as e:
            Response({"Error": str(e)},status=status.HTTP_404_NOT_FOUND)
        except (ValidationError, AlreadyFriendsError, AlreadyExistsError) as e:
            return Response({"Error": str(e)},status=status.HTTP_400_BAD_REQUEST)

        return Response({"message": "Friendship request was sent."}, status=status.HTTP_201_CREATED)

class	CancelFriendshipRequestMixin:

    def cancel_request(self, request, *args, **kwargs):
        to_user_id = self.kwargs.get('to_user_id')

        try:
            to_user = User.objects.get(id=to_user_id)
            friendship_request = FriendshipRequest.objects.get(from_user=request.user, to_user=to_user)
            friendship_request.cancel()
        except User.DoesNotExist as e:
            Response({"Error": str(e)},status=status.HTTP_404_NOT_FOUND)
        except FriendshipRequest.DoesNotExist as e:
            return Response({"Error": str(e)},status=status.HTTP_404_NOT_FOUND)
        return Response(status=status.HTTP_204_NO_CONTENT)

class	AcceptRequestMixin:

    def accept_request(self, request, *args, **kwargs):
        request_id = self.kwargs.get('id')
        
        try:
            friendship_request = FriendshipRequest.objects.get(id=request_id)
            friendship_request.accept()
        except friendship_request.DoesNotExist as e:
            return Response({"Error": str(e)},status=status.HTTP_404_NOT_FOUND)
        return Response({"message": "Friendship request was accepted."}, status=status.HTTP_201_CREATED)

class	RejectRequestMixin:

    def reject_request(self, request, *args, **kwargs):
        request_id = self.kwargs.get('id')
        
        try:
            friendship_request = FriendshipRequest.objects.get(id=request_id)
            friendship_request.reject()
        except friendship_request.DoesNotExist as e:
            return Response({"Error": str(e)},status=status.HTTP_404_NOT_FOUND)
        return Response({"message": "Friendship request was rejected."}, status=status.HTTP_204_NO_CONTENT)
        