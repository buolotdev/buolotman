from django.urls import path
from . import views

urlpatterns = [
    path('', views.list_companies, name='list_companies'),
    path('profile/', views.company_profile, name='company_profile'),
    path('projects/', views.company_projects_list_create, name='company_projects'),
    path('certifications/', views.company_certifications_list_create, name='company_certifications'),
    path('services/', views.company_services, name='company_services'),
    path('services/<int:service_id>/', views.delete_company_service, name='delete_company_service'),
    path('projects/<int:project_id>/', views.company_project_detail, name='company_project_detail'),
    path('team/', views.company_team, name='company_team'),
    path('team/<int:member_id>/', views.company_team_detail, name='company_team_detail'),
    path('verification-documents/', views.company_verification_documents, name='company_verification_documents'),
    path('verification-documents/<int:document_id>/', views.delete_company_verification_document, name='delete_company_verification_document'),
    path('<int:company_id>/', views.company_public_profile, name='company_public_profile'),
    path('<int:company_id>/reviews/', views.add_company_review, name='add_company_review'),
    path('<int:company_id>/quotes/', views.submit_company_quote, name='submit_company_quote'),
    path('quotes/', views.company_quotes, name='company_quotes'),
    path('quotes/<int:quote_id>/', views.update_company_quote, name='update_company_quote'),
    path('activities/', views.company_activities, name='company_activities'),
]
