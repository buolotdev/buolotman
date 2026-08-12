import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from apps.companies.models import CompanyProfile, QuoteRequest

profile = CompanyProfile.objects.first()
if profile:
    QuoteRequest.objects.all().delete()
    
    QuoteRequest.objects.create(
        company=profile,
        client_name='James M.',
        client_email='james@email.com',
        client_phone='+250 78 000 0000',
        service='Commercial Building',
        budget='$50,000 - $70,000',
        deadline='Feb 20, 2026',
        location='KG 123 Ave, Kigali, Rwanda',
        priority='Speed',
        project_summary='Commercial building construction (5 floors)',
        technical_details='Concrete structure, steel reinforcement, interior finishing',
        status='pending',
        attachments=[{'name': 'Blueprint.pdf', 'url': '#'}, {'name': 'Site-Photos.zip', 'url': '#'}]
    )
    
    QuoteRequest.objects.create(
        company=profile,
        client_name='Sarah L.',
        client_email='sarah.l@email.com',
        client_phone='+254 71 111 2222',
        service='Office Renovation',
        budget='$15,000 - $25,000',
        deadline='Mar 15, 2026',
        location='Nairobi, Kenya',
        priority='Quality',
        project_summary='Renovating 3 office floors with open-plan layout',
        technical_details='Demolition of non-load bearing walls, new HVAC setup, modern lighting.',
        status='approved',
        attachments=[{'name': 'FloorPlan.pdf', 'url': '#'}]
    )
    print('Quote requests seeded with detailed data.')
