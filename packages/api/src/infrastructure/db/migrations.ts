import { environment } from '@/env'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/infrastructure/db/schema/*.ts',
  out: './src/infrastructure/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: environment.DATABASE_URL,
  },
  verbose: true,
  strict: true,
})
