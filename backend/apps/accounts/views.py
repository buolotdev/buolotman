from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.hashers import check_password, make_password
from django.utils import timezone
from datetime import timedelta

from utils.cache import cached
from utils.rate_limit import (
    AuthLoginThrottle, AuthRegisterThrottle, UploadThrottle, rate_limit_otp,
)
from apps.governance.services import create_notification, create_audit_log
from utils.otp import generate_otp, send_otp

from .serializers import (
    CustomTokenObtainPairSerializer,
    ClientRegistrationSerializer,
    TechnicianRegistrationSerializer,
    CompanyRegistrationSerializer,
    UserMeSerializer,
    PortfolioItemSerializer,
    SavedProfessionalSerializer,
    PortfolioItemSerializer,
    SavedProfessionalSerializer,
    TechnicianServiceSerializer,
    TechnicianDocumentSerializer,
)
from .models import PortfolioItem, SavedProfessional, PhoneOTPChallenge, TechnicianService, TechnicianDocument


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    throttle_classes = [AuthLoginThrottle]


@api_view(['POST'])
@rate_limit_otp
@permission_classes([AllowAny])
def request_phone_otp(request):
    phone = (request.data.get('phone') or '').strip()
    email = (request.data.get('email') or '').strip()
    purpose = (request.data.get('purpose') or 'verification').strip()

    if not phone:
        return Response({"error": "phone is required"}, status=status.HTTP_400_BAD_REQUEST)

    from django.contrib.auth import get_user_model
    User = get_user_model()
    user = None
    if email:
        user = User.objects.filter(email=email).first()
    if not user:
        user = User.objects.filter(phone=phone).first()

    code = generate_otp()
    challenge = PhoneOTPChallenge.objects.create(
        user=user,
        phone=phone,
        email=email,
        purpose=purpose if purpose in dict(PhoneOTPChallenge.PURPOSE_CHOICES) else 'verification',
        code_hash=make_password(code),
        expires_at=timezone.now() + timedelta(minutes=10),
        metadata={"requested_from": "api"},
    )
    send_otp(phone, code)

    return Response({
        "message": "OTP sent",
        "challenge_id": challenge.id,
        "expires_at": challenge.expires_at,
    })


