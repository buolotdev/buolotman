from django.db import migrations


def clear_test_users(apps, schema_editor):
    User = apps.get_model('accounts', 'User')
    users_to_delete = User.objects.filter(is_staff=False, is_superuser=False).exclude(role='ADMIN').exclude(email='admin@boulotman.com')
    count = users_to_delete.count()
    users_to_delete.delete()
    print(f"Cleared {count} test users (kept admin accounts).")


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0009_alter_techniciandocument_file_url'),
    ]

    operations = [
        migrations.RunPython(clear_test_users, reverse_code=migrations.RunPython.noop),
    ]
