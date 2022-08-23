module.exports = {
  root: true,
  settings: {
    'import/resolver': {
      typescript: {},
      node: {
        extensions: [
          '.js',
          '.jsx',
          '.ts',
          '.tsx'
        ]
      }
    }
  },
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'import'
  ],
  extends: [
    'plugin:@typescript-eslint/eslint-recommended'
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': 'off',
    'import/extensions': 'off',
    'camelcase': 'off',
    'max-classes-per-file': 'off',
    'no-underscore-dangle': 'off',
    'no-async-promise-executor': 'off',
    'no-console': 'off',
    'comma-dangle': ['error', 'never'],
    'no-cond-assign': 'off',
    'max-len': 'off',
    'quotes': ['error', 'single']
  }
};
