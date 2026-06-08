from django.urls import path

from . import views

urlpatterns = [
    path("notifications/", views.notifications, name="notifications"),
    path("notifications/<int:notification_id>/read/", views.mark_notification_read, name="mark_notification_read"),
    path("disputes/", views.disputes, name="disputes"),
    path("disputes/create/", views.dispute_create, name="dispute_create"),
    path("disputes/<int:dispute_id>/", views.dispute_detail, name="dispute_detail"),
    path("disputes/<int:dispute_id>/evidence/", views.dispute_evidence, name="dispute_evidence"),
    path("audit-logs/", views.audit_logs, name="audit_logs"),
    path("platform-settings/", views.platform_settings, name="platform_settings"),
]
