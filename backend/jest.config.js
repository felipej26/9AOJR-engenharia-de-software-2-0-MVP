module.exports = {
  testEnvironment: 'node',
  clearMocks: true,
  restoreMocks: true,
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: ['**/*.test.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
    '!src/cron-worker.js',
  ],
  coverageDirectory: 'coverage',
};
