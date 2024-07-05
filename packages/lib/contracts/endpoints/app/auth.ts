import { z } from '@hono/zod-openapi'

/*
  Request for endpoint
  * POST /app/auth/login
*/
export const loginRequestSchema = z.object({
  email: z.string().email().max(255).openapi({
    description: 'Email of the user',
    example: 'luis.primo@email.com',
  }),
  password: z
    .string()
    .max(255)
    .openapi({ description: 'Password of the user', example: 'Pa$$w0rd.' }),
})
export type LoginRequest = z.infer<typeof loginRequestSchema>

/*
  Request for endpoint
  * POST /app/auth/signup
*/
export const signUpRequestSchema = z.object({
  name: z.string().max(255),
  email: z.string().email().max(255),
  password: z.string().max(255),
})
export type SignUpRequest = z.infer<typeof signUpRequestSchema>
