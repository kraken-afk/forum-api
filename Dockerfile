FROM alpine:latest
WORKDIR /app/

RUN apk --no-cache add curl
RUN apk --no-cache add nodejs
RUN apk --no-cache add nginx

COPY . /app/

RUN curl -L https://unpkg.com/@pnpm/self-installer | node

RUN pnpm run build
RUN cat /app/nginx.conf > /etc/nginx/nginx.conf

EXPOSE 5000:80

CMD ["pnpm", "run", "start"]
