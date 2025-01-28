from friendship.models import Friend, FriendshipRequest
from django.contrib.auth import get_user_model
from friendship.exceptions import AlreadyFriendsError, AlreadyExistsError
from django.core.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework import status

User = get_user_model()

class	SendFriendshipRequestMixin:

    def send_request(self, request, to_user_id):
 
        try:
            to_user = User.objects.get(id=to_user_id)
            Friend.objects.add_friend(request.user, to_user)

        except User.DoesNotExist as e:
            return Response({"detail": str(e)},status=status.HTTP_404_NOT_FOUND)
        except (ValidationError, AlreadyFriendsError, AlreadyExistsError) as e:
            return Response({"detail": str(e)},status=status.HTTP_400_BAD_REQUEST)

        return Response({"message": "Friendship request was sent successfully."}, status=status.HTTP_201_CREATED)


class	CancelFriendshipRequestMixin:

    def cancel_request(self, request, to_user_id):

        try:
            to_user = User.objects.get(id=to_user_id)
            friendship_request = FriendshipRequest.objects.get(from_user=request.user, to_user=to_user)
            friendship_request.cancel()

        except (User.DoesNotExist, FriendshipRequest.DoesNotExist) as e:
            return Response({"detail": str(e)},status=status.HTTP_404_NOT_FOUND)

        return Response({"message": "Friendship request was canceled successfully."}, status=status.HTTP_204_NO_CONTENT)


class	AcceptRequestMixin:

    def accept_request(self, request, from_user_id):
        
        try:
            from_user = User.objects.get(id=from_user_id)
            friendship_request = FriendshipRequest.objects.get(from_user=from_user, to_user=request.user)
            friendship_request.accept()

        except (User.DoesNotExis, FriendshipRequest.DoesNotExist) as e:
            return Response({"detail": str(e)},status=status.HTTP_404_NOT_FOUND)

        return Response({"message": "Friendship request was accepted successfully."}, status=status.HTTP_201_CREATED)


class	RejectRequestMixin:

    def reject_request(self, request, from_user_id):
        
        try:
            from_user = User.objects.get(id=from_user_id)
            friendship_request = FriendshipRequest.objects.get(from_user=from_user, to_user=request.user)
            friendship_request.reject()
            friendship_request.delete()
            
        except (User.DoesNotExis, FriendshipRequest.DoesNotExist) as e:
            return Response({"detail": str(e)},status=status.HTTP_404_NOT_FOUND)

        return Response({"message": "Friendship request was rejected successfully."}, status=status.HTTP_204_NO_CONTENT)


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
