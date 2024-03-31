FROM nginx:1.25-alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY docker/nginx/nginx.conf /etc/nginx/conf.d

COPY static /usr/src/app/static

RUN apk add certbot certbot-nginx

RUN certbot_renew_script.sh