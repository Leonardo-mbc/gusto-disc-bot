const { stripMention } = require('./strip-mention');

exports.include = (array, text) => {
  return array.includes(stripMention(text));
};
