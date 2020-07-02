const mockGitHubResponse = (url, onRepos = null, onStargazers = null) => {
  const urlPieces = url.split('?')[0].split('/');
  const lastpathBeforeQuery = urlPieces[urlPieces.length - 1];

  const responses = {
    stargazers: onStargazers || { headers: {}, data: [] },
    repos: onRepos || { headers: {}, data: [] },
  };

  return responses[lastpathBeforeQuery];
};

module.exports = {
  mockGitHubResponse,
};
