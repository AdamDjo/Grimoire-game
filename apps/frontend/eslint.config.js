const nextConfig = require('@rpg-game/eslint-config/next')

/** @type {import("eslint").Linter.Config[]} */
const config = [
  ...nextConfig,
  {
    ignores: ['.next/**', 'node_modules/**'],
  },
]

module.exports = config
