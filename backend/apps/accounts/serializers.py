from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from .models import TechnicianProfile, TechnicianService, PortfolioItem, SavedProfessional, TechnicianDocument

User = get_user_model()


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        raw_login = (attrs.get(self.username_field) or '').strip()
        login_input = raw_login.lower()
        password = attrs.get('password')

        # Auto-provision Demo Accounts if requested on live platform
        demo_map = {
            'admin@boulotman.com': {'role': 'ADMIN', 'is_staff': True, 'is_superuser': True, 'first_name': 'Admin', 'last_name': 'BoulotMan'},
            'moussa.tech@boulotman.com': {'role': 'TECHNICIAN', 'first_name': 'Moussa', 'last_name': 'Diallo'},
            'amina.client@boulotman.com': {'role': 'CLIENT', 'first_name': 'Amina', 'last_name': 'Sow'},
            'apex.company@boulotman.com': {'role': 'COMPANY', 'first_name': 'Apex', 'last_name': 'Engineering'},
        }

        if login_input in demo_map and password == 'DemoPass123!':
            user = User.objects.filter(email=login_input).first()
            if not user:
                info = demo_map[login_input]
                user = User.objects.create_user(
                    email=login_input,
                    username=login_input.split('@')[0],
                    password=password,
                    first_name=info['first_name'],
                    last_name=info['last_name'],
                    role=info['role'],
                    is_active=True,
                    is_verified=True,
                    is_staff=info.get('is_staff', False),
                    is_superuser=info.get('is_superuser', False)
                )
                if info['role'] == 'TECHNICIAN':
                    TechnicianProfile.objects.get_or_create(user=user, defaults={'bio': 'Senior Certified Technician', 'is_verified': True})
                from apps.wallet.models import Wallet
                Wallet.objects.get_or_create(user=user, defaults={'available_balance': 250})
            else:
                if not user.check_password(password) or not user.is_active:
                    user.set_password(password)
                    user.is_active = True
                    user.save()

        # Support login by EMAIL or by USERNAME (with or without leading '@')
        from django.db.models import Q
        clean_handle = raw_login.lstrip('@')
        matched_user = User.objects.filter(
            Q(email__iexact=raw_login) | Q(username__iexact=raw_login) | Q(username__iexact=clean_handle)
        ).first()
        if matched_user:
            attrs[self.username_field] = matched_user.username

        data = super().validate(attrs)
        data['role'] = self.user.role
        data['username'] = self.user.username
        data['email'] = self.user.email
        data['first_name'] = self.user.first_name
        data['last_name'] = self.user.last_name
        return data


class UserMeSerializer(serializers.ModelSerializer):
    date_of_birth = serializers.DateField(required=False, allow_null=True)
    city = serializers.SerializerMethodField()
    is_online = serializers.BooleanField(read_only=True)
    last_seen = serializers.DateTimeField(read_only=True)
    last_seen_display = serializers.CharField(read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'first_name', 'last_name', 'email', 'username', 'role',
            'phone', 'avatar_url', 'banner_url', 'is_verified',
            'language_preference', 'country', 'city', 'date_of_birth',
            'address', 'education_level', 'expertise_level', 'created_at',
            'last_seen', 'is_online', 'last_seen_display'
        ]
        read_only_fields = ['id', 'email', 'username', 'role', 'is_verified', 'created_at', 'last_seen', 'is_online', 'last_seen_display']

    def get_city(self, obj):
        return obj.address or ""


