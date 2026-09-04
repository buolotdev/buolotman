from django.utils import timezone
from django.utils.deprecation import MiddlewareMixin
from rest_framework_simplejwt.authentication import JWTAuthentication

class UpdateLastSeenMiddleware(MiddlewareMixin):
    """
    Middleware that updates user's last_seen timestamp on authenticated requests.
    Throttled to update at most once every 60 seconds per user to eliminate DB overhead.
    """
    def process_request(self, request):
        user = getattr(request, 'user', None)
        
        # If user is not authenticated yet, check Authorization: Bearer <jwt>
        if not user or not user.is_authenticated:
            auth_header = request.META.get('HTTP_AUTHORIZATION')
            if auth_header and auth_header.startswith('Bearer '):
                try:
                    jwt_auth = JWTAuthentication()
                    validated_token = jwt_auth.get_validated_token(auth_header.split(' ')[1])
                    user = jwt_auth.get_user(validated_token)
                    request.user = user
                except Exception:
                    user = None

        if user and user.is_authenticated:
            now = timezone.now()
            # Update only if last_seen is None or was updated > 60 seconds ago
            if not user.last_seen or (now - user.last_seen).total_seconds() > 60:
                user.last_seen = now
                try:
                    user.save(update_fields=['last_seen'])
                except Exception:
                    pass
