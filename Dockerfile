FROM mhart/alpine-node:latest

WORKDIR /usr/src/app

RUN apk --update add tzdata && \
    cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime && \
    apk del tzdata && \
    rm -rf /var/cache/apk/*

COPY package*.json ./
RUN npm install

COPY . .

CMD ["node_modules/pm2/bin/pm2", "--no-daemon", "start", "pm2.config.json"]