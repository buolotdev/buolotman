from rest_framework import serializers
from .models import CompanyProfile, CompanyProject, CompanyService, CompanyCertification, CompanyReview, QuoteRequest, CompanyActivity


class CompanyProfileSerializer(serializers.ModelSerializer):
    rating_distribution = serializers.SerializerMethodField()

    class Meta:
        model = CompanyProfile
        fields = ['id', 'company_name', 'registration_number', 'services_offered', 'company_size',
                  'logo_url', 'cover_url', 'about', 'website', 'headquarters', 'business_hours',
                  'is_verified', 'average_rating', 'review_count', 'team_size', 'completed_tasks',
                  'response_time', 'profile_views', 'rating_distribution', 'created_at']
        read_only_fields = ['id', 'is_verified', 'average_rating', 'review_count', 'profile_views', 'created_at']

    def get_rating_distribution(self, obj):
        reviews = obj.reviews.all()
        total = reviews.count()
        if total == 0:
            return {'5': 0, '4': 0, '3': 0, '2': 0, '1': 0, 'total': 0}
        
        dist = {
            '5': reviews.filter(rating=5).count(),
            '4': reviews.filter(rating=4).count(),
            '3': reviews.filter(rating=3).count(),
            '2': reviews.filter(rating=2).count(),
            '1': reviews.filter(rating=1).count(),
            'total': total
        }
        return dist

class CompanyProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyProject
        fields = ['id', 'title', 'status', 'client_name', 'budget', 'timeline',
                  'milestones_total', 'milestones_completed', 'payment_status',
                  'location', 'progress', 'created_at']
        read_only_fields = ['id', 'created_at']

class CompanyServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyService
        fields = ['id', 'title', 'description', 'images', 'created_at']
        read_only_fields = ['id', 'created_at']

class CompanyCertificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyCertification
        fields = ['id', 'title', 'description', 'created_at']
        read_only_fields = ['id', 'created_at']

class CompanyReviewSerializer(serializers.ModelSerializer):
    reviewer_name = serializers.SerializerMethodField()

    class Meta:
        model = CompanyReview
        fields = ['id', 'reviewer', 'reviewer_name', 'rating', 'text', 'service', 'created_at']
        read_only_fields = ['id', 'reviewer', 'created_at']
    def get_reviewer_name(self, obj):
        return f'{obj.reviewer.first_name} {obj.reviewer.last_name}'.strip() or obj.reviewer.email


class QuoteRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuoteRequest
        fields = [
            'id', 'client_name', 'client_email', 'client_phone', 'service', 
            'budget', 'deadline', 'location', 'priority', 'project_summary', 
            'technical_details', 'attachments', 'status', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class CompanyActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyActivity
        fields = ['id', 'text', 'icon_type', 'created_at']
        read_only_fields = ['id', 'created_at']
