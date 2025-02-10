// jest.config.mjs
export default {
    testEnvironment: 'node',
    testMatch: ['**/*.test.js'],
    verbose: true,
    forceExit: true,
    clearMocks: true,
    resetMocks: true,
    restoreMocks: true,
    testTimeout: 10000,
  };
  