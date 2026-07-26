import { defineConfig } from 'tsup'

/**
 * Build configuration for the backend.
 *
 * The backend imports `@grimoire/shared` from source (the shared package has no
 * build step). A plain `tsc` build cannot handle that, so we bundle everything
 * — backend + shared — into a single self-contained file with tsup (esbuild).
 */
export default defineConfig({
  // The single entrypoint. tsup follows every import from here.
  entry: ['src/index.ts'],

  // Output directory. `format: ['esm']` makes tsup emit `.mjs`, so the file
  // produced here is `dist/index.mjs` — what `start` and the Dockerfile run.
  outDir: 'dist',

  // ES modules, matching the source (`"module": "ESNext"` in tsconfig).
  format: ['esm'],

  // We run on Node 22, so target its supported syntax.
  target: 'node20',

  // Inline `@grimoire/shared` INTO the bundle instead of leaving it as an
  // external `import`. Runtime packages (express, @prisma/client/runtime) stay
  // external, so node_modules is still required at runtime.
  noExternal: ['@grimoire/shared'],

  // Wipe dist/ before each build so no stale files linger.
  clean: true,

  // Emit .js.map files to map runtime errors back to the TypeScript source.
  sourcemap: true,
})
