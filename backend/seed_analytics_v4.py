import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model
from apps.companies.models import CompanyProfile, CompanyService, CompanyReview, QuoteRequest

User = get_user_model()
user = User.objects.filter(username='company').first()
if not user:
    user = User.objects.create_user(username='company', email='company@example.com', password='password123', role='company')

reviewer_user = User.objects.filter(username='reviewer').first()
if not reviewer_user:
    reviewer_user = User.objects.create_user(username='reviewer', email='reviewer@example.com', password='password123', role='client')

profile, created = CompanyProfile.objects.get_or_create(user=user, defaults={'company_name': 'Kigali Prime Constructors Ltd'})

# Update profile traffic sources
profile.profile_views = 4218
profile.traffic_search = 45
profile.traffic_direct = 30
profile.traffic_recommendations = 15
profile.traffic_external = 10
profile.completed_tasks = 22
profile.average_rating = 4.7
profile.save()

# Make sure we have some services to show performance for
if profile.services.count() == 0:
    CompanyService.objects.create(
        company=profile, title="Commercial Construction", category="Construction", 
        pricing_model="Quote-based", status="Active", views=1820, quotes_count=54, acceptance_rate=22.0
    )
    CompanyService.objects.create(
        company=profile, title="Renovation", category="Renovation", 
        pricing_model="Fixed Price", status="Active", views=980, quotes_count=32, acceptance_rate=18.0
    )
else:
    # Update existing services with realistic stats
    services = profile.services.all()
    if services.count() >= 1:
        services[0].views = 1820
        services[0].quotes_count = 54
        services[0].acceptance_rate = 22.0
        services[0].save()
    if services.count() >= 2:
        services[1].views = 980
        services[1].quotes_count = 32
        services[1].acceptance_rate = 18.0
        services[1].save()

# Create some quotes so funnel has data
QuoteRequest.objects.filter(company=profile).delete()
# 126 requests total. 22 accepted. Let's just create 3 dummy ones to show something if needed, but actually funnel relies on count.
for _ in range(104):
    QuoteRequest.objects.create(company=profile, client_name='Dummy', service='Dummy', budget='100', deadline='TBD', status='pending')
for _ in range(22):
    QuoteRequest.objects.create(company=profile, client_name='Dummy', service='Dummy', budget='100', deadline='TBD', status='accepted')


# Create dummy reviews to generate the rating distribution
CompanyReview.objects.all().delete()
for _ in range(7): CompanyReview.objects.create(company=profile, reviewer=reviewer_user, rating=5, text="Great")
for _ in range(2): CompanyReview.objects.create(company=profile, reviewer=reviewer_user, rating=4, text="Good")
for _ in range(1): CompanyReview.objects.create(company=profile, reviewer=reviewer_user, rating=3, text="Okay")

print("Data seeded successfully!")
