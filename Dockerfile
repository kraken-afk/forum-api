FROM alpine:latest
WORKDIR /app/

RUN apk-update
RUN apk --no-cache add nodejs
RUN apk --no-cache add nginx

COPY . /app/

RUN npm run build

RUN cat /app/nginx.conf > /etc/nginx/nginx.conf

EXPOSE 5000:80

CMD ["npm", "run", "start"]
