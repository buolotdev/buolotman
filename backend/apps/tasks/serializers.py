from rest_framework import serializers
from django.utils.text import slugify
from .models import Task, TaskAttachment, Bid, Question, Category, Skill, ServiceInquiry, Milestone


class CategorySerializer(serializers.ModelSerializer):
    subcategories = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'icon', 'parent', 'is_active', 'order', 'subcategories', 'description']

    def get_subcategories(self, obj):
        if obj.subcategories.exists():
            return CategorySerializer(obj.subcategories.filter(is_active=True), many=True).data
        return []


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name', 'slug']


class TaskAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskAttachment
        fields = ['id', 'file_url', 'file_name', 'file_type', 'file_size']
        read_only_fields = ['id']


class TaskListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True, default='')
    client_name = serializers.SerializerMethodField()
    client_initials = serializers.SerializerMethodField()
    accepted_bids_count = serializers.IntegerField(read_only=True, default=0)

    class Meta:
        model = Task
        fields = ['id', 'title', 'status', 'budget_min', 'budget_max', 'budget_mode', 'urgency',
                  'service_type', 'location', 'city', 'category', 'category_name',
                  'bids_count', 'accepted_bids_count', 'views_count', 'assigned_to',
                  'client_name', 'client_initials',
                  'created_at', 'published_at']

    def get_client_name(self, obj):
        return f'{obj.client.first_name} {obj.client.last_name}'.strip() or obj.client.email

    def get_client_initials(self, obj):
        first = obj.client.first_name[:1] if obj.client.first_name else ''
        last = obj.client.last_name[:1] if obj.client.last_name else ''
        return (first + last).upper() or obj.client.email[:2].upper()


class MilestoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Milestone
        fields = ['id', 'title', 'amount', 'status', 'due_date', 'created_at', 'updated_at']


class TaskDetailSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True, default='')
    client_name = serializers.SerializerMethodField()
    client_initials = serializers.SerializerMethodField()
    attachments = TaskAttachmentSerializer(many=True, read_only=True)
    skills_list = serializers.SerializerMethodField()
    bids = serializers.SerializerMethodField()
    questions = serializers.SerializerMethodField()
    has_escrow = serializers.SerializerMethodField()
    assigned_to_name = serializers.SerializerMethodField()
    assigned_to_rating = serializers.SerializerMethodField()
    assigned_to_jobs = serializers.SerializerMethodField()
    assigned_to_verified = serializers.SerializerMethodField()
    milestones = serializers.SerializerMethodField()
    escrow_amount = serializers.SerializerMethodField()

    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'status', 'budget_min', 'budget_max', 'budget_mode',
                  'urgency', 'service_type', 'location', 'city', 'latitude', 'longitude',
                  'schedule', 'deadline', 'materials_provided', 'contact_methods',
                  'category', 'category_name', 'skills', 'skills_list',
                  'views_count', 'bids_count', 'assigned_to',
                  'assigned_to_name', 'assigned_to_rating', 'assigned_to_jobs', 'assigned_to_verified',
                  'client', 'client_name', 'client_initials',
                  'attachments', 'bids', 'questions', 'has_escrow', 'milestones', 'escrow_amount',
                  'created_at', 'updated_at', 'published_at']

    def get_client_name(self, obj):
        return f'{obj.client.first_name} {obj.client.last_name}'.strip() or obj.client.email

    def get_client_initials(self, obj):
        first = obj.client.first_name[:1] if obj.client.first_name else ''
        last = obj.client.last_name[:1] if obj.client.last_name else ''
        return (first + last).upper() or obj.client.email[:2].upper()

    def get_assigned_to_name(self, obj):
        if not obj.assigned_to:
            return None
        return f"{obj.assigned_to.first_name} {obj.assigned_to.last_name}".strip() or obj.assigned_to.username or obj.assigned_to.email

    def get_assigned_to_rating(self, obj):
        if not obj.assigned_to:
            return None
        if hasattr(obj.assigned_to, 'technician_profile'):
            return float(obj.assigned_to.technician_profile.average_rating or 0)
        return None

    def get_assigned_to_jobs(self, obj):
        if not obj.assigned_to:
            return None
        if hasattr(obj.assigned_to, 'technician_profile'):
            return obj.assigned_to.technician_profile.completed_jobs
        return Task.objects.filter(assigned_to=obj.assigned_to, status='completed').count()

    def get_assigned_to_verified(self, obj):
        if not obj.assigned_to:
            return False
        return bool(obj.assigned_to.is_verified or (hasattr(obj.assigned_to, 'technician_profile') and obj.assigned_to.technician_profile.is_verified))

    def get_milestones(self, obj):
        return MilestoneSerializer(obj.milestones.all(), many=True).data

    def get_escrow_amount(self, obj):
        from apps.wallet.models import Transaction
        tx = Transaction.objects.filter(
            wallet__user=obj.client,
            reference=obj,
            category__in=['escrow_hold', 'escrow_release'],
        ).first()
        if tx:
            return float(tx.amount)
        if obj.budget_min:
            return float(obj.budget_min)
        if obj.budget_max:
            return float(obj.budget_max)
        return 0

    def get_skills_list(self, obj):
        return list(obj.skills.values_list('name', flat=True))

    def get_bids(self, obj):
        accepted_bids = obj.bids.select_related('technician').filter(status='accepted')
        bids = accepted_bids if accepted_bids.exists() else obj.bids.select_related('technician').all()
        return BidListSerializer(bids, many=True).data

    def get_questions(self, obj):
        questions = obj.questions.select_related('asker').all()[:10]
        return QuestionSerializer(questions, many=True).data

    def get_has_escrow(self, obj):
        from apps.wallet.models import Transaction
        return Transaction.objects.filter(
            wallet__user=obj.client,
            reference=obj,
            category='escrow_hold',
        ).exists()


