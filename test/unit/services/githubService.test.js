const githubService = require('../../../src/services/githubService');
const httpService = require('../../../src/shared/httpService');
const { github } = require('../../../src/config');
const { mockGitHubResponse } = require('../../mocks/githubResponseMock');

describe('fetch Repository Stars Number', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });
  it('should return the number of stars successfully with only one stargazers page', async () => {
    const mockStargazersResposne = {
      headers: {},
      data: [{ name: 'james' }, { name: 'alice' }, { name: 'claire' }],
    };

    const url = 'https://awaesomeurl/repos/facebook/react/stargazers';
    const spy = jest
      .spyOn(httpService, 'get')
      .mockImplementation(() =>
        mockGitHubResponse(url, null, mockStargazersResposne)
      );

    const stars = await githubService.fetchRepositoryStarsNumber(url);

    expect(spy).toBeCalled();
    expect(spy).toBeCalledTimes(1);

    expect(stars).toBe(mockStargazersResposne.data.length);
  });
  it('should return the number of stars successfully  with many stargazers pages', async () => {
    const pagesQuantity = 4;
    const mockStargazersResposne = {
      headers: {
        link: `<https://awaesomeurl/repos/facebook/react/stargazers?page=2>; rel="next", <https://awaesomeurl/repos/facebook/react/stargazers?page=${pagesQuantity}>; rel="last"`,
      },
      data: new Array(github.apiPerPageLimit),
    };

    const expected = github.apiPerPageLimit * pagesQuantity;

    const url = 'https://awaesomeurl/repos/facebook/react/stargazers';
    const spy = jest
      .spyOn(httpService, 'get')
      .mockImplementation(() =>
        mockGitHubResponse(url, null, mockStargazersResposne)
      );

    const stars = await githubService.fetchRepositoryStarsNumber(url);

    expect(spy).toBeCalled();
    expect(spy).toBeCalledTimes(2);

    expect(stars).toBe(expected);
  });
  it('should throws an invalid args Error with object as arg', async () => {
    await expect(
      githubService.fetchRepositoryStarsNumber({})
    ).rejects.toThrowError(
      `Invalid argument of type 'object' when expecting a string url`
    );
  });
  it('should throws an invalid args Error with no args', async () => {
    await expect(
      githubService.fetchRepositoryStarsNumber()
    ).rejects.toThrowError(
      `Invalid argument of type 'undefined' when expecting a string url`
    );
  });
});

describe('search Repositories By Org', () => {
  const org = 'facebook';

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('should return data successfully with only one repos page', async () => {
    const mockReposResponse = {
      headers: {},
      data: [
        {
          name: 'react',
          stargazers_url: 'https://awaesomeurl/repos/facebook/react/stargazers',
        },
        {
          name: 'jest',
          stargazers_url: 'https://awaesomeurl/repos/facebook/jest/stargazers',
        },
      ],
    };

    const mockStargazersResposne = {
      headers: {},
      data: [{ name: 'james' }, { name: 'alice' }, { name: 'claire' }],
    };

    const expectedResult = [
      { name: 'react', stars: 3 },
      { name: 'jest', stars: 3 },
    ];

    const httpSpy = jest
      .spyOn(httpService, 'get')
      .mockImplementation((url) =>
        mockGitHubResponse(url, mockReposResponse, mockStargazersResposne)
      );

    const results = await githubService.searchRepositoriesByOrg('facebook');

    expect(httpSpy).toBeCalled();
    expect(results).toStrictEqual(expectedResult);
  });
  it('should throws an invalid args Error with object as arg', async () => {
    await expect(
      githubService.fetchRepositoryStarsNumber({})
    ).rejects.toThrowError(
      `Invalid argument of type 'object' when expecting a string`
    );
  });
  it('should throws an invalid args Error with no args', async () => {
    await expect(
      githubService.fetchRepositoryStarsNumber()
    ).rejects.toThrowError(
      `Invalid argument of type 'undefined' when expecting a string`
    );
  });
});
