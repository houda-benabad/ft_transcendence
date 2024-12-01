
from rest_framework.views import ApiView
from . import mixins

class	SendFriendshipRequest(mixins.SendFriendshipRequestMixin, ApiView):
    def	post(self, request, *args, **kwargs):
        return self.send_request(request, *args, **kwargs)

class	CancelFriendshipRequest(mixins.CancelFriendshipRequestMixin, ApiView):
    def	delete(self, request, *args, **kwargs):
        return self.cancel_request(request, *args, **kwargs)
    
class	AcceptFriendshipRequest(mixins.AcceptRequestMixin, ApiView):
    
    def post(self, request, *args, **kwargs):
        return self.accept_request(request, *args, **kwargs)

class	RejectFriendshipRequest(mixins.RejectRequestMixin, ApiView):

    def	patch(self, request, *args, **kwargs):
        return self.reject_request(request, *args, **kwargs)