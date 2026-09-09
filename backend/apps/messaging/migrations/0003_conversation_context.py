from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('messaging', '0002_message_attachment_content_type_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='conversation',
            name='context_type',
            field=models.CharField(blank=True, default='', max_length=30),
        ),
        migrations.AddField(
            model_name='conversation',
            name='context_id',
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
    ]