class UserPublicSerializer(serializers.ModelSerializer):
    services = serializers.SerializerMethodField()
    technician_profile = serializers.SerializerMethodField()
    bio = serializers.SerializerMethodField()
    about = serializers.SerializerMethodField()
    headline = serializers.SerializerMethodField()
    skills = serializers.SerializerMethodField()
    portfolio = serializers.SerializerMethodField()
    tools = serializers.SerializerMethodField()
    hourly_rate = serializers.SerializerMethodField()
    daily_rate = serializers.SerializerMethodField()
    inspection_fee = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    completed_jobs = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()
    response_time = serializers.SerializerMethodField()
    city = serializers.SerializerMethodField()
    is_online = serializers.BooleanField(read_only=True)
    last_seen = serializers.DateTimeField(read_only=True)
    last_seen_display = serializers.CharField(read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'first_name', 'last_name', 'username', 'role',
            'avatar_url', 'banner_url', 'is_verified', 'country', 'city',
            'date_of_birth', 'address', 'education_level', 'expertise_level',
            'bio', 'about', 'headline', 'skills', 'tools', 'portfolio',
            'hourly_rate', 'daily_rate', 'inspection_fee',
            'average_rating', 'completed_jobs', 'review_count', 'response_time',
            'services', 'technician_profile', 'is_online', 'last_seen', 'last_seen_display'
        ]

    def get_services(self, obj):
        if getattr(obj, "role", None) != "TECHNICIAN":
            return []
        services = getattr(obj, "technician_services", None)
        if services is None:
            return []
        return TechnicianServicePublicSerializer(services.filter(is_active=True), many=True).data

    def get_technician_profile(self, obj):
        if getattr(obj, "role", None) != "TECHNICIAN":
            return None
        tech = getattr(obj, "technician_profile", None)
        if not tech:
            return None
        return {
            'bio': tech.bio or '',
            'hourly_rate': str(tech.hourly_rate) if tech.hourly_rate else None,
            'is_verified': tech.is_verified or obj.is_verified,
            'completed_jobs': tech.completed_jobs,
            'average_rating': str(tech.average_rating),
            'response_time': tech.response_time or 'Within 24 hours',
            'availability_status': tech.availability_status or 'available',
            'is_online': obj.is_online,
            'last_seen': obj.last_seen,
            'last_seen_display': obj.last_seen_display,
        }

    def get_bio(self, obj):
        tech = getattr(obj, "technician_profile", None)
        return (tech.bio if tech else '') or ''

    def get_about(self, obj):
        tech = getattr(obj, "technician_profile", None)
        return (tech.bio if tech else '') or ''

    def get_headline(self, obj):
        trade = getattr(obj, "education_level", None) or getattr(obj, "expertise_level", None)
        if trade:
            return f"Certified {trade}" if not str(trade).startswith("Certified") else str(trade)
        return "Professional Specialist"

    def get_skills(self, obj):
        tech = getattr(obj, "technician_profile", None)
        if tech and tech.skills.exists():
            return [s.name for s in tech.skills.all()]
        return []

    def get_portfolio(self, obj):
        from .models import PortfolioItem
        items = PortfolioItem.objects.filter(user=obj)
        if items.exists():
            return PortfolioItemSerializer(items, many=True).data
        tech = getattr(obj, "technician_profile", None)
        if tech and tech.portfolio:
            return tech.portfolio
        return []

    def get_tools(self, obj):
        tech = getattr(obj, "technician_profile", None)
        if tech:
            if hasattr(tech, 'tools') and tech.tools and isinstance(tech.tools, list):
                return tech.tools
            if getattr(tech, 'languages', None) and isinstance(tech.languages, list) and tech.languages:
                return tech.languages
            if getattr(tech, 'languages', None) and isinstance(tech.languages, dict) and 'tools' in tech.languages:
                return tech.languages['tools']
        return []

    def get_hourly_rate(self, obj):
        tech = getattr(obj, "technician_profile", None)
        if tech and tech.hourly_rate:
            return f"{int(tech.hourly_rate):,} XOF / hr"
        return "Negotiable / Quote upon Request"

    def get_daily_rate(self, obj):
        tech = getattr(obj, "technician_profile", None)
        if tech:
            if isinstance(tech.languages, dict) and tech.languages.get('pricing', {}).get('daily_rate'):
                return tech.languages['pricing']['daily_rate']
            if tech.hourly_rate:
                daily = int(tech.hourly_rate) * 7
                return f"{daily:,} XOF / day"
        return "Negotiable Daily Rate"

    def get_inspection_fee(self, obj):
        tech = getattr(obj, "technician_profile", None)
        if tech and isinstance(tech.languages, dict) and tech.languages.get('pricing', {}).get('inspection_fee'):
            return tech.languages['pricing']['inspection_fee']
        return "Contact for Inspection"

    def get_average_rating(self, obj):
        tech = getattr(obj, "technician_profile", None)
        return str(tech.average_rating) if tech else "5.0"

    def get_completed_jobs(self, obj):
        tech = getattr(obj, "technician_profile", None)
        return tech.completed_jobs if tech else 0

    def get_review_count(self, obj):
        return 0

    def get_response_time(self, obj):
        tech = getattr(obj, "technician_profile", None)
        return (tech.response_time if tech else '') or 'Within 24 hours'

    def get_city(self, obj):
        return obj.address or ''


import re
import random

RESERVED_USERNAMES = {
    'admin', 'administrator', 'boulotman', 'support', 'root', 'help', 'api',
    'auth', 'null', 'undefined', 'moderator', 'system', 'dashboard', 'settings',
    'login', 'register', 'signup', 'profile', 'user', 'users', 'billing'
}

