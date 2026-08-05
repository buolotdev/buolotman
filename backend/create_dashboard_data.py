import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
django.setup()

from apps.accounts.models import User
from apps.tasks.models import Task, Milestone
from apps.governance.models import Dispute

# 1. Create Users
c1, _ = User.objects.get_or_create(email='john@example.com', defaults={'username': 'john1', 'first_name': 'John', 'last_name': 'Mukasa', 'role': 'CLIENT'})
c2, _ = User.objects.get_or_create(email='africa@example.com', defaults={'username': 'africa1', 'first_name': 'Africa', 'last_name': 'Holdings', 'role': 'CLIENT'})

t1, _ = User.objects.get_or_create(email='kigali@example.com', defaults={'username': 'kigali1', 'first_name': 'Kigali', 'last_name': 'Prime', 'role': 'COMPANY'})
t2, _ = User.objects.get_or_create(email='buildpro@example.com', defaults={'username': 'buildpro1', 'first_name': 'BuildPro', 'last_name': 'Africa', 'role': 'COMPANY'})

# 2. Create Active Tasks
task1, _ = Task.objects.get_or_create(
    title='Residential Renovation',
    client=c1,
    defaults={'status': 'in_progress', 'description': 'Renovation work'}
)
task1.status = 'in_progress'
task1.technician = t1
task1.save()

task2, _ = Task.objects.get_or_create(
    title='Office Complex Build',
    client=c2,
    defaults={'status': 'open', 'description': 'Build new office'}
)
task2.status = 'open'
task2.technician = t2
task2.save()

# 3. Create Milestones for pending validations
Milestone.objects.get_or_create(
    task=task2,
    title='Phase 1 Foundation',
    defaults={'status': 'Awaiting Client', 'amount': 100.00}
)

# 4. Create Disputes
Dispute.objects.get_or_create(
    task=task2,
    title='Late Delivery Issue',
    opened_by=c2,
    defaults={
        'status': 'OPEN',
        'reason': 'late_delivery',
        'description': 'Contractor did not finish foundation on time'
    }
)

print('Dummy data inserted for Dashboard.')
