const { default: Axios } = require('axios');

const config = require('../config');

const requestGitHubData = async (url, onComplete, onError, key = '') => {
  const requestConfig = {
    headers: {
      Authorization: `token ${config.github.apiAccessToken}`,
      'User-Agent': 'github-stargazers',
    },
  };

  return Axios.get(url, requestConfig)
    .then((response) => onComplete(response, key))
    .catch((error) => onError(error, key));
};

module.exports = { requestGitHubData };
