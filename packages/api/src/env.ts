import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.string().default('3000'),
  DATABASE_URL: z.string(),
})

export const environment = envSchema.parse(process.env)
export type Environment = z.infer<typeof envSchema>
