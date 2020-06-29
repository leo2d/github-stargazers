const config = require('../config');
const { requestGitHubData } = require('../shared/request');
const { addQueryString } = require('../utils/urlUtils');

const searchRepositoriesByOrg = async (org) => {
  const baseUrl = buildBaseUrl(org);
  const url = addPerPageQuantity(baseUrl);

  const response = await requestGitHubData(
    url,
    handleResponse,
    handleError,
    org
  );

  const info = await fetchRepositoriesInfo(response, org);
  console.log(`${org} total repos - > `, info.length);

  return info.sort((a, b) => (a.stars > b.stars ? -1 : 1));
};

const fetchRepositoriesInfo = async (response, org, prevInfo = []) => {
  const { headers, data } = response;
  console.log('headers link: repos -> ', headers.link);

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

  console.log('links: repos -> ', links);

  // eslint-disable-next-line no-return-await
  return await fetchRepositoriesInfo(currentResponse, org, info);
};

const fetchStargazers = async (pageRespositories) => {
  const result = [];
  for (const repo of pageRespositories) {
    const stars = await fetchRepositoryStarsNumber(repo);
    console.log('item -> ', { name: repo.name, stars });
    result.push({ name: repo.name, stars });
  }

  return result;
};

const fetchRepositoryStarsNumber = async (repo) => {
  const stargazersUrl = addPerPageQuantity(repo.stargazers_url);
  const response = await requestGitHubData(
    stargazersUrl,
    handleResponse,
    handleError,
    repo.name
  );

  const { headers, data } = response;

  const firstPageStars = data.length;

  if (!hasNextLink(headers.link)) return data.length;

  const anotherPagesStars = await fetchPaginatedStarsNumber(headers.link, repo);

  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  const stars = anotherPagesStars.reduce(reducer, firstPageStars);

  return stars;
};

const fetchPaginatedStarsNumber = async (link, repo) => {
  const links = parseLinkHeader(link);
  const lastLink = links.find((link) => link.rel === 'last');

  const urls = Array.from({ length: lastLink.page - 1 }).map((_, index) => {
    return lastLink.href.replace(`page=${lastLink.page}`, `page=${index + 2}`);
  });

  const result = urls.map((url) => {
    return requestGitHubData(url, handleStarsResponse, handleError, repo.name);
  });

  const anotherPagesStars = await Promise.all(result);

  return anotherPagesStars;
};

const handleStarsResponse = (response) => {
  return response.data.length;
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

const addPerPageQuantity = (url, quantity = config.github.apiPerPageLimit) =>
  addQueryString(url, {
    key: config.github.apiPerPageQuery,
    value: quantity,
  });

module.exports = { searchRepositoriesByOrg };
