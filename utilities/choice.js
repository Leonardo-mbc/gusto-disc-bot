exports.choice = (array, beforeWord = '', afterWord = '') => {
  const index = Math.floor(Math.random() * array.length);
  return `${beforeWord}${array[index]}${afterWord}`;
};
