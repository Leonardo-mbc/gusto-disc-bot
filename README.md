# gusto-disc-bot
- Discord 専用
- `はじめる` をしてから時間で通話を切る bot

# build & run
#### local 用
- npm i
- npm start

#### local (deamon用)
- npm i
- npx pm2 start pm2.config.json  

#### Docker 用
- docker build . -t gusto-disc-bot
- docker run -P -d gusto-disc-bot  
