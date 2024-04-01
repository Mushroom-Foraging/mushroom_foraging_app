LETSENCRYPT_CERTDIR=/etc/letsencrypt/live
LOG_FILE=/var/log/container.log

echo "Renewing certificates at $LETSENCRYPT_CERTDIR." >> $LOG_FILE
/usr/bin/certbot renew --quiet >> $LOG_FILE 2>&1