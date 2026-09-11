from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.db.models import Count, Q
from django.utils import timezone

from utils.cache import cached
from apps.governance.services import create_notification, create_audit_log, notify_users

from .models import Task, Bid, Question, Category, Skill, TaskView, ServiceInquiry
from .serializers import (
    TaskListSerializer, TaskDetailSerializer, TaskCreateSerializer,
    BidListSerializer, BidDetailSerializer, BidCreateSerializer,
    QuestionSerializer, QuestionCreateSerializer,
    CategorySerializer, SkillSerializer, ServiceInquirySerializer
)


DEFAULT_CATEGORIES_TREE = [
    {
        "category": "Software & Digital Engineering",
        "icon": "https://img.icons8.com/fluency/96/source-code.png",
        "skills": [
            "Web application development",
            "Mobile application development (Android / iOS)",
            "Backend systems & API development",
            "UI/UX design engineering",
            "QA testing & automation",
            "E-commerce platform development",
            "WordPress & CMS development",
            "Database design & optimization",
            "Product prototyping & MVP development",
            "Legacy system modernization"
        ]
    },
    {
        "category": "IT Infrastructure & Networking",
        "icon": "https://img.icons8.com/fluency/96/network.png",
        "skills": [
            "Network setup & configuration",
            "Server administration & OS config",
            "Hardware installation & repair",
            "System backup & data recovery",
            "IT support & troubleshooting",
            "Virtualization & VM management",
            "Local Area Network (LAN) optimization",
            "Wide Area Network (WAN) routing",
            "Active Directory setup",
            "Structured cabling"
        ]
    },
    {
        "category": "Cybersecurity Services",
        "icon": "https://img.icons8.com/fluency/96/cyber-security.png",
        "skills": [
            "Penetration testing & ethical hacking",
            "Security auditing & risk analysis",
            "Incident response & forensics",
            "Compliance consulting (GDPR/HIPAA)",
            "Vulnerability assessment",
            "Data encryption & cryptography",
            "Identity & Access Management (IAM)",
            "Endpoint security protection",
            "Firewall & IDS/IPS setup",
            "Malware analysis & removal"
        ]
    },
    {
        "category": "Cloud & Systems Engineering",
        "icon": "https://img.icons8.com/fluency/96/cloud.png",
        "skills": [
            "AWS & Cloud architecture",
            "DevOps & CI/CD pipelines",
            "Docker & Kubernetes orchestration",
            "Database clustering & replication",
            "High availability systems",
            "Cloud migration & optimization",
            "Monitoring & logging (Prometheus/ELK)",
            "Terraform & Infrastructure as Code",
            "Disaster recovery planning",
            "Microservices architecture"
        ]
    },
    {
        "category": "Electrical & Electronics Engineering",
        "icon": "https://img.icons8.com/fluency/96/electrical.png",
        "skills": [
            "Residential & commercial wiring",
            "Circuit breaker & panel installation",
            "Generator maintenance & repair",
            "Industrial electrical troubleshooting",
            "Power surge protection",
            "Lighting & LED design",
            "High-voltage transformer maintenance",
            "Appliance repair & diagnostics",
            "Energy audit & load balancing",
            "Electronic board & PCB repair"
        ]
    },
    {
        "category": "Civil, Construction & Architecture",
        "icon": "https://img.icons8.com/fluency/96/engineering.png",
        "skills": [
            "Masonry & bricklaying",
            "Custom carpentry & woodwork",
            "Roofing installation & leak repair",
            "Tile & marble flooring",
            "Painting & wall decorating",
            "Plastering & drywall finishing",
            "Welding & metal fabrication",
            "Paving & landscape construction",
            "Architectural drafting & remodeling",
            "Structural engineering inspection"
        ]
    },
    {
        "category": "Mechanical & Industrial Engineering",
        "icon": "https://img.icons8.com/fluency/96/gears.png",
        "skills": [
            "HVAC & air conditioner installation",
            "Commercial refrigeration setup",
            "Industrial machinery maintenance",
            "Plumbing networks & pump setup",
            "Hydraulic system diagnostics",
            "Pneumatic systems servicing",
            "Boiler & heating maintenance",
            "Conveyor belt maintenance",
            "Cold room repair",
            "CNC machining & metal turning"
        ]
    },
    {
        "category": "Renewable Energy & Utilities",
        "icon": "https://img.icons8.com/fluency/96/solar-panel.png",
        "skills": [
            "Solar panel system planning",
            "Solar inverter & battery installation",
            "Wind turbine engineering",
            "Smart grid design & implementation",
            "Energy audits & efficiency",
            "Battery storage solutions",
            "Utility mapping & surveying",
            "Hydroelectric systems analysis",
            "Geothermal system design",
            "EV charging station installation"
        ]
    },
    {
        "category": "Automotive & Heavy Equipment",
        "icon": "https://img.icons8.com/fluency/96/car-service.png",
        "skills": [
            "Engine diagnostics & overhaul",
            "Auto electrical & wiring repair",
            "Brake & suspension repair",
            "Transmission repair & servicing",
            "Diesel generator & pump repair",
            "Heavy equipment hydraulics",
            "Air conditioning & coolant recharge",
            "Bodywork & spray painting",
            "Tire balancing & wheel alignment",
            "Fleet preventive maintenance"
        ]
    },
    {
        "category": "Telecom, Broadcast & Security Systems",
        "icon": "https://img.icons8.com/fluency/96/radio-tower.png",
        "skills": [
            "CCTV camera installation & NVR config",
            "Electric fence installation",
            "Biometric access control systems",
            "Burglar & fire alarm setup",
            "Automatic gate motor installation",
            "Intercom & video doorbell setup",
            "Fiber optics splicing & cabling",
            "Radio communication & antennas",
            "Smart home automation",
            "Security system maintenance & repair"
        ]
    },
    {
        "category": "Handyman & Home Maintenance",
        "icon": "https://img.icons8.com/fluency/96/maintenance.png",
        "skills": [
            "General home repairs",
            "Furniture assembly & repair",
            "Door lock & hardware installation",
            "Curtain rod & blind mounting",
            "Minor plumbing & tap fixes",
            "Minor electrical & switch replacement",
            "Pressure washing & surface cleaning",
            "Drywall patching & touch-up painting",
            "Appliance installation",
            "Gutter cleaning & repair"
        ]
    },
    {
        "category": "Cleaning, Outdoor & Environmental Services",
        "icon": "https://img.icons8.com/fluency/96/broom.png",
        "skills": [
            "Deep house & office cleaning",
            "Post-construction cleaning",
            "Fumigation & pest control",
            "Lawn mowing & garden landscaping",
            "Septic tank draining & sanitation",
            "Water tank cleaning & disinfection",
            "Carpet & upholstery steam cleaning",
            "Window & glass facade cleaning",
            "Waste disposal & recycling management",
            "Tree trimming & pool maintenance"
        ]
    },
    {
        "category": "Transport, Logistics & Support Services",
        "icon": "https://img.icons8.com/fluency/96/delivery.png",
        "skills": [
            "Goods delivery & dispatch",
            "Relocation & house moving services",
            "Heavy cargo trucking",
            "Courier & parcel logistics",
            "Fleet management & tracking",
            "Warehouse loading & inventory",
            "Cold-chain transport",
            "Event transport logistics",
            "Vehicle rental with driver",
            "Airport pickup & protocol transport"
        ]
    },
    {
        "category": "Health, Beauty & Personal Care",
        "icon": "https://img.icons8.com/fluency/96/spa.png",
        "skills": [
            "Massage therapy & physical relaxation",
            "Hair styling, cutting & coloring",
            "Nail care (Manicure/Pedicure)",
            "Makeup artistry for events",
            "Skincare treatments & facials",
            "Laser hair removal & dermatology",
            "Personal training & fitness instruction",
            "Nutrition planning & consulting",
            "Acupuncture & holistic therapy",
            "Barbering & men's grooming"
        ]
    },
    {
        "category": "Education, Language & Document Services",
        "icon": "https://img.icons8.com/fluency/96/student-center.png",
        "skills": [
            "Math & Science tutoring",
            "Language instruction (English, French, etc.)",
            "Music & Instrument lessons",
            "Standardized test preparation",
            "Coding & Computer Science instruction",
            "Translation & interpretation",
            "Document drafting & formatting",
            "Business & Finance tutoring",
            "Life coaching & mentoring",
            "Curriculum development"
        ]
    }
]


