const STARTED = ['始まりました', 'スタート'];

module.exports = {
  STARTED,
  JUST_STARTED: [...STARTED, 'はいー'],
  KICK_FROM_VOICE: ['に切断するよ', 'には終わりだよ', 'で絶対やめさせる', 'までね'],
  PONG: ['うん', '大丈夫', '使えるよ'],
  ABOUT_TIME: ['もうそろそろ...', 'そろそろ終わるよ', 'あと数分', 'あと数分で終わるよ'],
  ADD_MINUTES: ['分追加', '分のばしたよ', '分延長'],
  NOT_STARTED: ['始まってなさそう', '先にタイマーをつけてね', 'まだ始まってないよ'],
  CANT_ANSWER: ['今は教えられない', '答えられない', '...'],
};
