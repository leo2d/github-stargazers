const { default: Axios } = require('axios');

const config = require('../config');

const requestGitHubData = async (url, onComplete, onError, key = '') => {
  const headers = { Authorization: `token ${config.github.apiAccessToken}` };

  return Axios.get(url, { headers })
    .then((response) => onComplete(response, key))
    .catch((error) => onError(error, key));
};

module.exports = { requestGitHubData };
