FROM nginx:1.25-alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY docker/nginx/nginx.conf /etc/nginx/conf.d

COPY docker/nginx/certbot_renew_script.sh /bin/certbot_renew_script.sh

COPY static /usr/src/app/static

RUN apk add certbot certbot-nginx

RUN /bin/certbot_renew_script.sh