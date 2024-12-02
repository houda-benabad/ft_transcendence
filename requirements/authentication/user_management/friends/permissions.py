

class	RequestReceiverPermission:
    def has_permission(self, request, to_user):
        if request.user != to_user:
            return False
        return True