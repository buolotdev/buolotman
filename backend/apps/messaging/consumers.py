from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from django.utils import timezone

from .models import Conversation


class ConversationConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.user = self.scope.get('user')
        self.conversation_id = int(self.scope['url_route']['kwargs']['conversation_id'])
        if not self.user or not await self._is_participant():
            await self.close(code=4403)
            return

        self.group_name = f'conversation_{self.conversation_id}'
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()
        await self._touch_presence()
        await self.send_json({'type': 'ready', 'conversation_id': self.conversation_id})
        await self.channel_layer.group_send(
            self.group_name,
            {'type': 'presence_event', 'user_id': self.user.id, 'is_online': True},
        )

    async def disconnect(self, close_code):
        if hasattr(self, 'group_name'):
            await self.channel_layer.group_send(
                self.group_name,
                {'type': 'presence_event', 'user_id': self.user.id, 'is_online': False},
            )
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive_json(self, content, **kwargs):
        # Messages are created through the authenticated REST endpoint. The
        # socket is intentionally receive-only to keep one validation path.
        if content.get('type') == 'ping':
            await self._touch_presence()
            await self.send_json({'type': 'pong'})

    async def presence_event(self, event):
        await self.send_json({
            'type': 'presence',
            'user_id': event['user_id'],
            'is_online': event['is_online'],
        })

    async def chat_message(self, event):
        await self.send_json(event['payload'])

    @database_sync_to_async
    def _is_participant(self):
        return Conversation.objects.filter(
            id=self.conversation_id,
            participants=self.user,
        ).exists()

    @database_sync_to_async
    def _touch_presence(self):
        self.user.last_seen = timezone.now()
        self.user.save(update_fields=['last_seen'])
