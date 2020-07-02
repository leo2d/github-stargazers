const config = require('../config');
const httpService = require('../shared/httpService');
const urlUtils = require('../utils/urlUtils');

const searchRepositoriesByOrg = async (org) => {
  const orgReposUrl = buildOrgRepositoriesUrl(org);
  const orgReposWithPageSize = addPageSizeToUrl(orgReposUrl);

  const firstRepoPageResponse = await fetchGitHubData(orgReposWithPageSize);

  const orgRepos = await fetchRepositoriesInfo(firstRepoPageResponse, org);

  //TODO: Remove this logs before merge to master
  console.log(`${org} total repos - > `, orgRepos.length);

  return orgRepos;
};

const fetchRepositoriesInfo = async (response, org, prevInfo = []) => {
  const { headers, data } = response;

  const pageRepos = await fetchStargazers(data);

  const repos = [...prevInfo, ...pageRepos];

  if (!hasNextLink(headers.link)) return repos;

  const links = parseLinkHeader(headers.link);
  const nextLink = links.find((link) => link.rel === 'next');

  const nextPageResponse = await fetchGitHubData(nextLink.href);

  // eslint-disable-next-line no-return-await
  return await fetchRepositoriesInfo(nextPageResponse, org, repos);
};

const fetchStargazers = async (pageRespositories) => {
  const repos = pageRespositories.map(async (repo) => {
    const stars = await fetchRepositoryStarsNumber(repo);
    return { name: repo.name, stars };
  });

  const results = await Promise.all(repos);

  //TODO: Remove this logs before merge to master
  results.forEach((item) => console.log('item -> ', item));

  return results;
};

const fetchRepositoryStarsNumber = async (repo) => {
  const stargazersUrl = addPageSizeToUrl(repo.stargazers_url);
  const firstPageResponse = await fetchGitHubData(stargazersUrl);

  const { headers, data } = firstPageResponse;

  const firstPageStars = data.length;

  if (!hasNextLink(headers.link)) return firstPageStars;

  const links = parseLinkHeader(headers.link);
  const lastLink = links.find((link) => link.rel === 'last');

  const middlePagesStars = (lastLink.page - 2) * config.github.apiPerPageLimit;

  const lastPageResponse = await fetchGitHubData(lastLink.href);

  const lastPageStars = lastPageResponse.data.length;

  const stars = firstPageStars + middlePagesStars + lastPageStars;

  return stars;
};

const hasNextLink = (link) => {
  if (!link) return false;

  return link.includes(`rel="next"`);
};

const parseLinkHeader = (linkHeader) => {
  const strLinks = linkHeader.split(',');
  const links = strLinks.map((strLink) => {
    const splited = strLink.split(';');
    const rel = splited[1].match(/"(.*?)"/)[1];
    const href = splited[0].match(/<(.*?)>/)[1];

    const query = href.split('?')[1];

    const urlParams = new URLSearchParams(query);
    const params = Object.fromEntries(urlParams);

    return { href, rel, ...params };
  });

  return links;
};

const buildOrgRepositoriesUrl = (org) =>
  `${config.github.apiBaseUrl}${config.github.apiOrgsPath}/${org}${config.github.apiReposPath}`;

const addPageSizeToUrl = (url, size = config.github.apiPerPageLimit) =>
  urlUtils.addQueryString(url, {
    key: config.github.apiPerPageQuery,
    value: size,
  });

const fetchGitHubData = async (
  url,
  onComplete = handleResponse,
  onError = handleError
) => {
  const headers = {
    Authorization: `token ${config.github.apiAccessToken}`,
    'User-Agent': 'github-stargazers',
  };

  return httpService.get(url, onComplete, onError, headers);
};

const handleResponse = (response) => {
  return response;
};

const handleError = (error) => {
  console.log('Error -> ', error);
};

module.exports = { searchRepositoriesByOrg };
