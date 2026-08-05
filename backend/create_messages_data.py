import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
django.setup()

from apps.accounts.models import User
from apps.tasks.models import Task
from apps.messaging.models import Conversation, Message

admin = User.objects.first()
client = User.objects.last()

task = Task.objects.first()

c1, _ = Conversation.objects.get_or_create(task=task)
c1.participants.add(client, admin)
Message.objects.get_or_create(conversation=c1, sender=client, text='Hi, when can you start the project?')
Message.objects.get_or_create(conversation=c1, sender=admin, text='I will arrive at 10 AM tomorrow.')

c2, _ = Conversation.objects.get_or_create(task=None)
c2.participants.add(client, admin)
Message.objects.get_or_create(conversation=c2, sender=client, text='Why is my account blocked?')
Message.objects.get_or_create(conversation=c2, sender=admin, text='Your ID has been rejected due to blurriness.')

print('Added dummy conversations.')
