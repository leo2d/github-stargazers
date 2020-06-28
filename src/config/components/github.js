const {
  GITHUB_API_BASE_URL,
  GITHUB_API_REPOS_PATH,
  GITHUB_API_ORGS_PATH,
} = process.env;

module.exports = {
  ApiBaseUrl: GITHUB_API_BASE_URL,
  ApiOrgsPath: GITHUB_API_ORGS_PATH,
  ApiReposPath: GITHUB_API_REPOS_PATH,
};
