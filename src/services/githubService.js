const config = require('../config');
const httpService = require('../shared/httpService');
const urlUtils = require('../utils/urlUtils');
const stringUtils = require('../utils/stringUtils');

const searchRepositoriesByOrg = async (org) => {
  if (!stringUtils.stringIsValid(org))
    throw new Error(
      `Invalid argument of type '${typeof org}' when expecting a string`
    );

  const orgReposUrl = buildOrgRepositoriesUrl(org);
  const orgReposUrlWithPageSize = addPageSizeToUrl(orgReposUrl);

  const orgRepos = await fetchRepositoriesInfo(orgReposUrlWithPageSize);

  return orgRepos;
};

const fetchRepositoriesInfo = async (pageUrl, prevInfo = []) => {
  if (!pageUrl) return prevInfo;

  const response = await fetchGitHubData(pageUrl);

  const { headers, data } = response;

  const pageRepos = await fetchStargazers(data);

  const repos = [...prevInfo, ...pageRepos];

  const nextPageUrl = hasNextLink(headers.link)
    ? parseLinkHeader(headers.link).find((link) => link.rel === 'next').href
    : null;

  return await fetchRepositoriesInfo(nextPageUrl, repos);
};

const fetchStargazers = async (pageRespositories) => {
  const repos = pageRespositories.map(async (repo) => {
    const stars = await fetchRepositoryStarsNumber(repo.stargazers_url);
    return { name: repo.name, stars };
  });

  const results = await Promise.all(repos);

  return results;
};

const fetchRepositoryStarsNumber = async (stargazersUrl) => {
  if (!stringUtils.stringIsValid(stargazersUrl))
    throw new Error(
      `Invalid argument of type '${typeof stargazersUrl}' when expecting a string url`
    );

  const stargazersUrlWithPageSize = addPageSizeToUrl(stargazersUrl);
  const firstPageResponse = await fetchGitHubData(stargazersUrlWithPageSize);

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

module.exports = { searchRepositoriesByOrg, fetchRepositoryStarsNumber };
