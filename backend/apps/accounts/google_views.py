from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
from django.contrib.auth import get_user_model
from google.oauth2 import id_token
from google.auth.transport import requests
from utils.rate_limit import AuthLoginThrottle

import requests as python_requests

User = get_user_model()

@api_view(['POST'])
@permission_classes([AllowAny])
@throttle_classes([AuthLoginThrottle])
def google_login(request):
    token = request.data.get('token')
    if not token:
        return Response({'error': 'Token is required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Verify the access token by fetching user info
        response = python_requests.get(f'https://www.googleapis.com/oauth2/v3/userinfo?access_token={token}')
        if not response.ok:
            return Response({'error': 'Invalid or expired Google token'}, status=status.HTTP_400_BAD_REQUEST)

        idinfo = response.json()
        email = idinfo.get('email')
        first_name = idinfo.get('given_name', '')
        last_name = idinfo.get('family_name', '')
        picture = idinfo.get('picture', '')

        if not email:
            return Response({'error': 'Email not provided by Google'}, status=status.HTTP_400_BAD_REQUEST)

        # Get requested role
        explicit_role = request.data.get('role')
        if explicit_role and str(explicit_role).upper() in ['TECHNICIAN', 'COMPANY', 'ADMIN']:
            requested_role = str(explicit_role).upper()
        else:
            requested_role = 'CLIENT'

        # Signup must never reuse or mutate an existing account. Login omits
        # this flag and is allowed to authenticate the existing account.
        is_signup = request.data.get('flow') == 'signup'

        # Login and signup are deliberately separate flows. Login must never
        # provision a new account or silently default it to CLIENT.
        existing_user = User.objects.filter(email__iexact=email).first()
        if not is_signup and existing_user is None:
            return Response(
                {'error': 'No account was found with this Google email. Please sign up first.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        # All newly created accounts start unverified until Admin approval.
        user, created = User.objects.get_or_create(email=email, defaults={
            'first_name': first_name,
            'last_name': last_name,
            'username': email.split('@')[0],
            'role': requested_role,
            'avatar_url': picture,
            'is_verified': False,
        })

        if is_signup and not created:
            return Response(
                {'error': 'An account with this email already exists. Please log in instead.'},
                status=status.HTTP_409_CONFLICT,
            )

        from apps.accounts.models import TechnicianProfile
        if user.role == 'TECHNICIAN':
            TechnicianProfile.objects.get_or_create(user=user)

        if not created:
            updated_fields = []
            # Only update role if an explicit new role was provided in the request (e.g. from signup flow)
            if explicit_role and str(explicit_role).upper() in ['TECHNICIAN', 'COMPANY', 'CLIENT'] and str(user.role).upper() != str(explicit_role).upper():
                user.role = str(explicit_role).upper()
                updated_fields.append('role')
                if user.role == 'TECHNICIAN':
                    TechnicianProfile.objects.get_or_create(user=user)
            if not user.first_name and first_name:
                user.first_name = first_name
                updated_fields.append('first_name')
            if not user.last_name and last_name:
                user.last_name = last_name
                updated_fields.append('last_name')
            if not user.avatar_url and picture:
                user.avatar_url = picture
                updated_fields.append('avatar_url')
            if updated_fields:
                user.save(update_fields=updated_fields)

        # Generate tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'role': user.role,
            'user': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'role': user.role,
                'avatar': user.avatar_url,
            }
        })

    except ValueError:
        return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)