import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
django.setup()

from apps.accounts.models import User
from apps.tasks.models import Task, TaskReview

# Create some users if needed
client = User.objects.filter(role='CLIENT').first()
tech = User.objects.filter(role='TECHNICIAN').first()

if not client:
    client = User.objects.create_user(email='client123@example.com', password='password123', first_name='John', last_name='Doe', role='CLIENT')
if not tech:
    tech = User.objects.create_user(email='tech123@example.com', password='password123', first_name='Jane', last_name='Smith', role='TECHNICIAN')

# Create a dummy task
task, _ = Task.objects.get_or_create(
    title='Fix plumbing in bathroom',
    client=client,
    status='published',
    description='Need help with plumbing'
)

# Create 3 reviews
TaskReview.objects.get_or_create(
    task=task,
    reviewer=client,
    target_user=tech,
    rating=5,
    comment="Excellent work! Highly recommended.",
    status="Published"
)

TaskReview.objects.get_or_create(
    task=task,
    reviewer=client,
    target_user=tech,
    rating=2,
    comment="He arrived late and the wiring looks messy.",
    status="Pending Review"
)

TaskReview.objects.get_or_create(
    task=task,
    reviewer=client,
    target_user=tech,
    rating=1,
    comment="Abusive language used. Avoid this technician.",
    status="Hidden"
)

print('Dummy reviews created.')
