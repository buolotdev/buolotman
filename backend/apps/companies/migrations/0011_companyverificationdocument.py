# Generated manually for company verification document storage.
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ('companies', '0010_alter_companyprofile_cover_url_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='CompanyVerificationDocument',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('document_type', models.CharField(max_length=100)),
                ('file_url', models.URLField(max_length=500)),
                ('storage_key', models.CharField(blank=True, max_length=500)),
                ('file_name', models.CharField(max_length=255)),
                ('file_size', models.PositiveIntegerField(default=0)),
                ('content_type', models.CharField(blank=True, max_length=100)),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('approved', 'Approved'), ('rejected', 'Rejected')], default='pending', max_length=20)),
                ('admin_feedback', models.TextField(blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('company', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='verification_documents', to='companies.companyprofile')),
            ],
            options={
                'db_table': 'companies_verification_document',
                'ordering': ['-created_at'],
            },
        ),
    ]