class TaskCreateSerializer(serializers.ModelSerializer):
    skills = serializers.ListField(child=serializers.CharField(), required=False, allow_empty=True)

    class Meta:
        model = Task
        fields = ['title', 'description', 'category', 'budget_min', 'budget_max', 'budget_mode',
                  'urgency', 'service_type', 'location', 'city', 'schedule', 'deadline',
                  'materials_provided', 'contact_methods', 'skills', 'assigned_to', 'status']

    def create(self, validated_data):
        skills = validated_data.pop('skills', [])
        validated_data['client'] = self.context['request'].user
        if validated_data.get('assigned_to'):
            validated_data['status'] = validated_data.get('status') or 'assigned'
        else:
            validated_data['status'] = validated_data.get('status') or 'open'
        task = super().create(validated_data)
        self._set_skills(task, skills)
        return task


    def update(self, instance, validated_data):
        skills = validated_data.pop('skills', None)
        task = super().update(instance, validated_data)
        if skills is not None:
            self._set_skills(task, skills)
        return task

    def _set_skills(self, task, skills):
        skill_objects = []
        for raw in skills or []:
            value = str(raw).strip()
            if not value:
                continue
            skill = None
            if value.isdigit():
                skill = Skill.objects.filter(id=int(value)).first()
            if skill is None:
                base_slug = slugify(value) or "skill"
                slug = base_slug
                counter = 1
                while Skill.objects.filter(slug=slug).exists():
                    counter += 1
                    slug = f"{base_slug}-{counter}"
                skill, _ = Skill.objects.get_or_create(
                    slug=slug,
                    defaults={"name": value, "category": task.category},
                )
            skill_objects.append(skill)
        task.skills.set(skill_objects)


class BidListSerializer(serializers.ModelSerializer):
    technician_name = serializers.SerializerMethodField()
    technician_initials = serializers.SerializerMethodField()
    technician_rating = serializers.SerializerMethodField()
    technician_is_online = serializers.BooleanField(source='technician.is_online', read_only=True)
    technician_last_seen = serializers.DateTimeField(source='technician.last_seen', read_only=True)
    technician_last_seen_display = serializers.CharField(source='technician.last_seen_display', read_only=True)
    task_id = serializers.IntegerField(source='task.id', read_only=True)
    task_title = serializers.CharField(source='task.title', read_only=True)
    task_status = serializers.CharField(source='task.status', read_only=True)
    location = serializers.CharField(source='task.location', read_only=True)
    description = serializers.CharField(source='task.description', read_only=True)
    skills = serializers.SerializerMethodField()
    client_first_name = serializers.CharField(source='task.client.first_name', read_only=True)
    client_last_name = serializers.CharField(source='task.client.last_name', read_only=True)
    client_rating = serializers.SerializerMethodField()
    competing_bids = serializers.SerializerMethodField()

    class Meta:
        model = Bid
        fields = ['id', 'task_id', 'task_title', 'task_status', 'amount', 'amount_type', 'message', 'duration', 'status',
                  'technician', 'technician_name', 'technician_initials', 'technician_rating',
                  'technician_is_online', 'technician_last_seen', 'technician_last_seen_display',
                  'created_at', 'location', 'description', 'skills',
                  'client_first_name', 'client_last_name', 'client_rating', 'competing_bids']

    def get_technician_name(self, obj):
        return f'{obj.technician.first_name} {obj.technician.last_name}'.strip() or obj.technician.email

    def get_technician_initials(self, obj):
        first = obj.technician.first_name[:1] if obj.technician.first_name else ''
        last = obj.technician.last_name[:1] if obj.technician.last_name else ''
        return (first + last).upper() or obj.technician.email[:2].upper()

    def get_technician_rating(self, obj):
        profile = getattr(obj.technician, 'technician_profile', None)
        return str(profile.average_rating) if profile else '0.00'

    def get_skills(self, obj):
        return [s.name for s in obj.task.skills.all()] if obj.task else []

    def get_client_rating(self, obj):
        profile = getattr(obj.task.client, 'technician_profile', None) if obj.task else None
        return str(profile.average_rating) if profile else '0.00'

    def get_competing_bids(self, obj):
        if not obj.task:
            return 0
        return Bid.objects.filter(task=obj.task).exclude(id=obj.id).count()


