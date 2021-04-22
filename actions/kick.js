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

  by90mins(callback, aboutCallback) {
    const minutes = 90;
    const now = dayjs.tz();
    const endTime = now.add(minutes, 'minutes');
    const waitTime = endTime.diff(now).valueOf();

    setTimeout(callback, waitTime);

    if (aboutCallback) {
      const endTime = now.add(minutes - (Math.random() * 7 + 3), 'minutes');
      const waitTime = endTime.diff(now).valueOf();
      setTimeout(aboutCallback, waitTime);
    }

    return { endTime };
  },
};
