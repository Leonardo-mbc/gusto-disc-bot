exports.stripMention = (text) => {
  return text.replace(/<.+?>\s/, '');
};
