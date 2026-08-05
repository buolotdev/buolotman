import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
django.setup()

from apps.accounts.models import User
from apps.wallet.models import Wallet, Transaction

# Create wallets for existing users
users = User.objects.all()
for u in users:
    w, created = Wallet.objects.get_or_create(user=u, defaults={'available_balance': 50000.00})
    if not created:
        w.available_balance += 50000
        w.save()

# Get an admin user and client
client = User.objects.filter(role='CLIENT').first()
w_client = Wallet.objects.filter(user=client).first() if client else None

if w_client:
    Transaction.objects.get_or_create(wallet=w_client, amount=5000, type='deposit', status='completed', description='Client deposit')
    Transaction.objects.get_or_create(wallet=w_client, amount=12000, type='escrow', status='completed', description='Escrow for task')
    Transaction.objects.get_or_create(wallet=w_client, amount=800, type='fee', status='completed', description='Platform fee')
    Transaction.objects.get_or_create(wallet=w_client, amount=4000, type='withdrawal', status='pending', description='Client withdrawal')

print('Added wallet transactions.')
