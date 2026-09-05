import os
from pathlib import Path
from decouple import config
from datetime import timedelta

BASE_DIR = Path(__file__).resolve().parent.parent.parent

SECRET_KEY = config('SECRET_KEY')
GOOGLE_CLIENT_ID = config('GOOGLE_CLIENT_ID', default='1090108678391-00u5aomsoh2gu7rqk2vnfldt9cs4fovq.apps.googleusercontent.com')

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'apps.accounts',
    'apps.tasks',
    'apps.wallet',
    'apps.messaging',
    'apps.companies',
    'apps.search',
    'apps.uploads',
    'apps.governance',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'middleware.security.SecurityHeadersMiddleware',
    'middleware.activity.UpdateLastSeenMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

AUTH_USER_MODEL = 'accounts.User'

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

AUTHENTICATION_BACKENDS = [
    'apps.accounts.backends.EmailBackend',
    'django.contrib.auth.backends.ModelBackend',
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle',
        'rest_framework.throttling.ScopedRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '60/minute',
        'user': '120/minute',
        'auth_login': '10/minute',
        'auth_register': '5/minute',
        'auth_otp': '5/minute',
        'upload': '20/minute',
    },
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=config('JWT_ACCESS_LIFETIME_MINUTES', default=1440, cast=int)),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=config('JWT_REFRESH_LIFETIME_DAYS', default=30, cast=int)),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'AUTH_HEADER_TYPES': ('Bearer',),
}

CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

# Supabase
SUPABASE_URL = config('SUPABASE_URL', default='')
SUPABASE_ANON_KEY = config('SUPABASE_ANON_KEY', default='')
SUPABASE_SERVICE_KEY = config('SUPABASE_SERVICE_KEY', default='')
SUPABASE_STORAGE_BUCKET = config('SUPABASE_STORAGE_BUCKET', default='boulotman')

# Redis (optional - graceful fallback if not configured)
REDIS_URL = config('REDIS_URL', default='')
USE_REDIS = bool(REDIS_URL)

if USE_REDIS:
    CACHES = {
        "default": {
            "BACKEND": "django_redis.cache.RedisCache",
            "LOCATION": REDIS_URL,
            "OPTIONS": {
                "CLIENT_CLASS": "django_redis.client.DefaultClient",
                "IGNORE_EXCEPTIONS": True,
            },
            "KEY_PREFIX": "boulotman",
        }
    }
    SESSION_ENGINE = "django.contrib.sessions.backends.cache"
    SESSION_CACHE_ALIAS = "default"
else:
    CACHES = {
        "default": {
            "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
            "LOCATION": "boulotman-fallback",
        }
    }

# CamPay Mobile Money Integration (Cameroon - MTN & Orange)
CAMPAY_APP_ID = config('CAMPAY_APP_ID', default='3NL5dZ_iZtSJ7B6z8ODFA1LP1fQFFMNMWagZwo_MFkoQSRy48yHfLk-NhbxBN-U6_UDyMoY5HqrQ8WObjds3wA')
CAMPAY_APP_USERNAME = config('CAMPAY_APP_USERNAME', default='CtuiKDZ0QRU33fJSggCxeNyZ_WA0Z4FM9-dHRr6Ish2iakwHuuFCqaTCXcxR5mkNo2n8IFUgNY0kjCGzKJSIA')
CAMPAY_APP_PASSWORD = config('CAMPAY_APP_PASSWORD', default='bQbpWV8BMzGefmzTdCKXGcrIN1yGU2Q_BmmFvRVGMsEMa9Fl01uD9BEBdo3VsCb6NeZdigcERp3r-2mKQaLw5w')
CAMPAY_PERMANENT_TOKEN = config('CAMPAY_PERMANENT_TOKEN', default='8e733aef0aaed45c53221bd71154ca82cb3fcb89')
CAMPAY_WEBHOOK_KEY = config('CAMPAY_WEBHOOK_KEY', default='ol9ChLkYTSYPthEVCMyxyjPr0zMt3uq2qlteK1-YFGr0gTx6GqOmreQIB6n-43NtVG5HGwsBiJJxlOZqjW7f5A')
CAMPAY_BASE_URL = config('CAMPAY_BASE_URL', default='https://www.campay.net/api')

# Email Configuration (AWS SES SMTP)
EMAIL_BACKEND = config('EMAIL_BACKEND', default='django.core.mail.backends.smtp.EmailBackend')
EMAIL_HOST = config('EMAIL_HOST', default='xi7hknyhkkx8.zevm.mail-manager-smtp.amazonaws.com')
EMAIL_PORT = config('EMAIL_PORT', default=587, cast=int)
EMAIL_USE_TLS = config('EMAIL_USE_TLS', default=True, cast=bool)
EMAIL_HOST_USER = config('EMAIL_HOST_USER', default='inp-vnw2dra2na5ptb64l42mfrni')
EMAIL_HOST_PASSWORD = config('EMAIL_HOST_PASSWORD', default='}^ymy*D@5_M?iTaa7u9P1&Ng2e-HMs%!')
DEFAULT_FROM_EMAIL = config('DEFAULT_FROM_EMAIL', default='BoulotMan <no-reply@boulotman.com>')
SERVER_EMAIL = config('SERVER_EMAIL', default='admin@boulotman.com')


