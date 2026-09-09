from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.db import transaction
from utils.storage import upload_file, delete_file

from utils.cache import cached

from .models import CompanyProfile, CompanyProject, CompanyService, CompanyCertification, CompanyVerificationDocument, CompanyTeamMember, CompanyReview, QuoteRequest, CompanyActivity
from .serializers import (
    CompanyProfileSerializer, CompanyProjectSerializer,
    CompanyServiceSerializer, CompanyCertificationSerializer, CompanyVerificationDocumentSerializer, CompanyReviewSerializer,
    QuoteRequestSerializer, CompanyActivitySerializer
)


@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def company_profile(request):
    profile, created = CompanyProfile.objects.get_or_create(
        user=request.user,
        defaults={'company_name': f"{request.user.first_name} {request.user.last_name}".strip() or "My Company"}
    )

    if request.method == 'GET':
        serializer = CompanyProfileSerializer(profile)
        return Response(serializer.data)
    elif request.method == 'PATCH':
        serializer = CompanyProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([AllowAny])
def company_public_profile(request, company_id):
    try:
        profile = CompanyProfile.objects.get(id=company_id)
    except CompanyProfile.DoesNotExist:
        return Response({"error": "Company not found"}, status=status.HTTP_404_NOT_FOUND)

    data = CompanyProfileSerializer(profile).data
    data['projects'] = CompanyProjectSerializer(profile.projects.all()[:5], many=True).data
    data['services'] = CompanyServiceSerializer(profile.services.all(), many=True).data
    data['certifications'] = CompanyCertificationSerializer(profile.certifications.all(), many=True).data
    data['reviews'] = CompanyReviewSerializer(profile.reviews.all()[:10], many=True).data
    return Response(data)


