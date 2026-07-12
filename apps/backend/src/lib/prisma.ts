import { PrismaPg } from '@prisma/adapter-pg'

import { PrismaClient } from '../generated/prisma/client'

/**
 * Singleton PrismaClient. En dev, le hot-reload recharge ce module à chaque
 * changement de fichier ; sans ce cache sur globalThis, chaque reload ouvrirait
 * une nouvelle connexion Postgres jusqu'à épuiser le pool.
 *
 * Prisma 7 sépare le moteur runtime des credentials CLI : le Client a besoin
 * d'un driver adapter explicite (PrismaPg) même si prisma.config.ts connaît déjà DATABASE_URL.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
