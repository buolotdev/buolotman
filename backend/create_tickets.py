import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
django.setup()

from apps.accounts.models import User
from apps.governance.models import SupportTicket, SupportMessage

client = User.objects.filter(role='CLIENT').first()
if not client: client = User.objects.first()

tech = User.objects.filter(role='TECHNICIAN').first()
if not tech: tech = User.objects.last()

admin = User.objects.filter(role='ADMIN').first()
if not admin: admin = User.objects.first()

# Ticket 1
t1 = SupportTicket.objects.create(
    subject="Payment not released",
    client=client,
    status="pending"
)
SupportMessage.objects.create(
    ticket=t1,
    sender=client,
    body="My milestone payment is still on hold even though the technician finished the job."
)

# Ticket 2
t2 = SupportTicket.objects.create(
    subject="Account verification issue",
    client=tech,
    status="awaiting_response"
)
SupportMessage.objects.create(
    ticket=t2,
    sender=tech,
    body="I uploaded my ID card but my account is still not verified. What else do I need to provide?"
)
SupportMessage.objects.create(
    ticket=t2,
    sender=admin,
    body="Hi, your ID image was blurry. Could you please re-upload a clear picture?"
)

# Ticket 3
t3 = SupportTicket.objects.create(
    subject="Project dispute",
    client=client,
    status="escalated"
)
SupportMessage.objects.create(
    ticket=t3,
    sender=client,
    body="The technician disappeared after starting the project. Please escalate this."
)

print('Dummy tickets created.')
