const stringIsValid = (str) =>
  str !== null &&
  str !== undefined &&
  typeof str === 'string' &&
  str.trim() !== '';

module.exports = { stringIsValid };
