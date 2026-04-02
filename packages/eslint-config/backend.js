const base = require('./index.js')

/** @type {import("eslint").Linter.Config[]} */
const backendConfig = [
  ...base,
  {
    rules: {
      ...base[0].rules,

      // Backend : no-console plus permissif (on utilise Pino mais pendant le dev c'est utile)
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],

      // Async/await obligatoire, pas de .then()
      'no-restricted-syntax': [
        'error',
        {
          selector: 'CallExpression[callee.property.name="then"]',
          message: 'Use async/await instead of .then()',
        },
      ],
    },
  },
]

module.exports = backendConfig
