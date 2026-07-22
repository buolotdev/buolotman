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
        requested_role = request.data.get('role', 'client').lower()
        if requested_role not in ['client', 'technician', 'company', 'admin']:
            requested_role = 'client'

        # Get or create the user
        user, created = User.objects.get_or_create(email=email, defaults={
            'first_name': first_name,
            'last_name': last_name,
            'username': email.split('@')[0],
            'role': requested_role,
            'avatar': picture,
            'is_verified': True, # Google emails are already verified
        })

        if not created and not user.first_name:
            user.first_name = first_name
            user.last_name = last_name
            if not user.avatar:
                user.avatar = picture
            user.save(update_fields=['first_name', 'last_name', 'avatar'])

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
                'avatar': user.avatar,
            }
        })

    except ValueError:
        return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
