const dayjs = require('dayjs');
const CHANNELS = require('../constants/channels');

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

  by90mins(callback) {
    const now = dayjs();
    const endTime = now.add(90, 'minutes');
    const waitTime = endTime.diff(now).valueOf();

    setTimeout(callback, waitTime);

    return { endTime };
  },
};
