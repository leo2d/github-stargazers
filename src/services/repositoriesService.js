const stringUtils = require('../utils/stringUtils');
const { searchRepositoriesByOrg } = require('./githubService');

const getRepositoriesInfoByOrg = async (org) => {
  if (!stringUtils.stringIsValid(org)) throw new Error('Invalid args...');

  const result = await searchRepositoriesByOrg(org);

  return result;
};

module.exports = {
  getRepositoriesInfoByOrg,
};
