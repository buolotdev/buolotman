from apps.companies.models import CompanyProfile, QuoteRequest, CompanyActivity

profile = CompanyProfile.objects.first()
if profile:
    QuoteRequest.objects.get_or_create(company=profile, client_name='James M.', service='Commercial Building', budget='$50,000 - $70,000', deadline='Feb 20, 2026', status='pending')
    QuoteRequest.objects.get_or_create(company=profile, client_name='Linda K.', service='Renovation', budget='$8,000 - $12,000', deadline='Feb 10, 2026', status='approved')
    CompanyActivity.objects.get_or_create(company=profile, text='Your profile was viewed by a client (2 hours ago)', icon_type='view')
    CompanyActivity.objects.get_or_create(company=profile, text='New quote request received (Yesterday)', icon_type='quote')
    CompanyActivity.objects.get_or_create(company=profile, text='New 5-star review received (2 days ago)', icon_type='review')
    CompanyActivity.objects.get_or_create(company=profile, text='Project marked as completed (Last week)', icon_type='project')
    profile.profile_views = 1248
    profile.save()
    print('Dummy data added to profile:', profile.company_name)
