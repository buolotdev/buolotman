#!/bin/bash
mkdir -p /var/app/media
chmod -R 777 /var/app/media

if [ -d "/var/app/current/media" ] && [ ! -L "/var/app/current/media" ]; then
    cp -rn /var/app/current/media/* /var/app/media/ 2>/dev/null || true
    rm -rf /var/app/current/media
fi

ln -sfn /var/app/media /var/app/current/media
chmod -R 777 /var/app/media
