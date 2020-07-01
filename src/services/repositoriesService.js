const stringUtils = require('../utils/stringUtils');
const { searchRepositoriesByOrg } = require('./githubService');

const getRepositoriesInfoByOrg = async (org) => {
  if (!stringUtils.stringIsValid(org)) throw new Error('Invalid args...');

  const reposInfo = await searchRepositoriesByOrg(org);

  const sortedRepos = reposInfo.sort((a, b) => (a.stars > b.stars ? -1 : 1));

  return sortedRepos;
};

module.exports = {
  getRepositoriesInfoByOrg,
};
