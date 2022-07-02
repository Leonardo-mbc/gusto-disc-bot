FROM mhart/alpine-node:latest

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

CMD ["node_modules/pm2/bin/pm2", "--no-daemon", "start", "pm2.config.json"]