def ensure_default_categories():
    """Ensure standard 13 master categories exist in database and purge numeric artifacts."""
    try:
        # 1. Purge/Deactivate any numeric dummy category records (e.g. "12")
        Category.objects.filter(Q(name__regex=r'^\d+$') | Q(slug__regex=r'^\d+$')).delete()
    except Exception:
        pass

    # 2. Ensure each master category exists
    for idx, item in enumerate(DEFAULT_CATEGORIES_TREE):
        cat_name = item["category"]
        cat_slug = slugify(cat_name)
        cat, _ = Category.objects.get_or_create(
            slug=cat_slug,
            defaults={
                "name": cat_name,
                "icon": item.get("icon", ""),
                "order": idx,
                "is_active": True
            }
        )
        # Ensure it has right name and active
        if not cat.is_active or cat.name != cat_name:
            cat.name = cat_name
            cat.is_active = True
            cat.order = idx
            cat.icon = item.get("icon", cat.icon)
            cat.save(update_fields=['name', 'is_active', 'order', 'icon'])

        for s_idx, skill_name in enumerate(item.get("skills", [])):
            skill_slug = slugify(f"{cat_name}-{skill_name}")
            sub_slug = slugify(f"sub-{cat_name}-{skill_name}")
            Category.objects.get_or_create(
                slug=sub_slug,
                defaults={
                    "name": skill_name,
                    "parent": cat,
                    "order": s_idx,
                    "is_active": True
                }
            )
            Skill.objects.get_or_create(
                slug=skill_slug,
                defaults={
                    "name": skill_name,
                    "category": cat
                }
            )


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def category_list(request):
    if request.method == 'GET':
        ensure_default_categories()
        categories = (
            Category.objects.filter(is_active=True, parent=None)
            .exclude(name__regex=r'^\d+$')
            .order_by('order', 'id')
        )
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        if not request.user.is_authenticated or request.user.role != 'ADMIN':
            return Response({"error": "Only admins can create categories"}, status=status.HTTP_403_FORBIDDEN)
        
        name = request.data.get('name')
        if not name:
            return Response({"error": "Name is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        base_slug = slugify(name)
        slug = base_slug
        counter = 1
        while Category.objects.filter(slug=slug).exists():
            counter += 1
            slug = f"{base_slug}-{counter}"
            
        parent_id = request.data.get('parent_id')
        parent = None
        if parent_id:
            try:
                parent = Category.objects.get(id=parent_id)
            except Category.DoesNotExist:
                return Response({"error": "Parent category not found"}, status=status.HTTP_400_BAD_REQUEST)
                
        category = Category.objects.create(
            name=name,
            slug=slug,
            description=request.data.get('description', ''),
            icon=request.data.get('icon', ''),
            parent=parent
        )
        return Response(CategorySerializer(category).data, status=status.HTTP_201_CREATED)


@api_view(['PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def category_detail(request, category_id):
    if request.user.role != 'ADMIN':
        return Response({"error": "Only admins can delete categories"}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        category = Category.objects.get(id=category_id)
    except Category.DoesNotExist:
        return Response({"error": "Category not found"}, status=status.HTTP_404_NOT_FOUND)
        
    if request.method == 'DELETE':
        category.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    data = request.data
    if 'name' in data:
        category.name = data['name'].strip() or category.name
        if 'slug' not in data or not str(data.get('slug', '')).strip():
            category.slug = slugify(category.name)
    if 'slug' in data and str(data['slug']).strip():
        category.slug = slugify(str(data['slug']).strip())
    if 'description' in data:
        category.description = data['description']
    if 'icon' in data:
        category.icon = data['icon']
    if 'is_active' in data:
        category.is_active = bool(data['is_active'])
    if 'order' in data:
        category.order = int(data['order'] or 0)
    if 'parent_id' in data:
        parent_id = data.get('parent_id')
        if parent_id:
            try:
                category.parent = Category.objects.get(id=parent_id)
            except Category.DoesNotExist:
                return Response({"error": "Parent category not found"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            category.parent = None
    category.save()
    return Response(CategorySerializer(category).data)

@api_view(['GET'])
@permission_classes([AllowAny])
@cached("skills", ttl=600)
def skill_list(request):
    category_param = request.query_params.get('category')
    skills = Skill.objects.all()
    if category_param:
        if category_param.isdigit():
            skills = skills.filter(category_id=category_param)
        else:
            skills = skills.filter(category__slug=category_param)
    serializer = SkillSerializer(skills, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([AllowAny])
def submit_inquiry(request):
    serializer = ServiceInquirySerializer(data=request.data)
    if serializer.is_valid():
        inquiry = serializer.save()

        # Send automated branded emails to client and team
        try:
            from utils.email_service import build_branded_email_html, send_platform_email

            # 1. Confirmation email to the client
            user_html = build_branded_email_html(
                heading_title="Project Review Request Received",
                heading_subtitle="BoulotMan Project Execution & Contractors",
                body_content=f"""
                <p>Hello <strong>{inquiry.name}</strong>,</p>
                <p>Thank you for submitting your project request to <strong>Boulot Man Contractors</strong>.</p>
                <p>Our engineering and project management team is reviewing your specifications, workforce requirements, and timeline.</p>
                <p>A dedicated project coordinator will reach out to you shortly via email or phone to discuss the execution structure and next steps.</p>
                """,
                highlight_boxes=[{
                    "label": "Project Reference",
                    "value": f"PRJ-REV-{inquiry.id:04d}",
                    "accent_color": "#FF4500"
                }],
                cta_button={
                    "text": "Explore Contractors & Services",
                    "url": "https://boulotman.com/contractors"
                }
            )
            send_platform_email(
                subject=f"We've Received Your Project Request: {inquiry.name} [Ref #PRJ-REV-{inquiry.id:04d}]",
                message=f"Hello {inquiry.name},\n\nWe have received your project request. Our engineering team is currently reviewing the specifications.",
                recipient_list=[inquiry.email],
                html_message=user_html,
                sender_type="no_reply",
                fail_silently=True
            )

            # 2. Notification to the BoulotMan Operations team (quote@ / companies@)
            team_html = build_branded_email_html(
                heading_title="New Project Review Request",
                heading_subtitle="BoulotMan Contractors Hub Alert",
                body_content=f"""
                <p>A new project execution review has been submitted on <strong>Boulot Man Contractors</strong>:</p>
                <p><strong>Client Name:</strong> {inquiry.name}<br/>
                <strong>Email:</strong> <a href="mailto:{inquiry.email}">{inquiry.email}</a><br/>
                <strong>Phone:</strong> {inquiry.phone or 'N/A'}<br/>
                <strong>Client / Company:</strong> {inquiry.company_name or 'N/A'}<br/>
                <strong>Inquiry Type:</strong> {inquiry.get_inquiry_type_display()}</p>
                <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0;"/>
                <p><strong>Project Details & Scope:</strong></p>
                <pre style="background:#f8fafc;padding:14px;border-radius:8px;white-space:pre-wrap;font-family:sans-serif;font-size:13px;color:#1e293b;border:1px solid #e2e8f0;">{inquiry.details}</pre>
                """,
                cta_button={
                    "text": "Open Admin Dashboard",
                    "url": "https://boulotman.com/dashboard/admin"
                }
            )
            send_platform_email(
                subject=f"[NEW PROJECT REVIEW] {inquiry.name} - {inquiry.company_name or 'Project Request'}",
                message=f"New inquiry from {inquiry.name} ({inquiry.email}):\n\n{inquiry.details}",
                recipient_list=["quote@boulotman.com", "companies@boulotman.com"],
                html_message=team_html,
                sender_type="contact",
                fail_silently=True
            )
        except Exception:
            pass

        return Response({"message": "Inquiry submitted successfully", "data": serializer.data}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([AllowAny])
def task_list(request):
    show_all = request.query_params.get('all_status') == 'true'
    tasks = Task.objects.select_related('client', 'category').filter(status='open', assigned_to__isnull=True)
    if not show_all:
        tasks = tasks.filter(client__is_verified=True)



    category = request.query_params.get('category')
    if category:
        tasks = tasks.filter(category__slug=category)

    city = request.query_params.get('city')
    if city:
        tasks = tasks.filter(city__icontains=city)

    budget_min = request.query_params.get('budget_min')
    if budget_min:
        tasks = tasks.filter(budget_max__gte=budget_min)

    budget_max = request.query_params.get('budget_max')
    if budget_max:
        tasks = tasks.filter(budget_min__lte=budget_max)

    urgency = request.query_params.get('urgency')
    if urgency:
        tasks = tasks.filter(urgency=urgency)

    search = request.query_params.get('q')
    if search:
        tasks = tasks.filter(Q(title__icontains=search) | Q(description__icontains=search))

    sort = request.query_params.get('sort', '-created_at')
    if sort == 'newest':
        tasks = tasks.order_by('-created_at')
    elif sort == 'budget_high':
        tasks = tasks.order_by('-budget_max')
    elif sort == 'budget_low':
        tasks = tasks.order_by('budget_min')
    else:
        tasks = tasks.order_by('-created_at')

    page = int(request.query_params.get('page', 1))
    limit = int(request.query_params.get('limit', 20))
    start = (page - 1) * limit
    end = start + limit
    total = tasks.count()

    serializer = TaskListSerializer(tasks[start:end], many=True)
    return Response({
        'results': serializer.data,
        'total': total,
        'page': page,
        'limit': limit,
        'total_pages': (total + limit - 1) // limit,
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def task_create(request):
    if not request.user.is_verified and getattr(request.user, 'role', '') != 'ADMIN':
        return Response({"error": "Your account is pending Admin verification. You can post tasks once approved by Admin."}, status=status.HTTP_403_FORBIDDEN)

    serializer = TaskCreateSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        task = serializer.save()

        create_audit_log(
            actor=request.user,
            action="task_created",
            entity_type="task",
            entity_id=task.id,
            summary=task.title,
            metadata={"status": task.status, "category_id": task.category_id},
            ip_address=request.META.get("REMOTE_ADDR"),
        )
        
        client_name = f"{request.user.first_name or ''} {request.user.last_name or ''}".strip() or request.user.username or "Client"
        
        # If directly assigned to a technician, notify the technician
        if task.assigned_to:
            create_notification(
                user=task.assigned_to,
                category="task",
                title=f"New Direct Job Offer: {task.title}",
                body=f"{client_name} has directly hired and invited you for a new task!",
                link=f"/dashboard/technician/projects/{task.id}",
                metadata={"task_id": task.id},
            )
            create_notification(
                user=request.user,
                category="task",
                title=f"Direct Task Invitation Sent",
                body=f"Your direct task invitation for '{task.title}' was sent to the specialist.",
                link=f"/dashboard/client/tasks/{task.id}",
                metadata={"task_id": task.id},
            )
        else:
            create_notification(
                user=request.user,
                category="task",
                title=f"Task published: {task.title}",
                body="Your task has been published and is now visible to qualified professionals.",
                link=f"/dashboard/client/tasks/{task.id}",
                metadata={"task_id": task.id},
            )

        return Response(TaskDetailSerializer(task).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET', 'PATCH', 'DELETE'])
@permission_classes([AllowAny])
def task_detail(request, task_id):
    try:
        task = Task.objects.select_related('client', 'category').prefetch_related('bids__technician', 'questions__asker', 'attachments', 'skills').get(id=task_id)
    except Task.DoesNotExist:
        return Response({"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        ip = request.META.get('HTTP_X_FORWARDED_FOR', request.META.get('REMOTE_ADDR', '')).split(',')[0].strip()
        if ip:
            _, created = TaskView.objects.get_or_create(task=task, viewer_ip=ip)
            if created:
                task.views_count = task.task_views.count()
                task.save(update_fields=['views_count'])
        serializer = TaskDetailSerializer(task)
        return Response(serializer.data)

    elif request.method == 'PATCH':
        if request.user != task.client:
            return Response({"error": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)
        serializer = TaskCreateSerializer(task, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(TaskDetailSerializer(task).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        if request.user != task.client:
            return Response({"error": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)
        task.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def task_bids(request, task_id):
    try:
        task = Task.objects.get(id=task_id)
    except Task.DoesNotExist:
        return Response({"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        accepted_bids = task.bids.select_related('technician').filter(status='accepted')
        bids = accepted_bids if accepted_bids.exists() else task.bids.select_related('technician').all()
        serializer = BidListSerializer(bids, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        if not request.user.is_authenticated:
            return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)
        user_role = str(getattr(request.user, 'role', '')).upper()
        if user_role not in ['TECHNICIAN', 'COMPANY']:
            return Response({"error": "Only technicians and service providers can submit bids"}, status=status.HTTP_403_FORBIDDEN)
        if not request.user.is_verified and getattr(request.user, 'role', '') != 'ADMIN':
            return Response({"error": "Your account is pending Admin verification. You can place bids on tasks once approved by Admin."}, status=status.HTTP_403_FORBIDDEN)
        if request.user == task.client:
            return Response({"error": "You cannot submit a bid on your own task"}, status=status.HTTP_400_BAD_REQUEST)

        if task.status != 'open' or task.bids.filter(status='accepted').exists():
            return Response({"error": "This task is no longer accepting bids"}, status=status.HTTP_400_BAD_REQUEST)
        if Bid.objects.filter(task=task, technician=request.user).exclude(status='withdrawn').exists():
            return Response(
                {"error": "You already have an active bid on this task. Withdraw it first to submit a new one."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        serializer = BidCreateSerializer(data=request.data, context={'request': request, 'task': task})
        if serializer.is_valid():
            try:
                bid = serializer.save()
            except Exception as e:
                return Response({"error": "Could not submit bid. Please try again."}, status=status.HTTP_400_BAD_REQUEST)
            create_audit_log(
                actor=request.user,
                action="bid_created",
                entity_type="bid",
                entity_id=bid.id,
                summary=f"Bid on {task.title}",
                metadata={"task_id": task.id, "amount": str(bid.amount), "amount_type": bid.amount_type},
                ip_address=request.META.get("REMOTE_ADDR"),
            )
            create_notification(
                user=task.client,
                category="bid",
                title=f"New bid on {task.title}",
                body=f"{request.user.get_full_name() or request.user.email} submitted a bid.",
                link=f"/dashboard/client/tasks/{task.id}/proposals",
                metadata={"task_id": task.id, "bid_id": bid.id},
            )
            try:
                from utils.email_service import send_new_proposal_email
                send_new_proposal_email(task=task, bid=bid, client_user=task.client)
            except Exception as e:
                logger.warning("Could not send new proposal email: %s", e)
            return Response(BidDetailSerializer(bid).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def bid_detail(request, bid_id):
    try:
        bid = Bid.objects.select_related('technician', 'task__client').get(id=bid_id)
    except Bid.DoesNotExist:
        return Response({"error": "Bid not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = BidDetailSerializer(bid)
        return Response(serializer.data)

    elif request.method == 'PATCH':
        new_status = request.data.get('status')
        if new_status not in ['accepted', 'rejected']:
            return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)

        if request.user != bid.task.client:
            return Response({"error": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)

        bid.status = new_status
        if new_status == 'accepted':
            bid.accepted_at = timezone.now()
            bid.task.status = 'in_progress'
            bid.task.assigned_to = bid.technician
            bid.task.save(update_fields=['status', 'assigned_to'])
            create_notification(
                user=bid.technician,
                category="bid",
                title=f"Bid accepted: {bid.task.title}",
                body="Your bid was accepted and the task is now in progress.",
                link=f"/dashboard/technician/tasks/{bid.task.id}",
                metadata={"task_id": bid.task.id, "bid_id": bid.id},
            )
            try:
                from utils.email_service import send_proposal_accepted_email
                send_proposal_accepted_email(task=bid.task, bid=bid, tech_user=bid.technician)
            except Exception as e:
                logger.warning("Could not send proposal accepted email: %s", e)
        elif new_status == 'rejected':
            bid.rejected_at = timezone.now()
            create_notification(
                user=bid.technician,
                category="bid",
                title=f"Bid rejected: {bid.task.title}",
                body="Your bid was not selected this time.",
                link=f"/dashboard/technician/tasks/{bid.task.id}",
                metadata={"task_id": bid.task.id, "bid_id": bid.id},
            )
        bid.save()
        create_audit_log(
            actor=request.user,
            action="bid_updated",
            entity_type="bid",
            entity_id=bid.id,
            summary=f"{new_status.title()} bid on {bid.task.title}",
            metadata={"task_id": bid.task.id, "status": new_status},
            ip_address=request.META.get("REMOTE_ADDR"),
        )

        return Response(BidDetailSerializer(bid).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_bids(request):
    bids = Bid.objects.filter(technician=request.user).select_related('task__client', 'task__category')
    status_filter = request.query_params.get('status')
    if status_filter:
        bids = bids.filter(status=status_filter)
    serializer = BidListSerializer(bids, many=True)
    return Response(serializer.data)


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def task_questions(request, task_id):
    try:
        task = Task.objects.get(id=task_id)
    except Task.DoesNotExist:
        return Response({"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        questions = task.questions.select_related('asker', 'replied_by').all()
        serializer = QuestionSerializer(questions, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        if not request.user.is_authenticated:
            return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)
        serializer = QuestionCreateSerializer(data=request.data, context={'request': request, 'task': task})
        if serializer.is_valid():
            serializer.save()
            return Response(QuestionSerializer(serializer.instance).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_tasks(request):
    if request.user.role == 'TECHNICIAN':
        tasks = (
            Task.objects
            .filter(Q(assigned_to=request.user) | Q(client=request.user))
            .select_related('category', 'assigned_to', 'client')
            .annotate(accepted_bids_count=Count('bids', filter=Q(bids__status='accepted')))
        )
    else:
        tasks = (
            Task.objects
            .filter(client=request.user)
            .select_related('category', 'assigned_to', 'client')
            .annotate(accepted_bids_count=Count('bids', filter=Q(bids__status='accepted')))
        )
    status_filter = request.query_params.get('status')
    if status_filter:
        tasks = tasks.filter(status=status_filter)
    serializer = TaskListSerializer(tasks, many=True)
    return Response(serializer.data)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def task_publish(request, task_id):
    try:
        task = Task.objects.get(id=task_id)
    except Task.DoesNotExist:
        return Response({"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.user != task.client:
        return Response({"error": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)
    if task.status != 'draft':
        return Response({"error": f"Task is already {task.status}"}, status=status.HTTP_400_BAD_REQUEST)

    task.status = 'open'
    task.published_at = timezone.now()
    task.save(update_fields=['status', 'published_at'])
    create_audit_log(
        actor=request.user,
        action="task_published",
        entity_type="task",
        entity_id=task.id,
        summary=task.title,
        metadata={"status": task.status},
        ip_address=request.META.get("REMOTE_ADDR"),
    )
    create_notification(
        user=request.user,
        category="task",
        title=f"Task published: {task.title}",
        body="Your task is now visible to professionals.",
        link=f"/dashboard/client/tasks/{task.id}",
        metadata={"task_id": task.id},
    )
    return Response(TaskDetailSerializer(task).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def task_submit_deliverable(request, task_id):
    try:
        task = Task.objects.select_related('client', 'assigned_to').get(id=task_id)
    except Task.DoesNotExist:
        return Response({"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND)

    notes = request.data.get('notes', '')
    completion_percentage = request.data.get('completion_percentage', 100)
    file_url = request.data.get('file_url')
    file_name = request.data.get('file_name', 'deliverable_proof.jpg')

    if file_url:
        TaskAttachment.objects.create(
            task=task,
            file_url=file_url,
            file_name=file_name,
            file_type='image' if any(file_name.lower().endswith(ext) for ext in ['.png', '.jpg', '.jpeg', '.webp']) else 'file',
            file_size=request.data.get('file_size', 0),
            uploaded_by=request.user,
        )

    # Notify client immediately
    create_notification(
        user=task.client,
        category="task",
        title=f"Work Submitted for Inspection: {task.title}",
        body=f"The specialist has submitted completed deliverables for review ({completion_percentage}%). Please inspect the work and confirm milestone escrow release.",
        link=f"/dashboard/client/projects/{task.id}",
        metadata={"task_id": task.id, "action": "inspection_required", "notes": notes},
    )

    create_audit_log(
        actor=request.user,
        action="deliverable_submitted",
        entity_type="task",
        entity_id=task.id,
        summary=f"Deliverable submitted for {task.title}",
        metadata={"task_id": task.id, "percentage": completion_percentage, "notes": notes},
        ip_address=request.META.get("REMOTE_ADDR"),
    )

    return Response({
        "message": "Deliverable submitted successfully. Client notified for inspection.",
        "task_id": task.id,
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def task_complete(request, task_id):
    try:
        task = Task.objects.get(id=task_id)
    except Task.DoesNotExist:
        return Response({"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.user != task.client and request.user.role != 'ADMIN':
        accepted_bid = Bid.objects.filter(task=task, technician=request.user, status='accepted').exists()
        if not accepted_bid:
            return Response({"error": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)
    if task.status not in ['in_progress', 'open']:
        return Response({"error": f"Cannot complete a {task.status} task"}, status=status.HTTP_400_BAD_REQUEST)

    task.status = 'completed'
    task.save(update_fields=['status'])
    if task.client:
        create_notification(
            user=task.client,
            category="task",
            title=f"Task completed: {task.title}",
            body="The task has been marked completed.",
            link=f"/dashboard/client/tasks/{task.id}",
            metadata={"task_id": task.id},
        )
    if task.assigned_to:
        create_notification(
            user=task.assigned_to,
            category="task",
            title=f"Task completed: {task.title}",
            body="The client marked the task as completed.",
            link=f"/dashboard/technician/tasks/{task.id}",
            metadata={"task_id": task.id},
        )
    create_audit_log(
        actor=request.user,
        action="task_completed",
        entity_type="task",
        entity_id=task.id,
        summary=task.title,
        metadata={"status": task.status},
        ip_address=request.META.get("REMOTE_ADDR"),
    )

    return Response(TaskDetailSerializer(task).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def task_cancel(request, task_id):
    try:
        task = Task.objects.get(id=task_id)
    except Task.DoesNotExist:
        return Response({"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.user != task.client and request.user.role != 'ADMIN':
        return Response({"error": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)
    if task.status in ['completed', 'cancelled']:
        return Response({"error": f"Task is already {task.status}"}, status=status.HTTP_400_BAD_REQUEST)

    task.status = 'cancelled'
    task.save(update_fields=['status'])
    if task.client:
        create_notification(
            user=task.client,
            category="task",
            title=f"Task cancelled: {task.title}",
            body="The task has been cancelled.",
            link=f"/dashboard/client/tasks/{task.id}",
            metadata={"task_id": task.id},
        )
    if task.assigned_to:
        create_notification(
            user=task.assigned_to,
            category="task",
            title=f"Task cancelled: {task.title}",
            body="The task was cancelled by the client or admin.",
            link=f"/dashboard/technician/tasks/{task.id}",
            metadata={"task_id": task.id},
        )
    create_audit_log(
        actor=request.user,
        action="task_cancelled",
        entity_type="task",
        entity_id=task.id,
        summary=task.title,
        metadata={"status": task.status},
        ip_address=request.META.get("REMOTE_ADDR"),
    )
    return Response(TaskDetailSerializer(task).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def bid_withdraw(request, bid_id):
    try:
        bid = Bid.objects.get(id=bid_id)
    except Bid.DoesNotExist:
        return Response({"error": "Bid not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.user != bid.technician:
        return Response({"error": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)
    if bid.status != 'pending':
        return Response({"error": f"Cannot withdraw a {bid.status} bid"}, status=status.HTTP_400_BAD_REQUEST)
    if bid.task.status != 'open':
        return Response({"error": "Task is no longer open"}, status=status.HTTP_400_BAD_REQUEST)

    bid.status = 'withdrawn'
    bid.save(update_fields=['status'])
    create_audit_log(
        actor=request.user,
        action="bid_withdrawn",
        entity_type="bid",
        entity_id=bid.id,
        summary=f"Withdrawn from {bid.task.title}",
        metadata={"task_id": bid.task.id},
        ip_address=request.META.get("REMOTE_ADDR"),
    )
    return Response(BidDetailSerializer(bid).data)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def task_delete_attachment(request, task_id, attachment_id):
    try:
        att = TaskAttachment.objects.get(id=attachment_id, task_id=task_id)
    except TaskAttachment.DoesNotExist:
        return Response({"error": "Attachment not found"}, status=status.HTTP_404_NOT_FOUND)
    
    if request.user != att.task.client and request.user != att.uploaded_by and getattr(request.user, 'role', '') != 'ADMIN':
        return Response({"error": "Not authorized to delete this attachment"}, status=status.HTTP_403_FORBIDDEN)
    
    att.delete()
    return Response({"message": "Attachment deleted successfully"}, status=status.HTTP_200_OK)

 