const dayjs = require('dayjs');
const CHANNELS = require('../constants/channels');
dayjs.extend(require('dayjs/plugin/timezone'));
dayjs.extend(require('dayjs/plugin/utc'));
dayjs.tz.setDefault('Asia/Tokyo');

module.exports = {
  kickFromVoice(list) {
    return Promise.all(
      list.members.cache
        .filter((member) => member.voice.channel?.id === CHANNELS.VOICE)
        .map(async (member) => {
          return member.voice.setChannel(null);
        })
    );
  },

  byNmins(minutes, callback, aboutCallback, isPunctual = false) {
    const now = dayjs.tz();
    const chunkMinutes = isPunctual ? 0 : Math.random() * 10;
    const endTime = now.add(minutes + chunkMinutes, 'minutes');
    const waitTime = endTime.diff(now).valueOf();

    const endTimerId = setTimeout(callback, waitTime);
    let aboutTimerId;

    if (aboutCallback) {
      const endTime = now.add(minutes - (Math.random() * 7 + 3), 'minutes');
      const waitTime = endTime.diff(now).valueOf();
      aboutTimerId = setTimeout(aboutCallback, waitTime);
    }

    return { endTime, endTimerId, aboutTimerId };
  },

  by90mins(callback, aboutCallback) {
    return byNmins(90, callback, aboutCallback);
  },
};
