// @ts-check
'use strict'

const path = require('path')

/**
 * lint-staged config using functions so ESLint runs in the correct workspace
 * directory (each app has its own eslint.config.js).
 *
 * @type {import('lint-staged').Configuration}
 */
module.exports = {
  'apps/frontend/**/*.{ts,tsx}': (files) => {
    const cwd = path.join(__dirname, 'apps/frontend')
    const relative = files.map((f) => path.relative(cwd, f)).join(' ')
    return [
      `pnpm --filter frontend exec eslint --fix ${relative}`,
      `pnpm --filter frontend exec prettier --write ${relative}`,
    ]
  },
  'apps/backend/**/*.ts': (files) => {
    const cwd = path.join(__dirname, 'apps/backend')
    const relative = files.map((f) => path.relative(cwd, f)).join(' ')
    return [
      `pnpm --filter backend exec eslint --fix ${relative}`,
      `pnpm --filter backend exec prettier --write ${relative}`,
    ]
  },
  'packages/**/*.{ts,tsx,js}': (files) => {
    return [`prettier --write ${files.join(' ')}`]
  },
  '*.{json,md,yml,yaml}': (files) => {
    return [`prettier --write ${files.join(' ')}`]
  },
}
