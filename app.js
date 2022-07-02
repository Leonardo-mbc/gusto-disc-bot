const { Client, Intents } = require('discord.js');
const dayjs = require('dayjs');

const { TOKEN } = require('./constants/secrets');
const {
  START_NISYU_ICHI,
  PING,
  CHECK_TIME,
  ADJUSTMENT_MINUTES_WORDS,
  RESTART_NISYU_ICHI,
  ADJUSTMENT_RESTART_WORDS,
} = require('./constants/reactive-words');
const {
  STARTED,
  JUST_STARTED,
  KICK_FROM_VOICE,
  PONG,
  ABOUT_TIME,
  ADD_MINUTES,
  NOT_STARTED,
  CANT_ANSWER,
} = require('./constants/response-words');
const USERS = require('./constants/users');
const GUILD_DETAILS = require('./constants/guild-details');

const { kickFromVoice, byNmins } = require('./actions/kick');
const { choice } = require('./utilities/choice');
const { include } = require('./utilities/include');
const { stripMention } = require('./utilities/strip-mention');
const { toHankaku } = require('./utilities/to-hankaku');

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});

let temporary_adjustment_minutes = 0;
let temporary_current_end_time;
let temporary_current_end_timer_id;
let temporary_current_about_timer_id;
let temporary_current_is_punctual;

client.on('ready', async () => {
  console.log(`${client.user.tag} でログイン`);
});

client.on('messageCreate', async (message) => {
  if (!message.author.bot && message.mentions.users.get(USERS.GUSTO_BOT)) {
    switch (true) {
      case include(START_NISYU_ICHI, message.content): {
        const { endTime, endTimerId, aboutTimerId } = await startNishuIchiBy(90, message);
        temporary_current_end_time = endTime;
        temporary_current_end_timer_id = endTimerId;
        temporary_current_about_timer_id = aboutTimerId;
        temporary_current_is_punctual = false;
        await message.channel.send(choice(JUST_STARTED));
        break;
      }

      case START_NISYU_ICHI.some((triggerWord) => {
        return ADJUSTMENT_MINUTES_WORDS.map((connector) => {
          const regexp = new RegExp(`([0-9０-９]+)${connector}${triggerWord}`);
          const strippedMessage = stripMention(message.content);
          const result = strippedMessage.match(regexp);

          if (result) {
            temporary_adjustment_minutes = result[1];
            return true;
          } else {
            return false;
          }
        }).includes(true);
      }): {
        if (temporary_adjustment_minutes) {
          const isPunctual = true;
          const minutes = toHankaku(temporary_adjustment_minutes);
          await message.channel.send(choice(STARTED, `${minutes}分設定で`));
          const { endTime, endTimerId, aboutTimerId } = await startNishuIchiBy(
            minutes,
            message,
            isPunctual
          );

          temporary_adjustment_minutes = '';
          temporary_current_end_time = endTime;
          temporary_current_end_timer_id = endTimerId;
          temporary_current_about_timer_id = aboutTimerId;
          temporary_current_is_punctual = isPunctual;

          await message.channel.send(`${endTime.format('H時mm分')} ${choice(KICK_FROM_VOICE)}`);
        }
        break;
      }

      case RESTART_NISYU_ICHI.some((triggerWord) => {
        return ADJUSTMENT_RESTART_WORDS.map((connector) => {
          const regexp = new RegExp(`${triggerWord}([0-9０-９]+)${connector}`);
          const strippedMessage = stripMention(message.content);
          const result = strippedMessage.match(regexp);

          if (result) {
            temporary_adjustment_minutes = result[1];
            return true;
          } else {
            return false;
          }
        }).includes(true);
      }): {
        if (temporary_adjustment_minutes && temporary_current_end_time) {
          const minutes = toHankaku(temporary_adjustment_minutes);
          await message.channel.send(choice(ADD_MINUTES, minutes));

          const { endTime, endTimerId, aboutTimerId } = await restartNishuIchiBy(minutes, message);
          temporary_adjustment_minutes = '';
          temporary_current_end_time = endTime;
          temporary_current_end_timer_id = endTimerId;
          temporary_current_about_timer_id = aboutTimerId;
          // temporary_current_is_punctual は変更しない
        }
        break;
      }

      case include(CHECK_TIME, message.content): {
        if (temporary_current_end_time) {
          if (!temporary_current_is_punctual) {
            await message.channel.send(choice(CANT_ANSWER));
          } else {
            const now = dayjs.tz();
            const minutes = temporary_current_end_time.diff(now) / 1000 / 60;
            if (minutes < 1) {
              await message.channel.send('もう終わるよ');
            } else {
              await message.channel.send(`あと${Math.floor(minutes)}分`);
            }
          }
        } else {
          await message.channel.send(choice(NOT_STARTED));
        }
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

async function startNishuIchiBy(minutes, message, isPunctual) {
  const { endTime, endTimerId, aboutTimerId } = byNmins(
    minutes,
    async () => {
      const guilds = client.guilds.cache.get(GUILD_DETAILS.GUILD_ID);
      await kickFromVoice(guilds);
    },
    async () => {
      await message.channel.send(choice(ABOUT_TIME));
    },
    isPunctual
  );

  return { endTime, endTimerId, aboutTimerId };
}

async function restartNishuIchiBy(minutes, message) {
  clearTimeout(temporary_current_end_timer_id);
  clearTimeout(temporary_current_about_timer_id);

  const now = dayjs.tz();
  const newMinutes = temporary_current_end_time.add(minutes, 'minutes').diff(now) / 1000 / 60;

  const { endTime, endTimerId, aboutTimerId } = byNmins(
    newMinutes,
    async () => {
      const guilds = client.guilds.cache.get(GUILD_DETAILS.GUILD_ID);
      await kickFromVoice(guilds);
    },
    async () => {
      await message.channel.send(choice(ABOUT_TIME));
    },
    true
  );

  return { endTime, endTimerId, aboutTimerId };
}
