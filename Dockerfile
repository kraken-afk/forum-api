FROM alpine:latest
WORKDIR /app/

RUN apk --no-cache add curl
RUN apk --no-cache add nginx
RUN apk --no-cache add supervisor

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
RUN sudo nvm install 18.12.1
RUN sudo nvm use 18.12.1
RUN curl -L https://unpkg.com/@pnpm/self-installer | node

COPY . /app/

RUN pnpm install
RUN pnpm run build
RUN cat /app/nginx.conf > /etc/nginx/nginx.conf

EXPOSE 80

CMD ["supervisord", "-c", "/app/supervisord.conf"]
