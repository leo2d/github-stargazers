const stringIsValid = (str) =>
  str !== null &&
  str !== undefined &&
  typeof str === 'string' &&
  str.trim() !== '' &&
  !str.match(/^[0-9]*$/);

module.exports = { stringIsValid };
