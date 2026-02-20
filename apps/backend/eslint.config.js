const tsParser = require('@typescript-eslint/parser')

/** @type {import("eslint").Linter.Config[]} */
const config = [
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tsParser,
    },
    ignores: ['dist/**', 'node_modules/**'],
  },
]

module.exports = config
