FROM node:lts-alpine

RUN apk add --no-cache wget librsvg msttcorefonts-installer fontconfig && \
    update-ms-fonts && fc-cache -f && mkdir /tmp/downloads /tmp/storage

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN chmod 777 -R /app

EXPOSE 1481
CMD [ "node", "server.js" ]