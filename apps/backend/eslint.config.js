const backendConfig = require('@rpg-game/eslint-config/backend')

/** @type {import("eslint").Linter.Config[]} */
const config = [
  ...backendConfig,
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
]

module.exports = config
