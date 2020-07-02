const config = require('../config');
const { requestGitHubData } = require('../shared/request');
const urlUtils = require('../utils/urlUtils');

const searchRepositoriesByOrg = async (org) => {
  const baseUrl = buildBaseUrl(org);
  const url = addPageSizeToUrl(baseUrl);

  const response = await requestGitHubData(
    url,
    handleResponse,
    handleError,
    org
  );

  const info = await fetchRepositoriesInfo(response, org);

  //TODO: Remove this logs before merge to master
  console.log(`${org} total repos - > `, info.length);

  return info;
};

const fetchRepositoriesInfo = async (response, org, prevInfo = []) => {
  const { headers, data } = response;

  const currentInfo = await fetchStargazers(data);

  const info = [...prevInfo, ...currentInfo];

  if (!hasNextLink(headers.link)) return info;

  const links = parseLinkHeader(headers.link);
  const nextLink = links.find((link) => link.rel === 'next');

  const currentResponse = await requestGitHubData(
    nextLink.href,
    handleResponse,
    handleError,
    org
  );

  // eslint-disable-next-line no-return-await
  return await fetchRepositoriesInfo(currentResponse, org, info);
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
  const response = await requestGitHubData(
    stargazersUrl,
    handleResponse,
    handleError,
    repo.name
  );

  const { headers, data } = response;

  const firstPageStars = data.length;

  if (!hasNextLink(headers.link)) return firstPageStars;

  const links = parseLinkHeader(headers.link);
  const lastLink = links.find((link) => link.rel === 'last');

  const middlePagesStars = (lastLink.page - 2) * config.github.apiPerPageLimit;

  const lastPageResponse = await requestGitHubData(
    lastLink.href,
    handleResponse,
    handleError,
    repo.name
  );

  const lastPageStars = lastPageResponse.data.length;

  const stars = firstPageStars + middlePagesStars + lastPageStars;

  return stars;
};


const handleResponse = (response) => {
  return response;
};

const handleError = (error, key = '') => {
  console.log(key, error);
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

const buildBaseUrl = (org) =>
  `${config.github.apiBaseUrl}${config.github.apiOrgsPath}/${org}${config.github.apiReposPath}`;

const addPageSizeToUrl = (url, size = config.github.apiPerPageLimit) =>
  urlUtils.addQueryString(url, {
    key: config.github.apiPerPageQuery,
    value: size,
  });

module.exports = { searchRepositoriesByOrg };
