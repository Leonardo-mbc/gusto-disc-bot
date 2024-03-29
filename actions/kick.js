const dayjs = require('dayjs');
const CHANNELS = require('../constants/channels');
dayjs.extend(require('dayjs/plugin/timezone'));
dayjs.extend(require('dayjs/plugin/utc'));
dayjs.tz.setDefault('Asia/Tokyo');

module.exports = {
  async kickFromVoice(guilds) {
    console.log('切断開始');
    try {
      const members = await guilds.members.fetch();
      return Promise.all(
        members
          .filter((member) => member.voice.channelId === CHANNELS.VOICE)
          .map(async (member) => {
            console.log('Kick: ', member.user.username, member.voice.channelId);
            return member.voice.disconnect('終わりの時間になりました');
          })
      );
    } catch (e) {
      console.log('in kickFromVoice', e);
    }
  },

  byNmins(minutes, callback, aboutCallback, isPunctual = false) {
    const now = dayjs.tz();
    const chunkMinutes = isPunctual ? 0 : Math.random() * 10;
    const endTime = now.add(minutes + chunkMinutes, 'minutes');
    const waitTime = endTime.diff(now).valueOf();

    const endTimerId = setTimeout(callback, waitTime);
    let aboutTimerId;

    if (aboutCallback) {
      const superEarly = Math.random() < 0.3;
      const losstime = Math.random() * (superEarly ? 10 : 7) + (superEarly ? 20 : 3);
      const aboutEndTime = endTime.subtract(losstime, 'minutes');
      const aboutWaitTime = aboutEndTime.diff(now).valueOf();
      aboutTimerId = setTimeout(aboutCallback, aboutWaitTime);
    }

    return { endTime, endTimerId, aboutTimerId };
  },

  by90mins(callback, aboutCallback) {
    return byNmins(90, callback, aboutCallback);
  },
};
