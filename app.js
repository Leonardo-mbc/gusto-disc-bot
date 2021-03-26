const { Client } = require('discord.js');

const { TOKEN } = require('./constants/secrets');
const { START_NISYU_ICHI, PING } = require('./constants/reactive-words');
const { KICK_FROM_VOICE, PONG } = require('./constants/response-words');
const USERS = require('./constants/users');
const GUILD_DETAILS = require('./constants/guild-details');

const { kickFromVoice, by90mins } = require('./actions/kick');
const { choice } = require('./utilities/choice');
const { include } = require('./utilities/include');

const client = new Client();

client.on('ready', async () => {
  console.log(`${client.user.tag} でログイン`);
});

client.on('message', async (message) => {
  if (!message.author.bot && message.mentions.users.get(USERS.GUSTO_BOT)) {
    switch (true) {
      case include(START_NISYU_ICHI, message.content): {
        const list = client.guilds.cache.get(GUILD_DETAILS.GUILD_ID);
        const { endTime } = by90mins(async () => {
          await kickFromVoice(list);
        });
        await message.channel.send(`${endTime.format('HH時 mm分')} ${choice(KICK_FROM_VOICE)}`);
        break;
      }
      case include(PING, message.content): {
        await message.channel.send(choice(PONG));
        break;
      }
    }
  }
});

client.login(TOKEN);
