exports.toHankaku = (str) => {
  return parseInt(
    str.replace(/[０-９]/g, (s) => {
      return String.fromCharCode(s.charCodeAt(0) - 0xfee0);
    })
  );
};
