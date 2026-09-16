#!/bin/bash
mkdir -p /var/app/media
chmod -R 777 /var/app/media

if [ -f "/var/app/current/db.sqlite3" ] && [ ! -f "/var/app/media/db.sqlite3" ]; then
    cp /var/app/current/db.sqlite3 /var/app/media/db.sqlite3
fi

if [ -f "/var/app/media/db.sqlite3" ]; then
    chmod 666 /var/app/media/db.sqlite3
fi

if [ -d "/var/app/current/media" ] && [ ! -L "/var/app/current/media" ]; then
    cp -rn /var/app/current/media/* /var/app/media/ 2>/dev/null || true
    rm -rf /var/app/current/media
fi

ln -sfn /var/app/media /var/app/current/media
chmod -R 777 /var/app/media
