const base = require('./index.js')

/** @type {import("eslint").Linter.Config[]} */
const nextConfig = [
  ...base,
  {
    plugins: {
      ...base[0].plugins,
      'react-hooks': require('eslint-plugin-react-hooks'),
    },
    rules: {
      ...base[0].rules,

      // React Hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Next.js: pas de default exports interdits (App Router en a besoin)
      // Mais on garde named exports partout sauf pour les pages/layouts
    },
  },
]

module.exports = nextConfig
