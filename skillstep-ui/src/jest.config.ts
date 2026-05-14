// jest.config.ts
import type { Config } from 'jest';

const config: Config = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/src/setup-jest.ts'],
  testEnvironment: 'jsdom',

  // Transforme les fichiers TypeScript et HTML Angular
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },

  // Alias de chemins — correspondent à tsconfig.json
  moduleNameMapper: {
    '^@core/(.*)$':     '<rootDir>/src/app/core/$1',
    '^@features/(.*)$': '<rootDir>/src/app/features/$1',
    '^@shared/(.*)$':   '<rootDir>/src/app/shared/$1',
  },

  // Fichiers à tester
  testMatch: ['**/*.spec.ts'],

  // Couverture de code
  collectCoverageFrom: [
    'src/app/**/*.ts',
    '!src/app/**/*.routes.ts',  // pas les fichiers de routes
    '!src/app/**/*.model.ts',   // pas les modèles (interfaces)
    '!src/main.ts',
  ],
  coverageReporters: ['html', 'text-summary'],
};

export default config;