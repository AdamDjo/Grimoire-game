// @ts-check
'use strict'

const tseslint = require('typescript-eslint')
const importX = require('eslint-plugin-import-x')
const prettierConfig = require('eslint-config-prettier')

/**
 * Base ESLint flat config factory for all TypeScript packages in the monorepo.
 *
 * Uses typescript-eslint v8 with parserOptions.projectService (typed linting)
 * and eslint-plugin-import-x (ESLint v9 flat config native, replaces import).
 *
 * @param {{ tsconfigRootDir: string }} options
 * @returns {import('typescript-eslint').ConfigArray}
 */
function createBaseConfig({ tsconfigRootDir }) {
  return tseslint.config(
    // 1. Global ignores — must be a standalone object, processed first
    {
      ignores: ['**/dist/**', '**/node_modules/**', '**/.next/**', '**/coverage/**'],
    },

    // 2. typescript-eslint recommended + type-checked preset — scoped to TS only
    // Without files scope, recommendedTypeChecked would apply to .js config files
    // and fail because they have no tsconfig project info
    ...tseslint.configs.recommendedTypeChecked.map((config) => ({
      ...config,
      files: ['**/*.ts', '**/*.tsx'],
    })),
    ...tseslint.configs.stylisticTypeChecked.map((config) => ({
      ...config,
      files: ['**/*.ts', '**/*.tsx'],
    })),

    // 3. Project-wide typed linting + import-x + our custom rules
    {
      files: ['**/*.ts', '**/*.tsx'],
      plugins: {
        'import-x': importX,
      },
      languageOptions: {
        parserOptions: {
          // projectService uses TypeScript's language server (same as editors)
          // More reliable than project:true in monorepos — no extra tsconfig needed
          projectService: true,
          tsconfigRootDir,
        },
      },
      settings: {
        'import-x/resolver': {
          typescript: {
            project: `${tsconfigRootDir}/tsconfig.json`,
          },
        },
      },
      rules: {
        // --- TypeScript ---
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
        '@typescript-eslint/no-explicit-any': 'warn',
        // fixStyle: inline-type-imports avoids separate import lines for types
        '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports', fixStyle: 'inline-type-imports' }],
        '@typescript-eslint/no-import-type-side-effects': 'error',
        // Typed rules — catch unawaited promises & misused async callbacks
        '@typescript-eslint/no-floating-promises': 'error',
        '@typescript-eslint/await-thenable': 'error',
        '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: { attributes: false } }],

        // --- Import order (import-x) ---
        'import-x/no-duplicates': 'error',
        'import-x/no-self-import': 'error',
        'import-x/no-cycle': ['error', { maxDepth: 3 }],
        'import-x/order': [
          'error',
          {
            groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'type'],
            'newlines-between': 'always',
            alphabetize: { order: 'asc', caseInsensitive: true },
          },
        ],

        // --- General ---
        'no-console': ['warn', { allow: ['warn', 'error'] }],
        'prefer-const': 'error',
        'no-var': 'error',
      },
    },

    // 4. Prettier last — disables all formatting rules that conflict
    prettierConfig,
  )
}

module.exports = { createBaseConfig }
