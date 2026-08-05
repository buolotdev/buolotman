import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
django.setup()

from apps.accounts.models import User

# Create unverified Users
User.objects.get_or_create(email='pending1@example.com', defaults={'username': 'pending1', 'first_name': 'Pending', 'last_name': 'Tech', 'role': 'TECHNICIAN', 'is_verified': False})
User.objects.get_or_create(email='pending2@example.com', defaults={'username': 'pending2', 'first_name': 'New', 'last_name': 'Company', 'role': 'COMPANY', 'is_verified': False})

print('Added unverified users for Verification queue.')
