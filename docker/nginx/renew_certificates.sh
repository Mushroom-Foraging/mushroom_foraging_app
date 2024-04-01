#!/bin/sh
env >> /etc/environment
echo "25 22 * * * certbot renew" | crontab -
/usr/sbin/crond -d 0