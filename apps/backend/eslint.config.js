// @ts-check
'use strict'

const { createBackendConfig } = require('@grimoire/eslint-config/backend')

module.exports = createBackendConfig({ tsconfigRootDir: __dirname })
