/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageReporters: [
    'html',
    'cobertura'
  ],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!**/node_modules/**'
  ]
};
