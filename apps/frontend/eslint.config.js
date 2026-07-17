// @ts-check
'use strict'

const { createNextConfig } = require('@grimoire/eslint-config/next')

module.exports = [
  // Ancienne landing conservée pour référence — non typée (exclue du tsconfig),
  // donc non lintable par les règles typées. On l'ignore entièrement.
  { ignores: ['src/app/_archive/**'] },
  ...createNextConfig({ tsconfigRootDir: __dirname }),
  {
    files: ['src/features/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/app/**'],
              message:
                'Une feature partagée ne doit pas importer une route ou un univers. Injecter la configuration depuis app/.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/components/ui/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/app/**', '@/features/**', '@/stores/**'],
              message:
                'Une primitive UI ne doit dépendre ni des routes, ni des features, ni de leur état métier.',
            },
          ],
        },
      ],
    },
  },
]
