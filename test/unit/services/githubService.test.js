const githubService = require('../../../src/services/githubService');
const httpService = require('../../../src/shared/httpService');

describe('fetch Repository Stars Number', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });
  it('should return data succefully with only one page', async () => {
    const mockStargazersResposne = {
      headers: {},
      data: [{ name: 'james' }, { name: 'alice' }, { name: 'claire' }],
    };

    const spy = jest
      .spyOn(httpService, 'get')
      .mockImplementation(() => mockStargazersResposne);

    const stars = await githubService.fetchRepositoryStarsNumber('someUrl');

    expect(spy).toBeCalled();
    expect(spy).toBeCalledTimes(1);

    expect(stars).toBe(mockStargazersResposne.data.length);
  });
  it('should return data succefully with many pages', async () => {
    const pagesQuantity = 4;
    const mockStargazersResposne = {
      headers: {
        link: `<https://amazingUrl/stargazers?page=2>; rel="next", <https://amazingUrl/stargazers?page=${pagesQuantity}>; rel="last"`,
      },
      data: new Array(100),
    };

    const spy = jest
      .spyOn(httpService, 'get')
      .mockImplementation(() => mockStargazersResposne);

    const stars = await githubService.fetchRepositoryStarsNumber('someUrl');

    expect(spy).toBeCalled();
    expect(spy).toBeCalledTimes(2);

    expect(stars).toBe(400);
  });
  it('should throws an invalid args Error', async () => {
    await expect(
      githubService.fetchRepositoryStarsNumber({})
    ).rejects.toThrowError(
      `Invalid argument of type 'object' when expecting a string url`
    );
  });
  it('should throws an invalid args Error', async () => {
    await expect(
      githubService.fetchRepositoryStarsNumber()
    ).rejects.toThrowError(
      `Invalid argument of type 'undefined' when expecting a string url`
    );
  });
});
