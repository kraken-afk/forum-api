ARG NODE_VERSION=18.16.0
FROM node:${NODE_VERSION}-alpine AS node

FROM alpine:latest
WORKDIR /app/

COPY --from=node /usr/lib /usr/lib
COPY --from=node /usr/local/lib /usr/local/lib
COPY --from=node /usr/local/include /usr/local/include
COPY --from=node /usr/local/bin /usr/local/bin

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
