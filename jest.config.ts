import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coveragePathIgnorePatterns: ['.module.ts', 'graphql.ts', 'dto.ts'],
  coverageDirectory: '../coverage',

  // Uncomment this line to enforce coverage thresholds
  // coverageThreshold: {
  //   global: {
  //     branches: 80,
  //     functions: 80,
  //     lines: 80,
  //     statements: 50,
  //   },
  // },
  testEnvironment: 'node',
  testResultsProcessor: 'jest-sonar-reporter',
  clearMocks: true,
  detectOpenHandles: true,
};

export default config;
