FROM alpine:latest
WORKDIR /app/

RUN apk --no-cache add curl
RUN apk --no-cache add nodejs
RUN apk --no-cache add nginx
RUN apk --no-cache add supervisor

COPY . /app/

RUN curl -L https://unpkg.com/@pnpm/self-installer | node

RUN pnpm install
RUN pnpm run build
RUN cat /app/nginx.conf > /etc/nginx/nginx.conf

EXPOSE 80

CMD ["supervisord", "-c", "/app/supervisord.conf"]
