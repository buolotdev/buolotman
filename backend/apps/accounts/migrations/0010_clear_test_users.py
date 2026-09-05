from django.db import migrations


def clear_test_users(apps, schema_editor):
    # SAFELY DISABLED: Do not delete accounts during migration on production
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0009_alter_techniciandocument_file_url'),
    ]

    operations = [
        migrations.RunPython(clear_test_users, reverse_code=migrations.RunPython.noop),
    ]