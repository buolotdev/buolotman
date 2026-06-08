from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from .models import TechnicianProfile, PortfolioItem, SavedProfessional

User = get_user_model()


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
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
        fields = ['id', 'first_name', 'last_name', 'email', 'username', 'role', 'phone', 'avatar_url', 'is_verified', 'language_preference', 'country', 'created_at']
        read_only_fields = ['id', 'email', 'role', 'is_verified', 'created_at']


class UserPublicSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'username', 'role', 'avatar_url', 'is_verified', 'country']


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
