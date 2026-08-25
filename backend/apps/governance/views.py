from django.db import transaction
from django.db.models import Q
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from .models import Notification, AuditLog, Dispute, DisputeEvidence, PlatformSetting, CmsPage
from .serializers import (
    NotificationSerializer,
    AuditLogSerializer,
    DisputeListSerializer,
    DisputeDetailSerializer,
    DisputeCreateSerializer,
    DisputeResolveSerializer,
    DisputeEvidenceSerializer,
    DisputeEvidenceCreateSerializer,
    PlatformSettingSerializer,
    CmsPageSerializer,
)
from .services import create_notification, create_audit_log, notify_users


def _is_admin(user):
    return bool(user and user.is_authenticated and getattr(user, "role", None) == "ADMIN")


def _has_dispute_access(user, dispute):
    if _is_admin(user):
        return True
    return user in [dispute.opened_by, dispute.against, dispute.task.client, dispute.task.assigned_to]


def _is_page_visible_to_public(page):
    return page.is_published


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def notifications(request):
    items = Notification.objects.filter(user=request.user)
    unread = request.query_params.get("unread")
    if unread == "true":
        items = items.filter(is_read=False)
    elif unread == "false":
        items = items.filter(is_read=True)
    serializer = NotificationSerializer(items, many=True)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def mark_notification_read(request, notification_id):
    try:
        notification = Notification.objects.get(id=notification_id, user=request.user)
    except Notification.DoesNotExist:
        return Response({"error": "Notification not found"}, status=status.HTTP_404_NOT_FOUND)

    notification.is_read = True
    notification.read_at = timezone.now()
    notification.save(update_fields=["is_read", "read_at"])
    return Response(NotificationSerializer(notification).data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def disputes(request):
    qs = Dispute.objects.select_related("task", "opened_by", "against", "resolution_by").prefetch_related("evidence")
    if not _is_admin(request.user):
        qs = qs.filter(
            Q(opened_by=request.user)
            | Q(against=request.user)
            | Q(task__client=request.user)
            | Q(task__assigned_to=request.user)
        ).distinct()

    status_filter = request.query_params.get("status")
    if status_filter:
        qs = qs.filter(status=status_filter)

    serializer = DisputeListSerializer(qs.order_by("-opened_at"), many=True)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def dispute_create(request):
    serializer = DisputeCreateSerializer(data=request.data, context={"request": request})
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    task = serializer.validated_data["task"]
    against = serializer.validated_data.get("against") or task.assigned_to

    with transaction.atomic():
        dispute = serializer.save()
        if against and dispute.against_id is None:
            dispute.against = against
            dispute.save(update_fields=["against"])

        create_audit_log(
            actor=request.user,
            action="dispute_created",
            entity_type="dispute",
            entity_id=dispute.id,
            summary=dispute.title,
            metadata={"task_id": task.id, "reason": dispute.reason},
            ip_address=request.META.get("REMOTE_ADDR"),
        )

        recipients = [task.client]
        if task.assigned_to:
            recipients.append(task.assigned_to)
        if against and against not in recipients:
            recipients.append(against)
        notify_users(
            recipients,
            category="dispute",
            title=f"Dispute opened: {dispute.title}",
            body=dispute.description[:240],
            link=f"/dashboard/admin/disputes?d={dispute.id}",
            metadata={"dispute_id": dispute.id, "task_id": task.id},
        )

    return Response(DisputeDetailSerializer(dispute).data, status=status.HTTP_201_CREATED)


@api_view(["GET", "PATCH"])
@permission_classes([IsAuthenticated])
def dispute_detail(request, dispute_id):
    try:
        dispute = Dispute.objects.select_related("task", "opened_by", "against", "resolution_by").prefetch_related("evidence").get(id=dispute_id)
    except Dispute.DoesNotExist:
        return Response({"error": "Dispute not found"}, status=status.HTTP_404_NOT_FOUND)

    if not _has_dispute_access(request.user, dispute):
        return Response({"error": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)

    if request.method == "GET":
        return Response(DisputeDetailSerializer(dispute).data)

    if not _is_admin(request.user):
        return Response({"error": "Admin only"}, status=status.HTTP_403_FORBIDDEN)

    serializer = DisputeResolveSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    with transaction.atomic():
        dispute.status = serializer.validated_data["status"]
        dispute.resolution = serializer.validated_data.get("resolution", dispute.resolution)
        dispute.resolution_by = request.user
        if dispute.status == "resolved":
            dispute.resolved_at = timezone.now()
        dispute.save(update_fields=["status", "resolution", "resolution_by", "resolved_at", "updated_at"])

        create_audit_log(
            actor=request.user,
            action="dispute_updated",
            entity_type="dispute",
            entity_id=dispute.id,
            summary=dispute.title,
            metadata={"status": dispute.status},
            ip_address=request.META.get("REMOTE_ADDR"),
        )
        notify_users(
            [dispute.opened_by] + ([dispute.against] if dispute.against else []),
            category="dispute",
            title=f"Dispute updated: {dispute.title}",
            body=dispute.resolution or dispute.description[:240],
            link=f"/dashboard/admin/disputes?d={dispute.id}",
            metadata={"dispute_id": dispute.id, "status": dispute.status},
        )

    return Response(DisputeDetailSerializer(dispute).data)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def dispute_evidence(request, dispute_id):
    try:
        dispute = Dispute.objects.select_related("task", "opened_by", "against").get(id=dispute_id)
    except Dispute.DoesNotExist:
        return Response({"error": "Dispute not found"}, status=status.HTTP_404_NOT_FOUND)

    if not _has_dispute_access(request.user, dispute):
        return Response({"error": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)

    if request.method == "GET":
        serializer = DisputeEvidenceSerializer(dispute.evidence.select_related("uploaded_by"), many=True)
        return Response(serializer.data)

    serializer = DisputeEvidenceCreateSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    evidence = serializer.save(dispute=dispute, uploaded_by=request.user)
    create_audit_log(
        actor=request.user,
        action="dispute_evidence_uploaded",
        entity_type="dispute_evidence",
        entity_id=evidence.id,
        summary=evidence.file_name or dispute.title,
        metadata={"dispute_id": dispute.id},
        ip_address=request.META.get("REMOTE_ADDR"),
    )
    return Response(DisputeEvidenceSerializer(evidence).data, status=status.HTTP_201_CREATED)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def audit_logs(request):
    if not _is_admin(request.user):
        return Response({"error": "Admin only"}, status=status.HTTP_403_FORBIDDEN)

    qs = AuditLog.objects.select_related("actor").all()
    action = request.query_params.get("action")
    entity_type = request.query_params.get("entity_type")
    if action:
        qs = qs.filter(action=action)
    if entity_type:
        qs = qs.filter(entity_type=entity_type)

    page = int(request.query_params.get("page", 1))
    limit = int(request.query_params.get("limit", 50))
    start = (page - 1) * limit
    end = start + limit

    serializer = AuditLogSerializer(qs[start:end], many=True)
    return Response({
        "results": serializer.data,
        "total": qs.count(),
        "page": page,
        "limit": limit,
    })


@api_view(["GET", "POST", "PATCH"])
@permission_classes([IsAuthenticated])
def platform_settings(request):
    if not _is_admin(request.user):
        return Response({"error": "Admin only"}, status=status.HTTP_403_FORBIDDEN)

    if request.method == "GET":
        qs = PlatformSetting.objects.select_related("updated_by").all()
        key = request.query_params.get("key")
        if key:
            qs = qs.filter(key=key)
        serializer = PlatformSettingSerializer(qs, many=True)
        return Response(serializer.data)

    if request.method == "POST":
        serializer = PlatformSettingSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        setting = serializer.save(updated_by=request.user)
        create_audit_log(
            actor=request.user,
            action="platform_setting_created",
            entity_type="platform_setting",
            entity_id=setting.id,
            summary=setting.key,
            metadata={"key": setting.key},
            ip_address=request.META.get("REMOTE_ADDR"),
        )
        return Response(PlatformSettingSerializer(setting).data, status=status.HTTP_201_CREATED)

    key = request.data.get("key")
    if not key:
        return Response({"error": "key is required"}, status=status.HTTP_400_BAD_REQUEST)
    try:
        setting = PlatformSetting.objects.get(key=key)
    except PlatformSetting.DoesNotExist:
        return Response({"error": "Setting not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = PlatformSettingSerializer(setting, data=request.data, partial=True)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    setting = serializer.save(updated_by=request.user)
    create_audit_log(
        actor=request.user,
        action="platform_setting_updated",
        entity_type="platform_setting",
        entity_id=setting.id,
        summary=setting.key,
        metadata={"key": setting.key},
        ip_address=request.META.get("REMOTE_ADDR"),
    )
    return Response(PlatformSettingSerializer(setting).data)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def cms_pages(request):
    if not _is_admin(request.user):
        return Response({"error": "Admin only"}, status=status.HTTP_403_FORBIDDEN)

    if request.method == "GET":
        qs = CmsPage.objects.select_related("updated_by").all()
        serializer = CmsPageSerializer(qs, many=True)
        return Response(serializer.data)

    serializer = CmsPageSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    page = serializer.save(updated_by=request.user)
    create_audit_log(
        actor=request.user,
        action="cms_page_created",
        entity_type="cms_page",
        entity_id=page.id,
        summary=page.title,
        metadata={"slug": page.slug, "is_published": page.is_published},
        ip_address=request.META.get("REMOTE_ADDR"),
    )
    return Response(CmsPageSerializer(page).data, status=status.HTTP_201_CREATED)


@api_view(["GET", "PATCH", "DELETE"])
@permission_classes([IsAuthenticated])
def cms_page_detail(request, page_id):
    if not _is_admin(request.user):
        return Response({"error": "Admin only"}, status=status.HTTP_403_FORBIDDEN)

    try:
        page = CmsPage.objects.select_related("updated_by").get(id=page_id)
    except CmsPage.DoesNotExist:
        return Response({"error": "Page not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        return Response(CmsPageSerializer(page).data)

    if request.method == "DELETE":
        title = page.title
        page.delete()
        create_audit_log(
            actor=request.user,
            action="cms_page_deleted",
            entity_type="cms_page",
            entity_id=page_id,
            summary=title,
            metadata={},
            ip_address=request.META.get("REMOTE_ADDR"),
        )
        return Response(status=status.HTTP_204_NO_CONTENT)

    serializer = CmsPageSerializer(page, data=request.data, partial=True)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    page = serializer.save(updated_by=request.user)
    create_audit_log(
        actor=request.user,
        action="cms_page_updated",
        entity_type="cms_page",
        entity_id=page.id,
        summary=page.title,
        metadata={"slug": page.slug, "is_published": page.is_published},
        ip_address=request.META.get("REMOTE_ADDR"),
    )
    return Response(CmsPageSerializer(page).data)


@api_view(["GET"])
@permission_classes([AllowAny])
def public_cms_pages(request):
    qs = CmsPage.objects.filter(is_published=True, show_in_footer=True).order_by("sort_order", "title")
    serializer = CmsPageSerializer(qs, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([AllowAny])
def public_cms_page_detail(request, slug):
    try:
        page = CmsPage.objects.get(slug=slug, is_published=True)
    except CmsPage.DoesNotExist:
        return Response({"error": "Page not found"}, status=status.HTTP_404_NOT_FOUND)
    return Response(CmsPageSerializer(page).data)


@api_view(['GET'])
@permission_classes([AllowAny])
def platform_stats(request):
    from django.utils import timezone
    from datetime import timedelta
    from apps.accounts.models import User
    from apps.tasks.models import Task
    
    thirty_days_ago = timezone.now() - timedelta(days=30)
    
    registered_users = 50000 + User.objects.count()
    verified_technicians = 12000 + User.objects.filter(role='TECHNICIAN', is_verified=True).count()
    verified_companies = 3500 + User.objects.filter(role='COMPANY', is_verified=True).count()
    tasks_posted_monthly = 8000 + Task.objects.filter(created_at__gte=thirty_days_ago).count()
    
    total_completed = Task.objects.filter(status='COMPLETED').count()
    total_finished = Task.objects.filter(status__in=['COMPLETED', 'CANCELLED']).count()
    
    successful_completion = 95
    if total_finished > 0:
        successful_completion = int((total_completed / total_finished) * 100)
    
    return Response({
        'registered_users': registered_users,
        'verified_technicians': verified_technicians,
        'verified_companies': verified_companies,
        'tasks_posted_monthly': tasks_posted_monthly,
        'successful_completion': successful_completion
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_dashboard_stats(request):
    if request.user.role != 'admin' and not request.user.is_superuser:
        return Response({'detail': 'Not authorized.'}, status=status.HTTP_403_FORBIDDEN)
        
    from apps.accounts.models import User
    from apps.tasks.models import Task, Milestone
    from .models import Dispute
    
    total_users = User.objects.count()
    active_projects = Task.objects.filter(status__in=['open', 'in_progress']).count()
    pending_validations = Milestone.objects.filter(status='Awaiting Client').count()
    open_disputes = Dispute.objects.filter(status='OPEN').count()
    
    recent_tasks = Task.objects.order_by('-created_at')[:5]
    tasks_data = [
        {
            'id': t.id,
            'title': t.title,
            'client_name': f"{t.client.first_name} {t.client.last_name}" if t.client else 'Unknown',
            'technician_name': f"{t.technician.first_name} {t.technician.last_name}" if t.technician else 'Pending',
            'progress': 'Pending',  # Mock progress for now
            'status': t.status
        }
        for t in recent_tasks
    ]
    
    recent_activities = [
        {'message': f"New user {u.first_name} {u.last_name} joined."} 
        for u in User.objects.order_by('-date_joined')[:3]
    ]

    return Response({
        'metrics': {
            'total_users': total_users,
            'active_projects': active_projects,
            'pending_validations': pending_validations,
            'open_disputes': open_disputes,
        },
        'alerts': [
            {'type': 'warning', 'title': 'Pending Client Confirmations', 'description': f'{pending_validations} project milestones awaiting   validation.'},
            {'type': 'danger', 'title': 'Disputed Projects', 'description': f'{open_disputes} projects flagged due to   complaints.'}
        ],
        'active_projects': tasks_data,
        'recent_activity': recent_activities
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_projects_monitoring(request):
    if request.user.role != 'admin' and not request.user.is_superuser:
        return Response({'detail': 'Not authorized.'}, status=status.HTTP_403_FORBIDDEN)
        
    from apps.tasks.models import Task, Milestone
    
    # Stats
    active_count = Task.objects.filter(status__in=['open', 'in_progress']).count()
    completed_count = Task.objects.filter(status='completed').count()
    awaiting_validation_count = Milestone.objects.filter(status='Awaiting Client').count()
    on_hold_count = Milestone.objects.filter(status='On Hold').count() if hasattr(Milestone, 'status') else 0
    
    # Projects List
    tasks = Task.objects.all().order_by('-created_at')
    projects_data = []
    
    for t in tasks:
        # Determine active milestone
        milestone = t.milestones.filter(status__in=['Pending', 'Awaiting Execution', 'Awaiting Client', 'On Hold']).first()
        milestone_title = milestone.title if milestone else 'No Active Milestone'
        m_status = milestone.status if milestone else 'None'
        
        executor_type = t.technician.role.lower() if t.technician and hasattr(t.technician, 'role') else 'tech'
        
        projects_data.append({
            'id': t.id,
            'project': t.title,
            'client': f"{t.client.first_name} {t.client.last_name}" if t.client else 'Unknown',
            'executor': f"{t.technician.first_name} {t.technician.last_name}" if t.technician else 'Unassigned',
            'type': executor_type,
            'progress': 50, # Mock progress 
            'milestone': milestone_title,
            'status': m_status,
            'task_status': t.status
        })

    return Response({
        'stats': {
            'active_projects': active_count,
            'awaiting_validation': awaiting_validation_count,
            'on_hold': on_hold_count,
            'completed': completed_count,
        },
        'projects': projects_data
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def admin_project_release(request, task_id):
    if request.user.role != 'admin' and not request.user.is_superuser:
        return Response({'detail': 'Not authorized.'}, status=status.HTTP_403_FORBIDDEN)
    
    from apps.tasks.models import Milestone
    # Just mock releasing the first active milestone
    milestone = Milestone.objects.filter(task_id=task_id).exclude(status='Released').first()
    if milestone:
        milestone.status = 'Released'
        milestone.save()
        return Response({'detail': 'Milestone validated and payment released.'})
    return Response({'detail': 'No active milestone found to release.'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def admin_project_hold(request, task_id):
    if request.user.role != 'admin' and not request.user.is_superuser:
        return Response({'detail': 'Not authorized.'}, status=status.HTTP_403_FORBIDDEN)
    
    from apps.tasks.models import Milestone
    milestone = Milestone.objects.filter(task_id=task_id).exclude(status='Released').first()
    if milestone:
        milestone.status = 'On Hold' # Assuming 'On Hold' is valid or will just be a string
        milestone.save()
        return Response({'detail': 'Project payment placed on hold.'})
    return Response({'detail': 'No active milestone found to hold.'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_reviews(request):
    if getattr(request.user, 'role', '').lower() != 'admin' and not request.user.is_superuser:
        return Response({'detail': 'Not authorized.'}, status=status.HTTP_403_FORBIDDEN)
        
    from apps.tasks.models import TaskReview
    
    reviews = TaskReview.objects.all().order_by('-created_at')
    data = []
    
    for r in reviews:
        # Determine target type (user or company name)
        target_name = f"{r.target_user.first_name} {r.target_user.last_name}"
        if hasattr(r.target_user, 'company_profile') and getattr(r.target_user, 'company_profile', None):
            target_name = getattr(r.target_user, 'company_profile').company_name
            
        data.append({
            'id': r.id,
            'author': f"{r.reviewer.first_name} {r.reviewer.last_name}",
            'target': target_name,
            'project': r.task.title,
            'rating': r.rating,
            'comment': r.comment,
            'date': r.created_at.strftime("%d %b %Y"),
            'status': r.get_status_display() if hasattr(r, 'get_status_display') else r.status
        })

    return Response(data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def admin_review_publish(request, review_id):
    if getattr(request.user, 'role', '').lower() != 'admin' and not request.user.is_superuser:
        return Response({'detail': 'Not authorized.'}, status=status.HTTP_403_FORBIDDEN)
    
    from apps.tasks.models import TaskReview
    review = TaskReview.objects.filter(id=review_id).first()
    if review:
        review.status = 'Published'
        review.save()
        return Response({'detail': 'Review published successfully.'})
    return Response({'detail': 'Review not found.'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def admin_review_hide(request, review_id):
    if getattr(request.user, 'role', '').lower() != 'admin' and not request.user.is_superuser:
        return Response({'detail': 'Not authorized.'}, status=status.HTTP_403_FORBIDDEN)
    
    from apps.tasks.models import TaskReview
    review = TaskReview.objects.filter(id=review_id).first()
    if review:
        review.status = 'Hidden'
        review.save()
        return Response({'detail': 'Review hidden successfully.'})
    return Response({'detail': 'Review not found.'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def admin_review_delete(request, review_id):
    if getattr(request.user, 'role', '').lower() != 'admin' and not request.user.is_superuser:
        return Response({'detail': 'Not authorized.'}, status=status.HTTP_403_FORBIDDEN)
    
    from apps.tasks.models import TaskReview
    review = TaskReview.objects.filter(id=review_id).first()
    if review:
        review.delete()
        return Response({'detail': 'Review deleted successfully.'})
    return Response({'detail': 'Review not found.'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_support_tickets(request):
    user_role = str(getattr(request.user, 'role', '')).lower()
    if user_role != 'admin' and not request.user.is_superuser and not request.user.is_staff:
        return Response({'detail': 'Not authorized.'}, status=status.HTTP_403_FORBIDDEN)
        
    from apps.governance.models import SupportTicket
    
    tickets = SupportTicket.objects.prefetch_related('messages__sender', 'client').all().order_by('-created_at')
    data = []
    
    for t in tickets:
        messages = []
        for m in t.messages.all().order_by('created_at'):
            sender_name = "User"
            sender_role = "User"
            avatar_url = "https://i.pravatar.cc/150?img=1"
            if m.sender:
                sender_name = f"{m.sender.first_name or ''} {m.sender.last_name or ''}".strip() or m.sender.username
                sender_role = m.sender.get_role_display() if hasattr(m.sender, 'get_role_display') else str(m.sender.role)
                if hasattr(m.sender, 'avatar_url') and m.sender.avatar_url:
                    avatar_url = m.sender.avatar_url
            messages.append({
                'id': m.id,
                'sender': sender_name,
                'role': sender_role,
                'avatar': avatar_url,
                'time': m.created_at.strftime("%d %b %Y, %I:%M %p"),
                'body': m.body
            })
            
        client_name = "Client"
        client_role = "Client"
        if t.client:
            client_name = f"{t.client.first_name or ''} {t.client.last_name or ''}".strip() or t.client.username
            client_role = t.client.get_role_display() if hasattr(t.client, 'get_role_display') else str(t.client.role)

        data.append({
            'id': f"BM-{t.created_at.year}-{t.id:06d}",
            'db_id': t.id,
            'subject': t.subject,
            'client': client_name,
            'role': client_role,
            'status': t.get_status_display() if hasattr(t, 'get_status_display') else t.status.title(),
            'messages': messages
        })
        
    return Response(data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def admin_support_ticket_reply(request, ticket_id):
    if getattr(request.user, 'role', '').lower() != 'admin' and not request.user.is_superuser:
        return Response({'detail': 'Not authorized.'}, status=status.HTTP_403_FORBIDDEN)
        
    from apps.governance.models import SupportTicket, SupportMessage
    
    ticket = SupportTicket.objects.filter(id=ticket_id).first()
    if not ticket:
        return Response({'detail': 'Ticket not found.'}, status=status.HTTP_404_NOT_FOUND)
        
    body = request.data.get('body')
    if not body:
        return Response({'detail': 'Message body is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
    msg = SupportMessage.objects.create(
        ticket=ticket,
        sender=request.user,
        body=body
    )
    
    ticket.status = 'awaiting_response'
    ticket.save()
    
    return Response({
        'id': msg.id,
        'sender': "Support Team",
        'role': "Admin",
        'avatar': "/boulotman-logo.png",
        'time': msg.created_at.strftime("%d %b %Y, %I:%M %p"),
        'body': msg.body
    })


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def user_support_tickets(request):
    from apps.governance.models import SupportTicket, SupportMessage
    if request.method == 'GET':
        tickets = SupportTicket.objects.filter(client=request.user).prefetch_related('messages__sender').order_by('-created_at')
        data = []
        for t in tickets:
            messages = []
            for m in t.messages.all().order_by('created_at'):
                messages.append({
                    'id': m.id,
                    'sender': "Me" if m.sender == request.user else "Support Team",
                    'role': "Client" if m.sender == request.user else "Support Admin",
                    'avatar': m.sender.avatar_url if hasattr(m.sender, 'avatar_url') and m.sender.avatar_url else "https://i.pravatar.cc/150?img=11",
                    'time': m.created_at.strftime("%d %b %Y, %I:%M %p"),
                    'body': m.body
                })
            data.append({
                'id': f"BM-{t.created_at.year}-{t.id:06d}",
                'db_id': t.id,
                'subject': t.subject,
                'client': "Me",
                'status': t.get_status_display(),
                'statusClass': 'statusPending' if t.status == 'pending' else ('statusResolved' if t.status == 'resolved' else 'statusAwaiting'),
                'messages': messages,
            })
        return Response(data)

    elif request.method == 'POST':
        subject = request.data.get('subject')
        body = request.data.get('body')
        if not subject or not body:
            return Response({'error': 'Subject and body are required.'}, status=status.HTTP_400_BAD_REQUEST)

        ticket = SupportTicket.objects.create(
            subject=subject,
            client=request.user,
            status='pending',
        )
        SupportMessage.objects.create(
            ticket=ticket,
            sender=request.user,
            body=body,
        )
        return Response({
            'id': f"BM-{ticket.created_at.year}-{ticket.id:06d}",
            'db_id': ticket.id,
            'subject': ticket.subject,
            'client': "Me",
            'status': 'Pending',
            'statusClass': 'statusPending',
            'messages': [{
                'id': 1,
                'sender': "Me",
                'role': "Client",
                'avatar': "https://i.pravatar.cc/150?img=11",
                'time': "Just now",
                'body': body,
            }],
        }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def user_support_ticket_reply(request, ticket_id):
    from apps.governance.models import SupportTicket, SupportMessage
    ticket = SupportTicket.objects.filter(id=ticket_id, client=request.user).first()
    if not ticket:
        return Response({'detail': 'Ticket not found.'}, status=status.HTTP_404_NOT_FOUND)

    body = request.data.get('body')
    if not body:
        return Response({'detail': 'Message body is required.'}, status=status.HTTP_400_BAD_REQUEST)

    msg = SupportMessage.objects.create(
        ticket=ticket,
        sender=request.user,
        body=body,
    )
    ticket.status = 'pending'
    ticket.save(update_fields=['status', 'updated_at'])

    return Response({
        'id': msg.id,
        'sender': "Me",
        'role': "Client",
        'avatar': "https://i.pravatar.cc/150?img=11",
        'time': msg.created_at.strftime("%d %b %Y, %I:%M %p"),
        'body': msg.body,
    })


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def platform_settings_list(request):
    if getattr(request.user, 'role', '').lower() != 'admin' and not request.user.is_superuser:
        return Response({'detail': 'Not authorized.'}, status=status.HTTP_403_FORBIDDEN)
        
    from apps.governance.models import PlatformSetting
    
    if request.method == 'GET':
        settings = PlatformSetting.objects.all()
        data = [{'key': s.key, 'value': s.value} for s in settings]
        return Response(data)
        
    elif request.method == 'POST':
        # Expecting a list of dicts: [{'key': 'site_name', 'value': 'Boulot Man'}, ...]
        data = request.data
        if not isinstance(data, list):
            return Response({'detail': 'Expected a list of settings objects.'}, status=status.HTTP_400_BAD_REQUEST)
            
        updated_settings = []
        for item in data:
            key = item.get('key')
            val = item.get('value')
            if key:
                obj, created = PlatformSetting.objects.update_or_create(
                    key=key,
                    defaults={'value': val, 'updated_by': request.user}
                )
                updated_settings.append({'key': obj.key, 'value': obj.value})
                
        return Response(updated_settings)
