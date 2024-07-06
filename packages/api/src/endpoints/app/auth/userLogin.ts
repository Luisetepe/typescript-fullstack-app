import { CreateUserSessionCookieCommand } from '@/features/auth/commands/createUserSessionCookie'
import type { Context } from '@/utils/types/context'
import { LoginRequestSchema } from '@fullstack-monorepo/lib/contracts/endpoints/app/auth'
import type { OpenAPIHono } from '@hono/zod-openapi'
import { createRoute, z } from '@hono/zod-openapi'
import type { Mediator } from '@myty/jimmy'

export function RegisterUserLoginEndpoint(
  app: OpenAPIHono<Context>,
  mediator: Mediator
) {
  //* POST /app/auth/login
  app.openapi(
    // OpenAPI route definition
    createRoute({
      tags: ['APP - Auth'],
      method: 'post',
      path: '/login',
      request: {
        body: {
          content: {
            'application/json': {
              schema: LoginRequestSchema,
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Successfully logged in',
        },
        409: {
          description: 'Trying to login while already logged in',
          content: {
            'application/json': {
              schema: z.object({
                message: z.string().openapi({ example: 'Already logged in.' }),
              }),
            },
          },
        },
        401: {
          description: 'Invalid credentials',
          content: {
            'application/json': {
              schema: z.object({
                message: z
                  .string()
                  .openapi({ example: 'Invalid user or password.' }),
              }),
            },
          },
        },
      },
    }),
    // Route handler
    async (c) => {
      const currentSession = c.get('session')
      if (currentSession) {
        return c.json({ message: 'Already logged in.' }, 409)
      }

      const { email, password } = c.req.valid('json')

      const result = await mediator.send(
        new CreateUserSessionCookieCommand(email, password)
      )
      // Set session cookie if login is successful
      if (!result.isSuccess()) {
        return result.toApiResponse()
      }

      c.header('Set-Cookie', result.value!.serialize(), {
        append: true,
      })

      return c.body(null, 200)
    }
  )
}
