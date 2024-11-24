FROM nginx:1.26

COPY ./frontend /var/www/

COPY ./conf/ /etc/nginx/conf.d/

CMD [ "nginx", "-g", "daemon off;"]