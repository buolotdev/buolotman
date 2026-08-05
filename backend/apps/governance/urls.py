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
    path("platform-stats/", views.platform_stats, name="platform_stats"),
    path("platform-settings/", views.platform_settings_list, name="platform_settings_list"),
    path("admin-dashboard-stats/", views.admin_dashboard_stats, name="admin_dashboard_stats"),
    path("admin-projects-monitoring/", views.admin_projects_monitoring, name="admin_projects_monitoring"),
    path("admin-projects-monitoring/<int:task_id>/release/", views.admin_project_release, name="admin_project_release"),
    path("admin-projects-monitoring/<int:task_id>/hold/", views.admin_project_hold, name="admin_project_hold"),
    path("admin-support/", views.admin_support_tickets, name="admin_support_tickets"),
    path("admin-support/<int:ticket_id>/reply/", views.admin_support_ticket_reply, name="admin_support_ticket_reply"),
    path("admin-reviews/", views.admin_reviews, name="admin_reviews"),
    path("admin-reviews/<int:review_id>/publish/", views.admin_review_publish, name="admin_review_publish"),
    path("admin-reviews/<int:review_id>/hide/", views.admin_review_hide, name="admin_review_hide"),
    path("admin-reviews/<int:review_id>/delete/", views.admin_review_delete, name="admin_review_delete"),
    path("pages/", views.cms_pages, name="cms_pages"),
    path("pages/<int:page_id>/", views.cms_page_detail, name="cms_page_detail"),
    path("public-pages/", views.public_cms_pages, name="public_cms_pages"),
    path("public-pages/<slug:slug>/", views.public_cms_page_detail, name="public_cms_page_detail"),
]
