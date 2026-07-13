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

  // Output directory. `start: node dist/index.js` runs the file produced here.
  outDir: 'dist',

  // ES modules, matching the source (`"module": "ESNext"` in tsconfig).
  format: ['esm'],

  // We run on Node 22, so target its supported syntax.
  target: 'node20',

  // Inline `@grimoire/shared` INTO the bundle instead of leaving it as an
  // external `import`. This is what makes dist/index.js self-contained.
  noExternal: ['@grimoire/shared'],

  // Wipe dist/ before each build so no stale files linger.
  clean: true,

  // Emit .js.map files to map runtime errors back to the TypeScript source.
  sourcemap: true,
})
