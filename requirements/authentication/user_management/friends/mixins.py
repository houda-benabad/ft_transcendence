from friendship.models import Friend, FriendshipRequest
from django.contrib.auth.models import User
from friendship.exceptions import AlreadyFriendsError, AlreadyExistsError
from django.core.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework import status
from .permissions import RequestReceiverPermission

class	SendFriendshipRequestMixin:

    def send_request(self, request, to_user_id):

        try:
            to_user = User.objects.get(id=to_user_id)
            Friend.objects.add_friend(request.user, to_user)

        except User.DoesNotExist as e:
            return Response({"detail": str(e)},status=status.HTTP_404_NOT_FOUND)
        except (ValidationError, AlreadyFriendsError, AlreadyExistsError) as e:
            return Response({"detail": str(e)},status=status.HTTP_400_BAD_REQUEST)

        return Response({"message": "Friendship request was sent."}, status=status.HTTP_201_CREATED)


class	CancelFriendshipRequestMixin:

    def cancel_request(self, request, to_user_id):

        try:
            to_user = User.objects.get(id=to_user_id)
            friendship_request = FriendshipRequest.objects.get(from_user=request.user, to_user=to_user)
            friendship_request.cancel()

        except User.DoesNotExist as e:
            return Response({"detail": str(e)},status=status.HTTP_404_NOT_FOUND)
        except FriendshipRequest.DoesNotExist as e:
            return Response({"detail": str(e)},status=status.HTTP_404_NOT_FOUND)

        return Response(status=status.HTTP_204_NO_CONTENT)


class	AcceptRequestMixin(RequestReceiverPermission):

    def accept_request(self, request, request_id):
        
        try:
            friendship_request = FriendshipRequest.objects.get(id=request_id)
            if not self.has_permission(request, friendship_request.to_user):
                return Response({"detail": "you do not have permission to accept this friendship request"}, status=status.HTTP_403_FORBIDDEN) #
            friendship_request.accept()

        except FriendshipRequest.DoesNotExist as e:
            return Response({"detail": str(e)},status=status.HTTP_404_NOT_FOUND)

        return Response({"message": "Friendship request was accepted."}, status=status.HTTP_201_CREATED)


class	RejectRequestMixin(RequestReceiverPermission):

    def reject_request(self, request, request_id):
        
        try:
            friendship_request = FriendshipRequest.objects.get(id=request_id)
            if not self.has_permission(request, friendship_request.to_user):
                return Response({"detail": "you do not have permission to reject this friendship request"}, status=status.HTTP_403_FORBIDDEN) //
            friendship_request.reject()
            
        except FriendshipRequest.DoesNotExist as e:
            return Response({"detail": str(e)},status=status.HTTP_404_NOT_FOUND)

        return Response({"message": "Friendship request was rejected."}, status=status.HTTP_204_NO_CONTENT)

class	RemoveFriendMixin:

    def remove_friend(self, request, friend_id):

        try:
            to_user = User.objects.get(id=friend_id)
            removed = Friend.objects.remove_friend(request.user, to_user)
            if not removed:
                return Response({"detail": "there is no friendship relationship between you and that user"}, status=status.HTTP_404_NOT_FOUND)

        except User.DoesNotExist as e:
            return Response({"detail": str(e)},status=status.HTTP_404_NOT_FOUND)

        return Response(status=status.HTTP_204_NO_CONTENT)


# the rejected requests since weren't deleted still appear in the requests lists of the user