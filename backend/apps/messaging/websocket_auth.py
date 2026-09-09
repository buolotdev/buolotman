from urllib.parse import parse_qs

from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from django.conf import settings


class JwtAuthMiddleware:
    """
    JWT authentication middleware for Django Channels WebSocket connections.
    Reads token from query string: ws://.../?token=<access_token>
    Sets scope['user'] to the authenticated user or AnonymousUser.
    """

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        scope['user'] = await self._get_user(scope)
        return await self.app(scope, receive, send)

    @database_sync_to_async
    def _get_user(self, scope):
        from django.contrib.auth import get_user_model
        from rest_framework_simplejwt.tokens import AccessToken
        from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

        User = get_user_model()

        query_string = scope.get('query_string', b'').decode()
        params = parse_qs(query_string)
        token_list = params.get('token', [])

        if not token_list:
            return AnonymousUser()

        raw_token = token_list[0]
        try:
            validated_token = AccessToken(raw_token)
            user_id = validated_token['user_id']
            return User.objects.get(id=user_id)
        except (InvalidToken, TokenError, User.DoesNotExist, KeyError):
            return AnonymousUser()
