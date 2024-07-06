import { z } from 'zod'

const envSchema = z.object({
  VITE_NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  VITE_API_URL: z.string(),
})

export const environment = envSchema.parse(import.meta.env)
export type Environment = z.infer<typeof envSchema>
