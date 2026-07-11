// @ts-check
'use strict'

const { createBackendConfig } = require('@grimoire/eslint-config/backend')

module.exports = createBackendConfig({
  tsconfigRootDir: __dirname,
  // Config files live outside src/ (so outside tsconfig's `include`). Let the
  // TypeScript project service lint them via a default project instead of failing.
  allowDefaultProject: ['*.config.ts'],
})
