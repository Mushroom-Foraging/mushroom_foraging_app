FROM nginx:1.25-alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY docker/nginx/nginx.conf /etc/nginx/conf.d

COPY docker/nginx/renew_certificates.sh /bin/renew_certificates.sh

COPY static /usr/src/app/static

RUN apk add certbot certbot-nginx

ENTRYPOINT [ "/bin/renew_certificates.sh" ]