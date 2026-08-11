from django.db import models
from django.conf import settings


class CompanyProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='company_profile')
    company_name = models.CharField(max_length=255)
    registration_number = models.CharField(max_length=100, blank=True)
    services_offered = models.JSONField(default=list, blank=True)
    company_size = models.CharField(max_length=50, blank=True)
    year_founded = models.CharField(max_length=4, blank=True)
    industry = models.CharField(max_length=255, blank=True)
    subject_title = models.CharField(max_length=255, blank=True)
    logo_url = models.URLField(blank=True, max_length=500)
    cover_url = models.URLField(blank=True, max_length=500)
    about = models.TextField(blank=True)
    website = models.URLField(blank=True)
    headquarters = models.CharField(max_length=255, blank=True)
    country = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=255, blank=True)
    latitude = models.CharField(max_length=50, blank=True)
    longitude = models.CharField(max_length=50, blank=True)
    areas_of_expertise = models.JSONField(default=list, blank=True)
    business_hours = models.JSONField(default=list, blank=True)
    is_verified = models.BooleanField(default=False)
    average_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    review_count = models.PositiveIntegerField(default=0)
    team_size = models.PositiveIntegerField(default=0)
    completed_tasks = models.PositiveIntegerField(default=0)
    response_time = models.CharField(max_length=50, blank=True)
    profile_views = models.PositiveIntegerField(default=0)
    traffic_search = models.PositiveIntegerField(default=0)
    traffic_direct = models.PositiveIntegerField(default=0)
    traffic_recommendations = models.PositiveIntegerField(default=0)
    traffic_external = models.PositiveIntegerField(default=0)
    
    # Preferences & Settings
    currency = models.CharField(max_length=10, default='USD')
    auto_accept_visits = models.BooleanField(default=False)
    notif_email = models.BooleanField(default=True)
    notif_sms = models.BooleanField(default=False)
    notif_inapp = models.BooleanField(default=True)
    privacy_public = models.BooleanField(default=True)
    privacy_show_phone = models.BooleanField(default=False)
    privacy_show_email = models.BooleanField(default=False)
    privacy_search = models.BooleanField(default=True)
    sec_2fa = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'companies_profile'
        verbose_name_plural = 'Company profiles'

    def __str__(self):
        return self.company_name


class CompanyProject(models.Model):
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('pending', 'Pending Start'),
        ('completed', 'Completed'),
    )
    PAYMENT_STATUS_CHOICES = (
        ('funded', 'Funded in Escrow'),
        ('awaiting', 'Awaiting Deposit'),
        ('paid', 'Fully Paid'),
    )

    company = models.ForeignKey(CompanyProfile, on_delete=models.CASCADE, related_name='projects')
    title = models.CharField(max_length=255)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    client_name = models.CharField(max_length=255, blank=True)
    budget = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    timeline = models.CharField(max_length=255, blank=True)
    milestones_total = models.PositiveIntegerField(default=0)
    milestones_completed = models.PositiveIntegerField(default=0)
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='awaiting')
    location = models.CharField(max_length=255, blank=True)
    progress = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'companies_project'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.title} - {self.company.company_name}'


class CompanyService(models.Model):
    company = models.ForeignKey(CompanyProfile, on_delete=models.CASCADE, related_name='services')
    title = models.CharField(max_length=255)
    category = models.CharField(max_length=255, blank=True)
    pricing_model = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=50, default='Active')
    views = models.PositiveIntegerField(default=0)
    quotes_count = models.PositiveIntegerField(default=0)
    acceptance_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    description = models.TextField(blank=True)
    images = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'companies_service'
        ordering = ['title']

    def __str__(self):
        return self.title


class CompanyCertification(models.Model):
    company = models.ForeignKey(CompanyProfile, on_delete=models.CASCADE, related_name='certifications')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'companies_certification'
        ordering = ['title']

    def __str__(self):
        return self.title


class CompanyReview(models.Model):
    company = models.ForeignKey(CompanyProfile, on_delete=models.CASCADE, related_name='reviews')
    reviewer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='company_reviews')
    rating = models.PositiveIntegerField()
    text = models.TextField(blank=True)
    service = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'companies_review'
        ordering = ['-created_at']

    def __str__(self):
        return f'Review by {self.reviewer.email} for {self.company.company_name}'


class CompanyTeamMember(models.Model):
    company = models.ForeignKey(CompanyProfile, on_delete=models.CASCADE, related_name='team_members')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='company_memberships', null=True, blank=True)
    name = models.CharField(max_length=255)
    role = models.CharField(max_length=100)
    email = models.EmailField(blank=True)
    status = models.CharField(max_length=20, default='active')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'companies_team_member'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.name} - {self.company.company_name}'


class QuoteRequest(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )

    company = models.ForeignKey(CompanyProfile, on_delete=models.CASCADE, related_name='quote_requests')
    client_name = models.CharField(max_length=255)
    client_email = models.EmailField(blank=True, null=True)
    client_phone = models.CharField(max_length=50, blank=True, null=True)
    service = models.CharField(max_length=255)
    budget = models.CharField(max_length=100, blank=True)
    deadline = models.CharField(max_length=100, blank=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    priority = models.CharField(max_length=50, blank=True, null=True)
    project_summary = models.TextField(blank=True, null=True)
    technical_details = models.TextField(blank=True, null=True)
    attachments = models.JSONField(blank=True, null=True, default=list)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'companies_quote_request'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.client_name} - {self.service}'


class CompanyActivity(models.Model):
    company = models.ForeignKey(CompanyProfile, on_delete=models.CASCADE, related_name='activities')
    text = models.CharField(max_length=500)
    icon_type = models.CharField(max_length=50, blank=True) # e.g. 'view', 'quote', 'review', 'project'
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'companies_activity'
        ordering = ['-created_at']

    def __str__(self):
        return self.text
