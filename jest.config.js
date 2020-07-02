const jestCofig = {
  bail: true,
  collectCoverage: true,
  collectCoverageFrom: ['src/**'],
  coverageDirectory: 'test/coverage',
  typeAcquisition: { include: ['jest'] },
  testEnvironment: 'node',
  testMatch: ['**/test/**/*.test.js?(x)', '**/test/**/*.test.ts?(x)'],
};

module.exports = jestCofig;
