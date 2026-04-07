'use strict';

const js = require('@eslint/js');
const globals = require('globals');
const jestPlugin = require('eslint-plugin-jest');

module.exports = [
  { ignores: ['node_modules/**', 'coverage/**', 'prisma/migrations/**'] },
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: globals.node,
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['tests/**/*.js'],
    ...jestPlugin.configs['flat/recommended'],
    languageOptions: {
      globals: { ...globals.node, ...jestPlugin.environments.globals.globals },
    },
  },
];
