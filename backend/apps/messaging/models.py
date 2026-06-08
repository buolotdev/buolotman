from django.db import models
from django.conf import settings


class Conversation(models.Model):
    task = models.ForeignKey('tasks.Task', on_delete=models.SET_NULL, null=True, blank=True, related_name='conversations')
    participants = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='conversations')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_message_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'messaging_conversation'
        indexes = [
            models.Index(fields=['-last_message_at']),
        ]
        ordering = ['-last_message_at']

    def __str__(self):
        return f'Conversation {self.id}'


class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_messages')
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    read_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'messaging_message'
        indexes = [
            models.Index(fields=['conversation']),
            models.Index(fields=['sender']),
            models.Index(fields=['-created_at']),
        ]
        ordering = ['-created_at']

    def __str__(self):
        return f'Message from {self.sender.email}'
