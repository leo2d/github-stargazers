const { default: Axios } = require('axios');

const get = async (url, onComplete, onError, customHeaders) => {
  const options = customHeaders ? { headers: customHeaders } : undefined;

  return Axios.get(url, options)
    .then((response) => onComplete(response))
    .catch((error) => onError(error));
};

module.exports = { get };