@api_view(['POST'])
@rate_limit_otp
@permission_classes([AllowAny])
def verify_phone_otp(request):
    challenge_id = request.data.get('challenge_id')
    code = (request.data.get('code') or '').strip()

    if not challenge_id or not code:
        return Response({"error": "challenge_id and code are required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        challenge = PhoneOTPChallenge.objects.select_related('user').get(id=challenge_id)
    except PhoneOTPChallenge.DoesNotExist:
        return Response({"error": "OTP challenge not found"}, status=status.HTTP_404_NOT_FOUND)

    if challenge.verified_at:
        return Response({"error": "OTP already verified"}, status=status.HTTP_400_BAD_REQUEST)
    if challenge.expires_at < timezone.now():
        return Response({"error": "OTP expired"}, status=status.HTTP_400_BAD_REQUEST)
    if challenge.attempts >= 5:
        return Response({"error": "Too many failed attempts"}, status=status.HTTP_429_TOO_MANY_REQUESTS)

    challenge.attempts += 1
    if not check_password(code, challenge.code_hash):
        challenge.save(update_fields=['attempts'])
        return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)

    challenge.verified_at = timezone.now()
    challenge.save(update_fields=['attempts', 'verified_at'])

    if challenge.user:
        create_audit_log(
            actor=challenge.user,
            action="phone_verified",
            entity_type="user",
            entity_id=challenge.user.id,
            summary=challenge.user.email,
            metadata={"challenge_id": challenge.id, "purpose": challenge.purpose},
            ip_address=request.META.get("REMOTE_ADDR"),
        )

    return Response({"message": "OTP verified", "verified": True, "purpose": challenge.purpose})


@api_view(['POST'])
@permission_classes([AllowAny])
@throttle_classes([AuthRegisterThrottle])
def register_client(request):
    serializer = ClientRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        create_audit_log(
            actor=user,
            action="user_registered",
            entity_type="user",
            entity_id=user.id,
            summary="Client registration",
            metadata={"role": user.role},
            ip_address=request.META.get("REMOTE_ADDR"),
        )
        return Response({"message": "Client registered successfully."}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
@throttle_classes([AuthRegisterThrottle])
def register_technician(request):
    serializer = TechnicianRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        create_audit_log(
            actor=user,
            action="user_registered",
            entity_type="user",
            entity_id=user.id,
            summary="Technician registration",
            metadata={"role": user.role},
            ip_address=request.META.get("REMOTE_ADDR"),
        )
        return Response({"message": "Technician registered successfully. Awaiting verification."}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
@throttle_classes([AuthRegisterThrottle])
def register_company(request):
    serializer = CompanyRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        create_audit_log(
            actor=user,
            action="user_registered",
            entity_type="user",
            entity_id=user.id,
            summary="Company registration",
            metadata={"role": user.role},
            ip_address=request.META.get("REMOTE_ADDR"),
        )
        return Response({"message": "Company registered successfully. Awaiting verification."}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


KNOWN_PROFILE_FIELDS = {
    'first_name', 'last_name', 'phone', 'avatar_url', 'banner_url',
    'language_preference', 'country', 'city', 'address', 'date_of_birth',
    'education_level', 'expertise_level', 'role',
    'emergency_contact_name', 'emergency_contact_phone',
    'bio', 'about', 'headline', 'experience_years',
    'hourly_rate', 'daily_rate', 'starting_price', 'inspection_fee', 'is_negotiable',
    'pricing', 'availability', 'availability_status', 'available_now',
    'response_time', 'skills', 'tools', 'languages', 'portfolio',
    'payout', 'payout_info', 'kyc', 'kyc_info', 'kyc_status', 'background_check_status',
    'technician_profile'
}


def build_user_me_payload(user):
    from apps.accounts.models import TechnicianProfile, PortfolioItem
    from apps.accounts.serializers import UserMeSerializer, PortfolioItemSerializer

    serializer = UserMeSerializer(user)
    data = serializer.data
    tech_profile, _ = TechnicianProfile.objects.get_or_create(user=user)

    meta = tech_profile.languages if isinstance(tech_profile.languages, dict) else {}
    tools_list = meta.get('tools') if isinstance(meta, dict) else (tech_profile.languages if isinstance(tech_profile.languages, list) else [])

    headline = meta.get('headline')
    if not headline:
        trade = user.education_level or user.expertise_level
        headline = f"Certified {trade}" if trade else "Professional Specialist"

    experience_years = meta.get('experience_years') or ""
    emergency_name = meta.get('emergency_contact_name') or ""
    emergency_phone = meta.get('emergency_contact_phone') or ""

    hourly_rate_str = str(tech_profile.hourly_rate) if tech_profile.hourly_rate is not None else None
    daily_rate = meta.get('daily_rate') or (f"{int(tech_profile.hourly_rate)*7} XOF / day" if tech_profile.hourly_rate else "")
    starting_price = meta.get('starting_price') or (hourly_rate_str or "")
    inspection_fee = meta.get('inspection_fee') or ""
    is_neg = meta.get('is_negotiable', True)

    pricing = meta.get('pricing')
    if not isinstance(pricing, dict):
        pricing = {
            "hourly_rate": hourly_rate_str,
            "daily_rate": daily_rate,
            "starting_price": starting_price,
            "inspection_fee": inspection_fee,
            "is_negotiable": is_neg,
        }

    payout = meta.get('payout') or meta.get('payout_info') or {}
    kyc = meta.get('kyc') or meta.get('kyc_info') or {
        "status": tech_profile.background_check_status,
        "is_verified": tech_profile.is_verified or user.is_verified,
    }

    city = meta.get('city') or user.address or ""

    data['bio'] = tech_profile.bio or ""
    data['about'] = tech_profile.bio or ""
    data['city'] = city
    data['headline'] = headline
    data['experience_years'] = experience_years
    data['emergency_contact_name'] = emergency_name
    data['emergency_contact_phone'] = emergency_phone
    data['hourly_rate'] = hourly_rate_str
    data['daily_rate'] = daily_rate
    data['starting_price'] = starting_price
    data['inspection_fee'] = inspection_fee
    data['is_negotiable'] = is_neg
    data['pricing'] = pricing
    data['availability'] = tech_profile.availability_status
    data['availability_status'] = tech_profile.availability_status
    data['available_now'] = tech_profile.availability_status == 'available'
    data['response_time'] = tech_profile.response_time or ""
    data['completed_jobs'] = tech_profile.completed_jobs
    data['average_rating'] = str(tech_profile.average_rating)
    data['background_check_status'] = tech_profile.background_check_status
    data['payout'] = payout
    data['kyc'] = kyc

    # Portfolio
    if tech_profile.portfolio and len(tech_profile.portfolio) > 0:
        data['portfolio'] = tech_profile.portfolio
    else:
        items = PortfolioItem.objects.filter(user=user)
        if items.exists():
            data['portfolio'] = PortfolioItemSerializer(items, many=True).data
        else:
            data['portfolio'] = []

    # Skills & Tools
    data['skills'] = [s.name for s in tech_profile.skills.all()]
    data['tools'] = tools_list
    data['languages'] = meta.get('languages') or []

    # Nested technician_profile object for complete compatibility
    data['technician_profile'] = {
        'bio': tech_profile.bio or "",
        'about': tech_profile.bio or "",
        'headline': headline,
        'experience_years': experience_years,
        'emergency_contact_name': emergency_name,
        'emergency_contact_phone': emergency_phone,
        'city': city,
        'country': user.country or "",
        'hourly_rate': hourly_rate_str,
        'daily_rate': daily_rate,
        'starting_price': starting_price,
        'inspection_fee': inspection_fee,
        'is_negotiable': is_neg,
        'pricing': pricing,
        'availability': tech_profile.availability_status,
        'availability_status': tech_profile.availability_status,
        'available_now': tech_profile.availability_status == 'available',
        'response_time': tech_profile.response_time or "",
        'completed_jobs': tech_profile.completed_jobs,
        'average_rating': str(tech_profile.average_rating),
        'background_check_status': tech_profile.background_check_status,
        'is_verified': tech_profile.is_verified or user.is_verified,
        'skills': data['skills'],
        'tools': tools_list,
        'portfolio': data['portfolio'],
        'payout': payout,
        'kyc': kyc,
    }

    return data


@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def me(request):
    if request.method == 'GET':
        return Response(build_user_me_payload(request.user))

    elif request.method == 'PATCH':
        # Reject unknown fields with HTTP 400
        unknown_fields = [k for k in request.data.keys() if k not in KNOWN_PROFILE_FIELDS]
        if unknown_fields:
            return Response(
                {field: ["Unknown field."] for field in unknown_fields},
                status=status.HTTP_400_BAD_REQUEST
            )

        role_to_set = request.data.get('role')
        if role_to_set and str(role_to_set).upper() in ['CLIENT', 'TECHNICIAN', 'COMPANY']:
            new_role = str(role_to_set).upper()
            request.user.role = new_role
            request.user.save(update_fields=['role'])

        user_update_data = {}
        for k in ['first_name', 'last_name', 'phone', 'avatar_url', 'banner_url', 'language_preference', 'country', 'address', 'education_level', 'expertise_level']:
            if k in request.data:
                user_update_data[k] = request.data[k]

        if 'city' in request.data:
            city_val = request.data.get('city')
            if city_val is not None:
                user_update_data['address'] = str(city_val)

        if 'date_of_birth' in request.data:
            dob = request.data.get('date_of_birth')
            user_update_data['date_of_birth'] = dob if dob else None

        serializer = UserMeSerializer(request.user, data=user_update_data, partial=True)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        serializer.save()

        # Update TechnicianProfile
        from apps.accounts.models import TechnicianProfile
        tech_profile, _ = TechnicianProfile.objects.get_or_create(user=request.user)
        tech_data = request.data.get('technician_profile') or {}

        def get_field(key, default=None):
            if key in request.data:
                return request.data[key]
            if isinstance(tech_data, dict) and key in tech_data:
                return tech_data[key]
            return default

        # Maintain metadata dictionary in tech_profile.languages
        meta = tech_profile.languages if isinstance(tech_profile.languages, dict) else {}
        if isinstance(tech_profile.languages, list) and tech_profile.languages:
            meta['tools'] = tech_profile.languages

        bio = get_field('bio', get_field('about'))
        if bio is not None:
            tech_profile.bio = str(bio)
            meta['bio'] = str(bio)

        headline = get_field('headline')
        if headline is not None:
            meta['headline'] = str(headline)

        experience_years = get_field('experience_years')
        if experience_years is not None:
            meta['experience_years'] = str(experience_years)

        em_name = get_field('emergency_contact_name')
        if em_name is not None:
            meta['emergency_contact_name'] = str(em_name)

        em_phone = get_field('emergency_contact_phone')
        if em_phone is not None:
            meta['emergency_contact_phone'] = str(em_phone)

        city = get_field('city')
        if city is not None:
            meta['city'] = str(city)

        hr_val = get_field('hourly_rate')
        if hr_val is not None:
            if hr_val:
                clean_hr = ''.join(c for c in str(hr_val) if c.isdigit() or c == '.')
                tech_profile.hourly_rate = float(clean_hr) if clean_hr else None
            else:
                tech_profile.hourly_rate = None

        daily_rate = get_field('daily_rate')
        if daily_rate is not None:
            meta['daily_rate'] = str(daily_rate)

        starting_price = get_field('starting_price')
        if starting_price is not None:
            meta['starting_price'] = str(starting_price)

        inspection_fee = get_field('inspection_fee')
        if inspection_fee is not None:
            meta['inspection_fee'] = str(inspection_fee)

        is_negotiable = get_field('is_negotiable')
        if is_negotiable is not None:
            meta['is_negotiable'] = bool(is_negotiable)

        pricing = get_field('pricing')
        if isinstance(pricing, dict):
            meta['pricing'] = pricing
            if 'hourly_rate' in pricing:
                clean_p_hr = ''.join(c for c in str(pricing['hourly_rate']) if c.isdigit() or c == '.')
                tech_profile.hourly_rate = float(clean_p_hr) if clean_p_hr else None
            if 'daily_rate' in pricing:
                meta['daily_rate'] = str(pricing['daily_rate'])
            if 'starting_price' in pricing:
                meta['starting_price'] = str(pricing['starting_price'])
            if 'inspection_fee' in pricing:
                meta['inspection_fee'] = str(pricing['inspection_fee'])
            if 'is_negotiable' in pricing:
                meta['is_negotiable'] = bool(pricing['is_negotiable'])

        resp_time = get_field('response_time')
        if resp_time is not None:
            tech_profile.response_time = str(resp_time)

        availability = get_field('availability', get_field('availability_status'))
        if availability is not None:
            tech_profile.availability_status = str(availability)
        elif get_field('available_now') is not None:
            tech_profile.availability_status = 'available' if get_field('available_now') else 'offline'

        bg_status = get_field('background_check_status')
        if bg_status is not None:
            tech_profile.background_check_status = str(bg_status)

        payout = get_field('payout', get_field('payout_info'))
        if payout is not None and isinstance(payout, dict):
            meta['payout'] = payout

        kyc = get_field('kyc', get_field('kyc_info'))
        if kyc is not None and isinstance(kyc, dict):
            meta['kyc'] = kyc

        tools = get_field('tools')
        if tools is not None and isinstance(tools, list):
            meta['tools'] = tools

        languages = get_field('languages')
        if languages is not None and isinstance(languages, list):
            meta['languages'] = languages

        portfolio = get_field('portfolio')
        if portfolio is not None and isinstance(portfolio, list):
            tech_profile.portfolio = portfolio

        skills = get_field('skills')
        if skills is not None and isinstance(skills, list):
            from apps.tasks.models import Skill
            from django.utils.text import slugify
            tech_profile.skills.clear()
            for item in skills:
                s_name = item.get('name') if isinstance(item, dict) else (str(item) if item else "")
                if s_name and s_name.strip():
                    clean_name = s_name.strip()
                    clean_slug = slugify(clean_name) or clean_name.lower()
                    skill_obj = Skill.objects.filter(name=clean_name).first()
                    if not skill_obj:
                        skill_obj = Skill.objects.filter(slug=clean_slug).first()
                    if not skill_obj:
                        skill_obj = Skill.objects.create(name=clean_name, slug=clean_slug)
                    tech_profile.skills.add(skill_obj)

        tech_profile.languages = meta
        tech_profile.save()

        return Response(build_user_me_payload(request.user))


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def switch_role(request):
    new_role = str(request.data.get('role', '')).upper()
    if new_role not in ['CLIENT', 'TECHNICIAN', 'COMPANY']:
        return Response({"error": "Invalid role. Choose CLIENT, TECHNICIAN, or COMPANY."}, status=status.HTTP_400_BAD_REQUEST)
    user = request.user
    user.role = new_role
    user.save(update_fields=['role'])
    if new_role == 'TECHNICIAN':
        from apps.accounts.models import TechnicianProfile
        TechnicianProfile.objects.get_or_create(user=user)
    elif new_role == 'COMPANY':
        from apps.companies.models import CompanyProfile
        CompanyProfile.objects.get_or_create(user=user, defaults={'company_name': user.get_full_name() or user.username})
    return Response({"message": f"Role updated to {new_role}", "role": new_role})


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_account(request):
    user = request.user
    if user.is_staff or user.is_superuser:
        return Response(
            {'error': 'Staff accounts cannot be deleted here.'},
            status=status.HTTP_403_FORBIDDEN
        )
    create_audit_log(
        actor=user,
        action="USER_DELETED_ACCOUNT",
        entity_type="User",
        entity_id=user.id,
        summary=f"User {user.email} permanently deleted their account",
        metadata={"email": user.email, "role": user.role},
        ip_address=request.META.get('REMOTE_ADDR'),
    )
    user.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
@permission_classes([AllowAny])
def list_users(request):
    from django.contrib.auth import get_user_model
    User = get_user_model()
    role = request.query_params.get('role', '').upper()
    limit = int(request.query_params.get('limit', '12'))
    show_all = request.query_params.get('all_status') == 'true'
    qs = User.objects.filter(is_active=True)
    if not show_all:
        qs = qs.filter(is_verified=True)
    if role in ('TECHNICIAN', 'CLIENT', 'COMPANY', 'ADMIN'):
        qs = qs.filter(role=role)
    qs = qs.order_by('-created_at')[:max(1, min(limit, 50))]

    from .serializers import UserPublicSerializer
    data = []
    for user in qs:
        item = UserPublicSerializer(user).data
        if user.role == 'TECHNICIAN':
            profile = getattr(user, 'technician_profile', None)
            if profile:
                item['bio'] = profile.bio
    role = request.query_params.get('role')
    users = User.objects.filter(is_active=True).exclude(role='ADMIN').order_by('-id')
    if role:
        users = users.filter(role=role.upper())

    from .serializers import UserPublicSerializer
    serializer = UserPublicSerializer(users, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def user_public_profile(request, user_id):
    from django.contrib.auth import get_user_model
    User = get_user_model()
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        from apps.companies.models import CompanyProfile
        try:
            comp = CompanyProfile.objects.get(id=user_id)
            user = comp.user
        except CompanyProfile.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    from .serializers import UserPublicSerializer
    serializer = UserPublicSerializer(user)
    data = serializer.data

    if user.role == 'TECHNICIAN':
        from apps.accounts.models import TechnicianProfile, PortfolioItem
        profile, _ = TechnicianProfile.objects.get_or_create(user=user)

        # Extract tools & pricing
        tools_list = []
        pricing_data = {}
        if isinstance(profile.languages, dict):
            tools_list = profile.languages.get('tools', [])
            pricing_data = profile.languages.get('pricing', {})
        elif isinstance(profile.languages, list):
            tools_list = profile.languages

        # Format hourly rate
        if profile.hourly_rate:
            hourly_num = float(profile.hourly_rate)
            formatted_hourly = f"{int(hourly_num):,} XOF / hr" if hourly_num.is_integer() else f"{hourly_num:,.2f} XOF / hr"
            computed_daily = f"{int(hourly_num * 7):,} XOF / day" if hourly_num.is_integer() else f"{(hourly_num * 7):,.2f} XOF / day"
        else:
            formatted_hourly = ""
            computed_daily = ""

        custom_daily = pricing_data.get('daily_rate')
        custom_insp = pricing_data.get('inspection_fee')
        custom_start = pricing_data.get('starting_price')

        data['hourly_rate'] = formatted_hourly or "Negotiable / Quote on Request"
        data['daily_rate'] = custom_daily or computed_daily or "Negotiable Daily Rate"
        data['inspection_fee'] = custom_insp or "Contact for Inspection"
        data['starting_price'] = custom_start or "On Request"

        data['bio'] = profile.bio or ''
        data['about'] = profile.bio or ''
        data['skills'] = [s.name for s in profile.skills.all()]
        data['tools'] = tools_list
        data['languages'] = ['French', 'English']
        data['completed_jobs'] = profile.completed_jobs
        data['average_rating'] = str(profile.average_rating)
        data['availability_status'] = profile.availability_status
        data['response_time'] = profile.response_time or 'Within 2 hours'

        if profile.portfolio and isinstance(profile.portfolio, list) and len(profile.portfolio) > 0:
            data['portfolio'] = profile.portfolio
        else:
            portfolio_qs = PortfolioItem.objects.filter(user=user)
            if portfolio_qs.exists():
                from .serializers import PortfolioItemSerializer
                data['portfolio'] = PortfolioItemSerializer(portfolio_qs, many=True).data
            else:
                data['portfolio'] = []
    elif user.role == 'COMPANY':
        company = getattr(user, 'company_profile', None)
        if company:
            data['company_id'] = company.id
            data['company_name'] = company.company_name
            data['registration_number'] = company.registration_number
            data['services_offered'] = company.services_offered
            data['company_size'] = company.company_size
            data['logo_url'] = company.logo_url
            data['cover_url'] = company.cover_url
            data['about'] = company.about
            data['website'] = company.website
            data['headquarters'] = company.headquarters
            data['business_hours'] = company.business_hours
            data['average_rating'] = str(company.average_rating)
            data['review_count'] = company.review_count
            data['team_size'] = company.team_size
            data['completed_tasks'] = company.completed_tasks
            data['response_time'] = company.response_time

    return Response(data)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def portfolio_items(request):
    if request.method == 'GET':
        items = PortfolioItem.objects.filter(user=request.user)
        serializer = PortfolioItemSerializer(items, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = PortfolioItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def portfolio_item_detail(request, item_id):
    try:
        item = PortfolioItem.objects.get(id=item_id, user=request.user)
    except PortfolioItem.DoesNotExist:
        return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)
    item.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def saved_professionals(request):
    if request.method == 'GET':
        saved = SavedProfessional.objects.filter(user=request.user).select_related('professional')
        serializer = SavedProfessionalSerializer(saved, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        professional_id = request.data.get('professional_id')
        if not professional_id:
            return Response({"error": "professional_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        from django.contrib.auth import get_user_model
        User = get_user_model()
        try:
            professional = User.objects.get(id=professional_id, role__in=['TECHNICIAN', 'COMPANY'])
        except User.DoesNotExist:
            return Response({"error": "Professional not found"}, status=status.HTTP_404_NOT_FOUND)
        saved, created = SavedProfessional.objects.get_or_create(user=request.user, professional=professional)
        if not created:
            return Response({"message": "Already saved"}, status=status.HTTP_200_OK)
        return Response({"message": "Saved successfully"}, status=status.HTTP_201_CREATED)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def saved_professional_detail(request, professional_id):
    from django.contrib.auth import get_user_model
    User = get_user_model()
    try:
        professional = User.objects.get(id=professional_id)
    except User.DoesNotExist:
        return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)
    deleted, _ = SavedProfessional.objects.filter(user=request.user, professional=professional).delete()
    if deleted:
        return Response(status=status.HTTP_204_NO_CONTENT)
    return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def technician_services(request):
    if request.user.role != "TECHNICIAN":
        return Response({"error": "Technician only"}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'GET':
        items = TechnicianService.objects.filter(technician=request.user).select_related('category')
        serializer = TechnicianServiceSerializer(items, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        if not request.user.is_verified and getattr(request.user, 'role', '') != 'ADMIN':
            return Response({"error": "Your technician account is pending Admin verification. You can post services once approved by Admin."}, status=status.HTTP_403_FORBIDDEN)

        serializer = TechnicianServiceSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        service = serializer.save(technician=request.user)
        create_audit_log(
            actor=request.user,
            action="technician_service_created",
            entity_type="technician_service",
            entity_id=service.id,
            summary=service.title,
            metadata={"service_type": service.service_type, "pricing_model": service.pricing_model},
            ip_address=request.META.get("REMOTE_ADDR"),
        )
        return Response(TechnicianServiceSerializer(service).data, status=status.HTTP_201_CREATED)



@api_view(['GET', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def technician_service_detail(request, service_id):
    if request.user.role != "TECHNICIAN":
        return Response({"error": "Technician only"}, status=status.HTTP_403_FORBIDDEN)
    try:
        service = TechnicianService.objects.select_related('category').get(id=service_id, technician=request.user)
    except TechnicianService.DoesNotExist:
        return Response({"error": "Service not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        return Response(TechnicianServiceSerializer(service).data)

    if request.method == 'DELETE':
        service.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    serializer = TechnicianServiceSerializer(service, data=request.data, partial=True)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    service = serializer.save()
    create_audit_log(
        actor=request.user,
        action="technician_service_updated",
        entity_type="technician_service",
        entity_id=service.id,
        summary=service.title,
        metadata={"service_type": service.service_type, "pricing_model": service.pricing_model},
        ip_address=request.META.get("REMOTE_ADDR"),
    )
    return Response(TechnicianServiceSerializer(service).data)


def _require_admin(request):
    if not request.user.is_authenticated:
        return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)
    role = str(getattr(request.user, 'role', '')).upper()
    if role != 'ADMIN' and not getattr(request.user, 'is_staff', False) and not getattr(request.user, 'is_superuser', False):
        return Response({"error": "Admin only"}, status=status.HTTP_403_FORBIDDEN)
    return None


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def admin_verify_user(request, user_id):
    err = _require_admin(request)
    if err: return err
    from django.contrib.auth import get_user_model
    User = get_user_model()
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    user.is_verified = True
    user.save(update_fields=['is_verified'])
    user.technician_documents.all().update(is_verified=True)
    if hasattr(user, 'technician_profile'):
        user.technician_profile.is_verified = True
        user.technician_profile.save(update_fields=['is_verified'])
    if hasattr(user, 'company_profile'):
        user.company_profile.is_verified = True
        user.company_profile.save(update_fields=['is_verified'])
    create_audit_log(
        actor=request.user,
        action="user_verified",
        entity_type="user",
        entity_id=user.id,
        summary=user.email,
        metadata={"verified": True},
        ip_address=request.META.get("REMOTE_ADDR"),
    )
    create_notification(
        user=user,
        category="verification",
        title="Account verified",
        body="Your account and credentials have been verified by the admin team.",
        link="/dashboard/client",
        metadata={"user_id": user.id},
    )
    return Response({"message": f"{user.email} verified", "is_verified": True})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def admin_suspend_user(request, user_id):
    err = _require_admin(request)
    if err: return err
    from django.contrib.auth import get_user_model
    User = get_user_model()
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    action = request.data.get('action', 'suspend')
    if action == 'unsuspend':
        user.is_active = True
        user.save(update_fields=['is_active'])
        create_audit_log(
            actor=request.user,
            action="user_unsuspended",
            entity_type="user",
            entity_id=user.id,
            summary=user.email,
            metadata={"is_active": True},
            ip_address=request.META.get("REMOTE_ADDR"),
        )
        create_notification(
            user=user,
            category="system",
            title="Account reactivated",
            body="Your account has been reactivated.",
            link="/login",
            metadata={"user_id": user.id},
        )
        return Response({"message": f"{user.email} reactivated", "is_active": True})
    user.is_active = False
    user.save(update_fields=['is_active'])
    create_audit_log(
        actor=request.user,
        action="user_suspended",
        entity_type="user",
        entity_id=user.id,
        summary=user.email,
        metadata={"is_active": False},
        ip_address=request.META.get("REMOTE_ADDR"),
    )
    create_notification(
        user=user,
        category="system",
        title="Account suspended",
        body="Your account has been suspended by the admin team.",
        link="/login",
        metadata={"user_id": user.id},
    )
    return Response({"message": f"{user.email} suspended", "is_active": False})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_list_users(request):
    err = _require_admin(request)
    if err: return err
    from django.contrib.auth import get_user_model
    User = get_user_model()
    qs = User.objects.all().prefetch_related('technician_documents', 'technician_profile', 'company_profile').order_by('-created_at')
    role = request.query_params.get('role', '').strip()
    if role and role.upper() in ('TECHNICIAN', 'CLIENT', 'COMPANY', 'ADMIN'):
        qs = qs.filter(role__iexact=role)
    verified = request.query_params.get('verified')
    if verified == 'true':
        qs = qs.filter(is_verified=True)
    elif verified == 'false':
        qs = qs.filter(is_verified=False)
    data = []
    for u in qs:
        docs = []
        for doc in u.technician_documents.all():
            docs.append({
                'id': doc.id,
                'title': doc.title,
                'document_type': doc.document_type,
                'file_url': doc.file_url,
                'is_verified': doc.is_verified,
                'created_at': doc.created_at,
            })
        
        tech_profile = getattr(u, 'technician_profile', None)
        comp_profile = getattr(u, 'company_profile', None)

        data.append({
            'id': u.id,
            'email': u.email,
            'username': u.username,
            'phone': u.phone,
            'country': u.country,
            'first_name': u.first_name,
            'last_name': u.last_name,
            'role': str(getattr(u, 'role', 'CLIENT')).upper(),
            'created_at': str(getattr(u, 'created_at', getattr(u, 'date_joined', ''))),
            'is_active': u.is_active,
            'is_verified': u.is_verified,
            'avatar_url': u.avatar_url,
            'documents': docs,
            'title': getattr(tech_profile, 'response_time', '') if tech_profile else (getattr(comp_profile, 'company_name', '') if comp_profile else ''),
            'bio': getattr(tech_profile, 'bio', '') if tech_profile else (getattr(comp_profile, 'about', '') if comp_profile else ''),
        })
    return Response(data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_list_tasks(request):
    err = _require_admin(request)
    if err: return err
    from apps.tasks.models import Task
    from apps.tasks.serializers import TaskListSerializer
    qs = Task.objects.select_related('client', 'category').order_by('-created_at')
    status_filter = request.query_params.get('status')
    if status_filter:
        qs = qs.filter(status=status_filter)
    return Response(TaskListSerializer(qs, many=True).data)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def technician_documents(request):
    if request.method == 'GET':
        items = TechnicianDocument.objects.filter(user=request.user)
        serializer = TechnicianDocumentSerializer(items, many=True)
        return Response(serializer.data)

    serializer = TechnicianDocumentSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    doc = serializer.save(user=request.user)
    create_audit_log(
        actor=request.user,
        action="technician_document_uploaded",
        entity_type="technician_document",
        entity_id=doc.id,
        summary=doc.title,
        metadata={"document_type": doc.document_type},
        ip_address=request.META.get("REMOTE_ADDR"),
    )
    return Response(TechnicianDocumentSerializer(doc).data, status=status.HTTP_201_CREATED)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def technician_document_detail(request, document_id):
    try:
        doc = TechnicianDocument.objects.get(id=document_id, user=request.user)
    except TechnicianDocument.DoesNotExist:
        return Response({"error": "Document not found"}, status=status.HTTP_404_NOT_FOUND)

    doc.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    current_password = request.data.get('current_password')
    new_password = request.data.get('new_password')
    
    if not current_password or not new_password:
        return Response({'detail': 'current_password and new_password are required.'}, status=status.HTTP_400_BAD_REQUEST)
        
    user = request.user
    if not user.check_password(current_password):
        return Response({'detail': 'Current password is incorrect.'}, status=status.HTTP_400_BAD_REQUEST)
        
    user.set_password(new_password)
    user.save()
    
    return Response({'detail': 'Password updated successfully.'})


@api_view(['POST'])
@permission_classes([AllowAny])
def admin_clear_test_users(request):
    secret = request.data.get('secret') or request.query_params.get('secret')
    is_admin = request.user and request.user.is_authenticated and (getattr(request.user, 'is_staff', False) or getattr(request.user, 'role', '') == 'ADMIN')
    
    if not is_admin and secret != 'clear_boulotman_test_users_2026':
        return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
    
    from django.contrib.auth import get_user_model
    User = get_user_model()
    users_to_delete = User.objects.filter(is_staff=False, is_superuser=False).exclude(role='ADMIN').exclude(email='admin@boulotman.com')
    count = users_to_delete.count()
    users_to_delete.delete()
    return Response({
        'message': f'Successfully deleted {count} test users (clients, technicians, companies). Admin accounts preserved.',
        'deleted_count': count
    })
