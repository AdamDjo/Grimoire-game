import { spawnSync } from 'node:child_process'
import 'dotenv/config'

const directUrl = process.env.DIRECT_URL

if (!directUrl) {
  console.error('DIRECT_URL manquant dans .env — impossible de lancer la migration.')
  process.exit(1)
}

const args = process.argv.slice(2)

const result = spawnSync('pnpm', ['exec', 'prisma', ...args], {
  stdio: 'inherit',
  env: { ...process.env, DATABASE_URL: directUrl },
})

process.exit(result.status ?? 1)
