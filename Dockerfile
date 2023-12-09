FROM alpine:latest
WORKDIR /app/

RUN apk --no-cache add curl
RUN apk --no-cache add nodejs npm
RUN apk --no-cache add nginx
RUN apk --no-cache add supervisor

COPY . /app/

RUN npm install
RUN npm run build
RUN cat /app/nginx.conf > /etc/nginx/nginx.conf

EXPOSE 80

CMD ["supervisord", "-c", "/app/supervisord.conf"]
