const path = require('path');

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  coverageReporters: [
    'html',
    'cobertura'
  ],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!**/node_modules/**'
  ],
  transform: {
    'jose[/\\\\].+\\.[jt]sx?$': 'babel-jest',
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.tsx?$': 'ts-jest'
  },
  transformIgnorePatterns: [
    'node_modules/(?!jose)'
  ],
  moduleNameMapper: {
    'jose': path.join(
      path.dirname(require.resolve('jose/package.json')),
      'dist/browser/index.js'
    )
  },
  verbose: true
};

