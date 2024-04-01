FROM nginx:1.25-alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY docker/nginx/nginx.conf /etc/nginx/conf.d

COPY static /usr/src/app/static

RUN apk add certbot certbot-nginx

COPY docker/certbot/crontab /var/spool/cron/crontabs/root
COPY docker/certbot/certbot.ash /usr/local/bin/

RUN chmod +x /usr/local/bin/certbot.ash
RUN touch /var/log/container.log

CMD nginx && crond && tail -f /var/log/container.log