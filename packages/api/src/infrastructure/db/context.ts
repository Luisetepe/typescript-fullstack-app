import { env } from '@/env'
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as authSchema from './schema/auth'

export const dbContext = drizzle(postgres(env.DATABASE_URL), {
  schema: { ...authSchema },
})
export const authAdapter = new DrizzlePostgreSQLAdapter(
  dbContext,
  authSchema.SESSION_TABLE,
  authSchema.USER_TABLE
)

export type DbContext = typeof dbContext
