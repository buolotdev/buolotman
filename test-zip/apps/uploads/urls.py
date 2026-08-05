from django.urls import path
from . import views

urlpatterns = [
    path("avatar/", views.upload_avatar, name="upload_avatar"),
    path("banner/", views.upload_banner, name="upload_banner"),
    path("portfolio/", views.upload_portfolio_image, name="upload_portfolio_image"),
    path("company_service/", views.upload_company_service_image, name="upload_company_service_image"),
    path("document/", views.upload_technician_document, name="upload_technician_document"),
    path("service_media/", views.upload_service_media, name="upload_service_media"),
    path("task/<int:task_id>/", views.upload_task_attachment, name="upload_task_attachment"),
    path("delete/<path:key>/", views.delete_upload, name="delete_upload"),
]
