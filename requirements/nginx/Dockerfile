FROM nginx:1.26

RUN apt update && apt install openssl -y

RUN openssl req -x509 -nodes -days 365 \
    -subj "/C=$COUNTRY/ST=$STATE/O=$ORGANIZATION, Inc./CN=$CNAME" \
    -newkey rsa:2048 -keyout /etc/ssl/private/nginx-selfsigned.key \
    -out /etc/ssl/certs/nginx-selfsigned.crt;

COPY ./conf/ /etc/nginx/conf.d/

CMD [ "nginx", "-g", "daemon off;"]