
from rest_framework.views import APIView
from . import mixins

class	SendFriendshipRequest(mixins.SendFriendshipRequestMixin, APIView):

    def	post(self, request, to_user_id):
        return self.send_request(request, to_user_id)

send_friend_request_view = SendFriendshipRequest.as_view()

class	CancelFriendshipRequest(mixins.CancelFriendshipRequestMixin, APIView):
    
    def	delete(self, request, to_user_id):
        return self.cancel_request(request, to_user_id)
    
cancel_friend_request_view = CancelFriendshipRequest.as_view()

class	AcceptFriendshipRequest(mixins.AcceptRequestMixin, APIView):
    
    def post(self, request, from_user_id):
        return self.accept_request(request, from_user_id)

accept_friend_request_view = AcceptFriendshipRequest.as_view()

class	RejectFriendshipRequest(mixins.RejectRequestMixin, APIView):

    def	delete(self, request, from_user_id):
        return self.reject_request(request, from_user_id)

reject_Friend_request_view = RejectFriendshipRequest.as_view()

class	RemoveFriend(mixins.RemoveFriendMixin, APIView):
        
    def	delete(self, request, friend_id):
        return self.remove_friend(request, friend_id)

remove_friend_view = RemoveFriend.as_view()