FROM node:20-alpine AS base
RUN npm install -g pnpm@9.15.0
WORKDIR /app

# Dependency install. `prisma generate` runs as a postinstall hook, so the schema
# has to be present here — it lives outside the package.json set copied above.
FROM base AS deps
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/prettier-config/package.json ./packages/prettier-config/
COPY packages/shared/package.json ./packages/shared/
COPY apps/backend/package.json ./apps/backend/
COPY apps/backend/prisma ./apps/backend/prisma
COPY apps/backend/prisma.config.ts ./apps/backend/
RUN pnpm install --frozen-lockfile

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/backend/node_modules ./apps/backend/node_modules
COPY packages/ ./packages/
COPY apps/backend/ ./apps/backend/
COPY turbo.json ./
# The generated Prisma client lives in src/generated/prisma (see schema.prisma)
# and is bundled by tsup, so it must exist before the build runs.
COPY --from=deps /app/apps/backend/src/generated ./apps/backend/src/generated
RUN pnpm --filter @grimoire/backend build

# Production dependencies only — the deps stage carries devDependencies (tsup,
# vitest, eslint, the Prisma CLI) that have no business in the runtime image.
# --ignore-scripts skips the `prisma generate` postinstall: the Prisma CLI is a
# devDependency and is absent here, and the generated client is already inlined
# in the bundle by tsup. Only the runtime packages it imports externally
# (@prisma/client/runtime, @prisma/adapter-pg, express…) are needed.
FROM base AS prod-deps
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/prettier-config/package.json ./packages/prettier-config/
COPY packages/shared/package.json ./packages/shared/
COPY apps/backend/package.json ./apps/backend/
RUN pnpm install --frozen-lockfile --prod --ignore-scripts

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# tsup inlines the app and @grimoire/shared into a single ESM file, but leaves
# runtime packages external — including @prisma/client/runtime/client — so
# node_modules is still required at runtime.
COPY --from=builder /app/apps/backend/dist ./dist
COPY --from=builder /app/apps/backend/package.json ./
COPY --from=prod-deps /app/apps/backend/node_modules ./node_modules
COPY --from=prod-deps /app/node_modules ./node_modules

# Don't run the API as root.
USER node

EXPOSE 3001
CMD ["node", "dist/index.mjs"]
