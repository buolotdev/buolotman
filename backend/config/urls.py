from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from django.http import HttpResponse

urlpatterns = [
    path('', lambda request: HttpResponse('OK', status=200)),
    path('admin/', admin.site.urls),
    path('api/auth/', include('apps.accounts.urls')),
    path('api/tasks/', include('apps.tasks.urls')),
    path('api/wallet/', include('apps.wallet.urls')),
    path('api/', include('apps.messaging.urls')),
    path('api/company/', include('apps.companies.urls')),
    path('api/search/', include('apps.search.urls')),
    path('api/uploads/', include('apps.uploads.urls')),
    path('api/governance/', include('apps.governance.urls')),
]

from django.urls import re_path
from django.views.static import serve

urlpatterns += [
    re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
]
