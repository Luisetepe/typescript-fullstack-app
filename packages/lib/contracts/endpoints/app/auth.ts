import { z } from '@hono/zod-openapi'

/*
  Request for endpoint
  * POST /app/auth/login
*/
export const LoginRequestSchema = z.object({
  email: z.string().email().max(255).openapi({
    description: 'Email of the user',
    example: 'luis.primo@email.com',
  }),
  password: z
    .string()
    .max(255)
    .openapi({ description: 'Password of the user', example: 'Pa$$w0rd.' }),
})
export type LoginRequest = z.infer<typeof LoginRequestSchema>

/*
  Request for endpoint
  * POST /app/auth/signup
*/
export const SignUpRequestSchema = z.object({
  name: z.string().max(255).openapi({
    description: 'Name of the user',
    example: 'Luis Primo',
  }),
  email: z.string().email().max(255).openapi({
    description: 'Email of the user',
    example: 'luis.primo@email.com',
  }),
  password: z.string().max(255).openapi({
    description: 'Password of the user',
    example: 'Pa$$w0rd.',
  }),
})
export type SignUpRequest = z.infer<typeof SignUpRequestSchema>