@api_view(['GET'])
@permission_classes([AllowAny])
def list_companies(request):
    limit = int(request.query_params.get('limit', '12'))
    show_all = request.query_params.get('all_status') == 'true'
    qs = CompanyProfile.objects.select_related('user')
    if not show_all:
        qs = qs.filter(is_verified=True)
    qs = qs.order_by('-created_at')[:max(1, min(limit, 50))]
    data = []
    for profile in qs:
        item = CompanyProfileSerializer(profile).data
        item['projects_count'] = profile.projects.count()
        item['services_count'] = profile.services.count()
        item['reviews_count'] = profile.reviews.count()
        data.append(item)
    return Response(data)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def company_projects_list_create(request):
    profile, created = CompanyProfile.objects.get_or_create(
        user=request.user,
        defaults={'company_name': f"{request.user.first_name} {request.user.last_name}".strip() or "My Company"}
    )

    if request.method == 'GET':
        projects = profile.projects.all()
        status_filter = request.query_params.get('status')
        if status_filter:
            projects = projects.filter(status=status_filter)
        serializer = CompanyProjectSerializer(projects, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        if not profile.is_verified and not request.user.is_verified and getattr(request.user, 'role', '') != 'ADMIN':
            return Response({"error": "Your company account is pending Admin verification. You can post services and projects once approved by Admin."}, status=status.HTTP_403_FORBIDDEN)

        serializer = CompanyProjectSerializer(data=request.data)
        if serializer.is_valid():
            project = serializer.save(company=profile)
            try:
                CompanyActivity.objects.create(
                    company=profile,
                    text=f"New project published: {project.title}",
                    icon_type="project"
                )
            except Exception:
                pass
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

company_projects = company_projects_list_create


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def company_services(request):
    profile, created = CompanyProfile.objects.get_or_create(
        user=request.user,
        defaults={'company_name': f"{request.user.first_name} {request.user.last_name}".strip() or "My Company"}
    )

    if request.method == 'GET':
        services = profile.services.all()
        serializer = CompanyServiceSerializer(services, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        if not profile.is_verified and not request.user.is_verified and getattr(request.user, 'role', '') != 'ADMIN':
            return Response({"error": "Your company account is pending Admin verification. You can post services once approved by Admin."}, status=status.HTTP_403_FORBIDDEN)

        serializer = CompanyServiceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(company=profile)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def delete_company_service(request, service_id):
    try:
        profile = CompanyProfile.objects.get(user=request.user)
    except CompanyProfile.DoesNotExist:
        return Response({"error": "Company profile not found"}, status=status.HTTP_404_NOT_FOUND)
    try:
        service = profile.services.get(id=service_id)
    except CompanyService.DoesNotExist:
        return Response({"error": "Service not found"}, status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET':
        return Response(CompanyServiceSerializer(service).data)
    if request.method == 'PATCH':
        if not profile.is_verified and getattr(request.user, 'role', '') != 'ADMIN':
            return Response({'error': 'Company verification is required before editing published services.'}, status=status.HTTP_403_FORBIDDEN)
        serializer = CompanyServiceSerializer(service, data=request.data, partial=True)
        if serializer.is_valid():
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    service.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def company_project_detail(request, project_id):
    try:
        profile = CompanyProfile.objects.get(user=request.user)
        project = profile.projects.get(id=project_id)
    except (CompanyProfile.DoesNotExist, CompanyProject.DoesNotExist):
        return Response({'error': 'Project not found'}, status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET':
        return Response(CompanyProjectSerializer(project).data)
    if not profile.is_verified and getattr(request.user, 'role', '') != 'ADMIN':
        return Response({'error': 'Company verification is required for project changes.'}, status=status.HTTP_403_FORBIDDEN)
    if request.method == 'PATCH':
        serializer = CompanyProjectSerializer(project, data=request.data, partial=True)
        if serializer.is_valid():
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    project.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def company_team(request):
    try:
        profile = CompanyProfile.objects.get(user=request.user)
    except CompanyProfile.DoesNotExist:
        return Response({'error': 'Company profile not found'}, status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET':
        members = profile.team_members.all()
        return Response([{'id': m.id, 'name': m.name, 'role': m.role, 'email': m.email, 'status': m.status, 'created_at': m.created_at} for m in members])
    required = ['name', 'role']
    if any(not str(request.data.get(field, '')).strip() for field in required):
        return Response({'error': 'name and role are required.'}, status=status.HTTP_400_BAD_REQUEST)
    member = profile.team_members.create(
        name=str(request.data['name']).strip(), role=str(request.data['role']).strip(),
        email=str(request.data.get('email', '')).strip(), status=str(request.data.get('status', 'active')).strip() or 'active',
    )
    return Response({'id': member.id, 'name': member.name, 'role': member.role, 'email': member.email, 'status': member.status, 'created_at': member.created_at}, status=status.HTTP_201_CREATED)


@api_view(['PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def company_team_detail(request, member_id):
    try:
        profile = CompanyProfile.objects.get(user=request.user)
    except CompanyProfile.DoesNotExist:
        return Response({'error': 'Company profile not found'}, status=status.HTTP_404_NOT_FOUND)
    try:
        member = profile.team_members.get(id=member_id)
    except CompanyTeamMember.DoesNotExist:
        return Response({'error': 'Team member not found'}, status=status.HTTP_404_NOT_FOUND)
    if request.method == 'PATCH':
        for field in ('name', 'role', 'email', 'status'):
            if field in request.data:
                setattr(member, field, str(request.data[field]).strip())
        member.save(update_fields=['name', 'role', 'email', 'status'])
        return Response({'id': member.id, 'name': member.name, 'role': member.role, 'email': member.email, 'status': member.status, 'created_at': member.created_at})
    member.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def company_verification_documents(request):
    profile, _ = CompanyProfile.objects.get_or_create(user=request.user, defaults={'company_name': request.user.get_full_name() or 'My Company'})
    if request.method == 'GET':
        return Response(CompanyVerificationDocumentSerializer(profile.verification_documents.all(), many=True).data)
    document_type = str(request.data.get('document_type', '')).strip()
    file_obj = request.FILES.get('file') or request.FILES.get('document')
    if not document_type or not file_obj:
        return Response({'error': 'document_type and file are required.'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        result = upload_file(file_obj, prefix=f'companies/{profile.id}/verification')
    except ValueError as exc:
        return Response({'error': str(exc)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as exc:
        return Response({'error': f'Upload failed: {exc}'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
    document = CompanyVerificationDocument.objects.create(
        company=profile, document_type=document_type, file_url=result['public_url'], storage_key=result['key'],
        file_name=file_obj.name, file_size=result['size'], content_type=result['content_type'],
    )
    return Response(CompanyVerificationDocumentSerializer(document).data, status=status.HTTP_201_CREATED)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_company_verification_document(request, document_id):
    try:
        profile = CompanyProfile.objects.get(user=request.user)
        document = profile.verification_documents.get(id=document_id)
    except (CompanyProfile.DoesNotExist, CompanyVerificationDocument.DoesNotExist):
        return Response({'error': 'Document not found'}, status=status.HTTP_404_NOT_FOUND)
    if document.status == 'approved':
        return Response({'error': 'Approved documents cannot be deleted.'}, status=status.HTTP_403_FORBIDDEN)
    delete_file(document.storage_key)
    document.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def company_projects_list_create(request):
    try:
        profile = CompanyProfile.objects.get(user=request.user)
    except CompanyProfile.DoesNotExist:
        return Response({"error": "Company profile not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        projects = profile.projects.all()
        serializer = CompanyProjectSerializer(projects, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        if not profile.is_verified and not request.user.is_verified and getattr(request.user, 'role', '') != 'ADMIN':
            return Response({'error': 'Your company account is pending Admin verification. You can publish projects once approved by Admin.'}, status=status.HTTP_403_FORBIDDEN)
        serializer = CompanyProjectSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(company=profile)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def company_certifications_list_create(request):
    try:
        profile = CompanyProfile.objects.get(user=request.user)
    except CompanyProfile.DoesNotExist:
        return Response({"error": "Company profile not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        certs = profile.certifications.all()
        serializer = CompanyCertificationSerializer(certs, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = CompanyCertificationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(company=profile)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_company_review(request, company_id):
    try:
        profile = CompanyProfile.objects.get(id=company_id)
    except CompanyProfile.DoesNotExist:
        return Response({"error": "Company not found"}, status=status.HTTP_404_NOT_FOUND)

    from .serializers import CompanyReviewSerializer
    serializer = CompanyReviewSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    review = serializer.save(company=profile, reviewer=request.user)

    reviews = profile.reviews.all()
    total = sum(r.rating for r in reviews)
    profile.average_rating = round(total / reviews.count(), 2) if reviews.exists() else 0
    profile.review_count = reviews.count()
    profile.save(update_fields=['average_rating', 'review_count'])

    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def company_quotes(request):
    try:
        profile = CompanyProfile.objects.get(user=request.user)
    except CompanyProfile.DoesNotExist:
        return Response({"error": "Company profile not found"}, status=status.HTTP_404_NOT_FOUND)

    quotes = profile.quote_requests.all()
    serializer = QuoteRequestSerializer(quotes, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_company_quote(request, company_id):
    try:
        company = CompanyProfile.objects.get(id=company_id)
    except CompanyProfile.DoesNotExist:
        try:
            company = CompanyProfile.objects.get(user__id=company_id)
        except CompanyProfile.DoesNotExist:
            return Response({"error": "Company profile not found"}, status=status.HTTP_404_NOT_FOUND)

    client_name = f"{request.user.first_name or ''} {request.user.last_name or ''}".strip() or request.user.username or "Client"

    data = request.data.copy()
    data['company'] = company.id
    data['client_name'] = data.get('client_name') or client_name
    data['client_email'] = data.get('client_email') or request.user.email
    data['client_phone'] = data.get('client_phone') or getattr(request.user, 'phone', '')
    
    serializer = QuoteRequestSerializer(data=data)
    if serializer.is_valid():
        quote = serializer.save(company=company)
        CompanyActivity.objects.create(
            company=company,
            text=f"New quote request from {client_name} for {quote.service}",
            icon_type="quote"
        )
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def company_activities(request):
    try:
        profile = CompanyProfile.objects.get(user=request.user)
    except CompanyProfile.DoesNotExist:
        return Response({"error": "Company profile not found"}, status=status.HTTP_404_NOT_FOUND)

    activities = profile.activities.all()
    serializer = CompanyActivitySerializer(activities, many=True)
    return Response(serializer.data)


@api_view(['PATCH', 'PUT'])
@permission_classes([IsAuthenticated])
def update_company_quote(request, quote_id):
    try:
        quote = QuoteRequest.objects.get(id=quote_id)
    except QuoteRequest.DoesNotExist:
        return Response({"error": "Quote not found"}, status=status.HTTP_404_NOT_FOUND)

    try:
        profile = CompanyProfile.objects.get(user=request.user)
    except CompanyProfile.DoesNotExist:
        return Response({"error": "Company profile not found"}, status=status.HTTP_404_NOT_FOUND)
    if quote.company_id != profile.id and getattr(request.user, 'role', '') != 'ADMIN':
        return Response({"error": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)

    new_status = request.data.get('status')
    if new_status not in ['approved', 'accepted', 'rejected']:
        return Response({"error": "Status must be approved, accepted, or rejected."}, status=status.HTTP_400_BAD_REQUEST)
    if new_status:
        quote.status = new_status
        quote.save(update_fields=['status'])

    if new_status in ['approved', 'accepted']:
        from .models import CompanyProject
        project_title = quote.service or f"Contract with {quote.client_name}"
        if not CompanyProject.objects.filter(company=quote.company, title__iexact=project_title).exists():
            numeric_budget = None
            if quote.budget:
                import re
                nums = re.findall(r'\d+', str(quote.budget).replace(',', ''))
                if nums:
                    numeric_budget = float(''.join(nums))
            CompanyProject.objects.create(
                company=quote.company,
                title=project_title,
                client_name=quote.client_name,
                budget=numeric_budget or 50000,
                status='active',
                progress=20,
            )

    serializer = QuoteRequestSerializer(quote)
    return Response(serializer.data)
