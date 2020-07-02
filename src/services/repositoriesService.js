const { searchRepositoriesByOrg } = require('./githubService');

const getRepositoriesInfoByOrg = async (org) => {
  const reposInfo = await searchRepositoriesByOrg(org);

  const sortedRepos = reposInfo.sort((a, b) => (a.stars > b.stars ? -1 : 1));

  return sortedRepos;
};

module.exports = {
  getRepositoriesInfoByOrg,
};
