#!/bin/bash
# Set write permissions for webapp user on application directory and sqlite database
touch /var/app/current/db.sqlite3
chmod 777 /var/app/current/
chmod 666 /var/app/current/db.sqlite3
chown -R webapp:webapp /var/app/current/

# Run database migrations
source /var/app/venv/*/bin/activate
python /var/app/current/manage.py migrate --noinput || true

# Re-ensure permissions after migration creates any tables/indexes
chmod 777 /var/app/current/
chmod 666 /var/app/current/db.sqlite3
chown -R webapp:webapp /var/app/current/
