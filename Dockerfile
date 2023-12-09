FROM alpine:latest
WORKDIR /app/

RUN apk --no-cache nodejs=18.16.0
RUN apk --no-cache add curl
RUN apk --no-cache add nginx
RUN apk --no-cache add supervisor

RUN curl -L https://unpkg.com/@pnpm/self-installer | node

COPY . /app/

RUN pnpm install
RUN pnpm run build
RUN cat /app/nginx.conf > /etc/nginx/nginx.conf

EXPOSE 80

CMD ["supervisord", "-c", "/app/supervisord.conf"]
