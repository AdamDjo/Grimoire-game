// @ts-check
'use strict'

const { createNextConfig } = require('@grimoire/eslint-config/next')

module.exports = [
  // Ancienne landing conservée pour référence — non typée (exclue du tsconfig),
  // donc non lintable par les règles typées. On l'ignore entièrement.
  { ignores: ['src/app/_archive/**'] },
  ...createNextConfig({ tsconfigRootDir: __dirname }),
]
