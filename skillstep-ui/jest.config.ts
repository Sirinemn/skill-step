import type { Config } from 'jest';

const config: Config = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testEnvironment: 'jsdom',

  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },

  moduleFileExtensions: ['ts', 'html', 'js', 'json', 'mjs'],

  moduleNameMapper: {
    '^@core/(.*)$': '<rootDir>/src/app/core/$1',
    '^@features/(.*)$': '<rootDir>/src/app/features/$1',
    '^@shared/(.*)$': '<rootDir>/src/app/shared/$1',
  },

  testMatch: ['**/*.spec.ts'],

  reporters: [
    'default',                    // sortie console normale
    ['jest-junit', {
      outputDirectory: 'coverage',
      outputName:      'junit.xml',
      classNameTemplate: '{classname}',
      titleTemplate:     '{title}',
    }]
  ],

  collectCoverage: true,
  collectCoverageFrom: [
    'src/app/**/*.ts',
    '!src/app/**/*.routes.ts',
    '!src/app/**/*.model.ts',
    '!src/main.ts',
  ],

  coverageReporters: ['html', 'text-summary', 'lcov'],
};

export default config;