class BidDetailSerializer(serializers.ModelSerializer):
    technician_name = serializers.SerializerMethodField()
    technician_initials = serializers.SerializerMethodField()
    technician_is_online = serializers.BooleanField(source='technician.is_online', read_only=True)
    technician_last_seen = serializers.DateTimeField(source='technician.last_seen', read_only=True)
    technician_last_seen_display = serializers.CharField(source='technician.last_seen_display', read_only=True)
    technician_profile = serializers.SerializerMethodField()

    class Meta:
        model = Bid
        fields = ['id', 'amount', 'amount_type', 'message', 'duration', 'extra_notes',
                  'status', 'technician', 'technician_name', 'technician_initials',
                  'technician_is_online', 'technician_last_seen', 'technician_last_seen_display',
                  'technician_profile', 'created_at', 'accepted_at', 'rejected_at']

    def get_technician_name(self, obj):
        return f'{obj.technician.first_name} {obj.technician.last_name}'.strip() or obj.technician.email

    def get_technician_initials(self, obj):
        first = obj.technician.first_name[:1] if obj.technician.first_name else ''
        last = obj.technician.last_name[:1] if obj.technician.last_name else ''
        return (first + last).upper() or obj.technician.email[:2].upper()

    def get_technician_profile(self, obj):
        profile = getattr(obj.technician, 'technician_profile', None)
        if profile:
            return {
                'bio': profile.bio,
                'hourly_rate': str(profile.hourly_rate) if profile.hourly_rate else None,
                'skills': list(profile.skills.values_list('name', flat=True)),
                'completed_jobs': profile.completed_jobs,
                'average_rating': str(profile.average_rating),
                'is_verified': profile.is_verified,
                'availability_status': profile.availability_status,
                'is_online': obj.technician.is_online,
                'last_seen': obj.technician.last_seen,
                'last_seen_display': obj.technician.last_seen_display,
            }
        return None


class BidCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bid
        fields = ['amount', 'amount_type', 'message', 'duration', 'extra_notes']

    def create(self, validated_data):
        validated_data['technician'] = self.context['request'].user
        task = self.context['task']
        validated_data['task'] = task
        bid = super().create(validated_data)
        task.bids_count = task.bids.count()
        task.save(update_fields=['bids_count'])
        return bid


class QuestionSerializer(serializers.ModelSerializer):
    asker_name = serializers.SerializerMethodField()
    asker_initials = serializers.SerializerMethodField()
    replier_name = serializers.SerializerMethodField()

    class Meta:
        model = Question
        fields = ['id', 'text', 'asker', 'asker_name', 'asker_initials',
                  'reply_text', 'replied_by', 'replier_name', 'created_at', 'replied_at']

    def get_asker_name(self, obj):
        return f'{obj.asker.first_name} {obj.asker.last_name}'.strip() or obj.asker.email

    def get_asker_initials(self, obj):
        first = obj.asker.first_name[:1] if obj.asker.first_name else ''
        last = obj.asker.last_name[:1] if obj.asker.last_name else ''
        return (first + last).upper() or obj.asker.email[:2].upper()

    def get_replier_name(self, obj):
        if obj.replied_by:
            return f'{obj.replied_by.first_name} {obj.replied_by.last_name}'.strip() or obj.replied_by.email
        return None


class QuestionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['text']

    def create(self, validated_data):
        validated_data['asker'] = self.context['request'].user
        validated_data['task'] = self.context['task']
        return super().create(validated_data)


class ServiceInquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceInquiry
        fields = '__all__'
        read_only_fields = ['status', 'created_at', 'updated_at']
