const addQueryString = (url, { key, value }) => {
  return url.includes('?')
    ? `${url}&${key}=${value}`
    : `${url}?${key}=${value}`;
};

module.exports = { addQueryString };
