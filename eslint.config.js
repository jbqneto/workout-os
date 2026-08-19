const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/**', 'coverage/**', 'docs/design/reference/**'],
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }]
    }
  }
]);
