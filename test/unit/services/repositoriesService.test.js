const repositoriesService = require('../../../src/services/repositoriesService');

jest.mock('../../../src/services/githubService');
const githubService = require('../../../src/services/githubService');

describe('get Repositories Info By Org', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });
  it(`should return the org's  repositories info sorting by stars number`, async () => {
    const org = 'facebook';

    const gitHubServiceResult = [
      { name: 'react', stars: 4 },
      { name: 'recoil', stars: 2 },
      { name: 'jest', stars: 5 },
    ];

    const expectedResult = [
      { name: 'jest', stars: 5 },
      { name: 'react', stars: 4 },
      { name: 'recoil', stars: 2 },
    ];

    const spy = jest
      .spyOn(githubService, 'searchRepositoriesByOrg')
      .mockImplementation((url) => gitHubServiceResult);

    const result = await repositoriesService.getRepositoriesInfoByOrg(org);

    expect(spy).toBeCalled();
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(org);

    expect(result).toStrictEqual(expectedResult);
  });
});
