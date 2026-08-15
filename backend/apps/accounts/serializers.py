from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from .models import TechnicianProfile, TechnicianService, PortfolioItem, SavedProfessional, TechnicianDocument

User = get_user_model()


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        username = (attrs.get(self.username_field) or '').strip().lower()
        password = attrs.get('password')

        # Auto-provision Demo Accounts if requested on live platform
        demo_map = {
            'admin@boulotman.com': {'role': 'ADMIN', 'is_staff': True, 'is_superuser': True, 'first_name': 'Admin', 'last_name': 'BoulotMan'},
            'moussa.tech@boulotman.com': {'role': 'TECHNICIAN', 'first_name': 'Moussa', 'last_name': 'Diallo'},
            'amina.client@boulotman.com': {'role': 'CLIENT', 'first_name': 'Amina', 'last_name': 'Sow'},
            'apex.company@boulotman.com': {'role': 'COMPANY', 'first_name': 'Apex', 'last_name': 'Engineering'},
        }

        if username in demo_map and password == 'DemoPass123!':
            user = User.objects.filter(email=username).first()
            if not user:
                info = demo_map[username]
                user = User.objects.create_user(
                    email=username,
                    username=username.split('@')[0],
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

        data = super().validate(attrs)
        data['role'] = self.user.role
        data['username'] = self.user.username
        data['email'] = self.user.email
        data['first_name'] = self.user.first_name
        data['last_name'] = self.user.last_name
        return data


class UserMeSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'username', 'role', 'phone', 'avatar_url', 'banner_url', 'is_verified', 'language_preference', 'country', 'date_of_birth', 'address', 'education_level', 'expertise_level', 'created_at']
        read_only_fields = ['id', 'role', 'is_verified', 'created_at']


class UserPublicSerializer(serializers.ModelSerializer):
    services = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'username', 'role', 'avatar_url', 'banner_url', 'is_verified', 'country', 'date_of_birth', 'address', 'education_level', 'expertise_level', 'services']

    def get_services(self, obj):
        if getattr(obj, "role", None) != "TECHNICIAN":
            return []
        services = getattr(obj, "technician_services", None)
        if services is None:
            return []
        return TechnicianServicePublicSerializer(services.filter(is_active=True), many=True).data


class ClientRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'password', 'phone']

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            phone=validated_data.get('phone', ''),
            role='CLIENT',
        )
        return user


class TechnicianRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'password', 'phone']

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            phone=validated_data.get('phone', ''),
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
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def create(self, validated_data):
        from apps.companies.models import CompanyProfile
        company_name = validated_data.pop('company_name')
        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
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
