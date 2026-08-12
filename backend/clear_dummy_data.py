import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
django.setup()

from apps.accounts.models import User, TechnicianProfile, TechnicianService
from apps.companies.models import CompanyProfile
from apps.tasks.models import Task, Milestone
from apps.governance.models import Dispute

print("Deleting dummy data...")

# Delete disputes
Dispute.objects.all().delete()

# Delete tasks and milestones
Milestone.objects.all().delete()
Task.objects.all().delete()

# Delete services
TechnicianService.objects.all().delete()

# Delete profiles
CompanyProfile.objects.all().delete()
TechnicianProfile.objects.all().delete()

# Delete non-superuser users
users_deleted, _ = User.objects.filter(is_superuser=False, is_staff=False).delete()
print(f"Deleted {users_deleted} dummy users.")

print("Dummy data successfully removed.")
