from .base import *

DEBUG = False
raw_hosts = config('ALLOWED_HOSTS', default='*')
if '*' in raw_hosts:
    ALLOWED_HOSTS = ['*']
else:
    ALLOWED_HOSTS = [h.strip() for h in raw_hosts.split(',') if h.strip()]
    for d in ['boulotman.com', '.boulotman.com', '.elasticbeanstalk.com', 'localhost', '127.0.0.1']:
        if d not in ALLOWED_HOSTS:
            ALLOWED_HOSTS.append(d)

import dj_database_url
DATABASE_URL = config('DATABASE_URL', default='')
if not DATABASE_URL:
    import platform
    if platform.system() == 'Linux':
        import shutil
        import os
        db_path = Path('/tmp/boulotman.sqlite3')
        orig_db = BASE_DIR / 'db.sqlite3'
        if not db_path.exists() and orig_db.exists():
            try:
                shutil.copyfile(orig_db, db_path)
            except Exception:
                pass
        try:
            if db_path.exists():
                os.chmod(db_path, 0o666)
        except Exception:
            pass
        DATABASE_URL = f"sqlite:///{db_path}"
    else:
        DATABASE_URL = f"sqlite:///{BASE_DIR / 'db.sqlite3'}"
    
ssl_require = DATABASE_URL.startswith('postgres')
DATABASES = {
    'default': dj_database_url.config(
        default=DATABASE_URL,
        conn_max_age=600,
        ssl_require=ssl_require,
    )
}


# Security
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
X_FRAME_OPTIONS = 'DENY'

CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

MIDDLEWARE.insert(1, 'whitenoise.middleware.WhiteNoiseMiddleware')

# Logging
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'simple': {
            'format': '[{asctime}] {levelname} {name}: {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'simple',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': config('LOG_LEVEL', default='INFO'),
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': config('DJANGO_LOG_LEVEL', default='INFO'),
            'propagate': False,
        },
    },
}
