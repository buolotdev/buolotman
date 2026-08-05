import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
django.setup()

from apps.accounts.models import User
from apps.tasks.models import Task
from apps.governance.models import Dispute

admin = User.objects.filter(role='ADMIN').first()
client = User.objects.filter(role='CLIENT').first()
tech = User.objects.filter(role='TECHNICIAN').first()

if not client or not tech:
    client = User.objects.create(email='client_dispute@example.com', username='client_dispute', role='CLIENT')
    tech = User.objects.create(email='tech_dispute@example.com', username='tech_dispute', role='TECHNICIAN')

task = Task.objects.first()

if task:
    Dispute.objects.get_or_create(
        task=task,
        opened_by=client,
        against=tech,
        reason='poor_quality',
        title='Bad plumbing job',
        description='The pipes are still leaking after the technician left.',
        status='open'
    )

    Dispute.objects.get_or_create(
        task=task,
        opened_by=tech,
        against=client,
        reason='non_payment',
        title='Client refusing to pay',
        description='I finished the work but the client is not releasing escrow.',
        status='under_review'
    )

print('Added dummy disputes.')