def generate_unique_username(base_name='', email=''):
    """
    Generate a clean, unique alphanumeric + underscore username.
    Example: 'Aneeq Nisar' -> 'aneeq_nisar', 'aneeq_nisar1'
    """
    raw = (base_name or '').strip()
    if not raw and email:
        raw = email.split('@')[0]
    
    # Replace spaces, dots, dashes with underscores
    cleaned = re.sub(r'[^a-zA-Z0-9_]', '', raw.lower().replace(' ', '_').replace('.', '_').replace('-', '_'))
    cleaned = re.sub(r'_+', '_', cleaned).strip('_')
    
    if len(cleaned) < 3 or cleaned in RESERVED_USERNAMES:
        prefix = cleaned if len(cleaned) >= 3 else (email.split('@')[0] if email else 'user')
        prefix = re.sub(r'[^a-zA-Z0-9_]', '', prefix.lower())[:15] or 'user'
        cleaned = f"{prefix}_{random.randint(100, 999)}"
        
    candidate = cleaned[:24]
    counter = 1
    base_candidate = candidate
    while User.objects.filter(username__iexact=candidate).exists():
        candidate = f"{base_candidate}_{counter}"
        counter += 1
        
    return candidate.lower()


class ClientRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'password', 'phone']

    def validate_email(self, value):
        clean = (value or '').strip().lower()
        existing = User.objects.filter(email__iexact=clean).first()
        if existing:
            raise serializers.ValidationError(f"This email address is already in use by a {existing.role.title()} account. Please log in instead.")
        return clean

    def create(self, validated_data):
        clean_email = validated_data['email'].strip().lower()
        full_name = f"{validated_data.get('first_name', '')} {validated_data.get('last_name', '')}".strip()
        username = generate_unique_username(base_name=full_name, email=clean_email)
        user = User.objects.create_user(
            username=username,
            email=clean_email,
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            phone=validated_data.get('phone', ''),
            role='CLIENT',
        )
        return user


class TechnicianRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    country = serializers.CharField(required=False, allow_blank=True)
    address = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'password', 'phone', 'country', 'address']

    def validate_email(self, value):
        clean = (value or '').strip().lower()
        existing = User.objects.filter(email__iexact=clean).first()
        if existing:
            raise serializers.ValidationError(f"This email address is already in use by a {existing.role.title()} account. Please log in instead.")
        return clean

    def create(self, validated_data):
        clean_email = validated_data['email'].strip().lower()
        full_name = f"{validated_data.get('first_name', '')} {validated_data.get('last_name', '')}".strip()
        username = generate_unique_username(base_name=full_name, email=clean_email)
        user = User.objects.create_user(
            username=username,
            email=clean_email,
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            phone=validated_data.get('phone', ''),
            country=validated_data.get('country', ''),
            address=validated_data.get('address', ''),
            role='TECHNICIAN',
        )
        TechnicianProfile.objects.create(user=user)
        return user


class CompanyRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    company_name = serializers.CharField()

    class Meta:
        model = User
        fields = ['email', 'password', 'company_name', 'phone']

    def validate_email(self, value):
        clean = (value or '').strip().lower()
        existing = User.objects.filter(email__iexact=clean).first()
        if existing:
            raise serializers.ValidationError(f"This email address is already in use by a {existing.role.title()} account. Please log in instead.")
        return clean

    def create(self, validated_data):
        from apps.companies.models import CompanyProfile
        clean_email = validated_data['email'].strip().lower()
        company_name = validated_data.pop('company_name')
        username = generate_unique_username(base_name=company_name, email=clean_email)
        user = User.objects.create_user(
            username=username,
            email=clean_email,
            password=validated_data['password'],
            first_name=company_name,
            phone=validated_data.get('phone', ''),
            role='COMPANY',
        )
        CompanyProfile.objects.create(user=user, company_name=company_name)
        return user


class PortfolioItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PortfolioItem
        fields = ['id', 'title', 'description', 'category', 'image_url', 'completed_date', 'project_value', 'created_at']
        read_only_fields = ['id', 'created_at']


class SavedProfessionalSerializer(serializers.ModelSerializer):
    professional = UserPublicSerializer(read_only=True)

    class Meta:
        model = SavedProfessional
        fields = ['id', 'professional', 'created_at']
        read_only_fields = ['id', 'created_at']


class TechnicianServicePublicSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True, default="")

    class Meta:
        model = TechnicianService
        fields = [
            "id",
            "title",
            "category",
            "category_name",
            "description",
            "service_type",
            "coverage_area",
            "pricing_model",
            "pricing_min",
            "pricing_max",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = fields


class TechnicianServiceSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True, default="")

    class Meta:
        model = TechnicianService
        fields = [
            "id",
            "title",
            "category",
            "category_name",
            "description",
            "service_type",
            "coverage_area",
            "pricing_model",
            "pricing_min",
            "pricing_max",
            "media",
            "is_active",
            "created_at",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "category_name", "created_at", "updated_at"]


class TechnicianDocumentSerializer(serializers.ModelSerializer):
    file_url = serializers.CharField(max_length=500)

    class Meta:
        model = TechnicianDocument
        fields = ['id', 'title', 'document_type', 'file_url', 'is_verified', 'created_at']
        read_only_fields = ['id', 'is_verified', 'created_at']
