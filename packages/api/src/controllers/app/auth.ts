import { CreateBlankSessionCookieCommand } from '@/features/auth/commands/createBlankSessionCookie'
import { CreateUserSessionCookieCommand } from '@/features/auth/commands/createUserSessionCookie'
import { InvalidateUserSessionCommand } from '@/features/auth/commands/invalidateUserSession'
import { SignUpUserCommand } from '@/features/auth/commands/signUpUser'
import type { Context } from '@/utils/types/context'
import {
  loginRequestSchema,
  signUpRequestSchema,
} from '@fullstack-monorepo/lib/contracts/endpoints/app/auth'
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { zValidator } from '@hono/zod-validator'
import type { Mediator } from '@myty/jimmy'

export function AppAuthController(mediator: Mediator) {
  const app = new OpenAPIHono<Context>()

  //* POST /app/auth/login
  app.openapi(
    createRoute({
      tags: ['APP - Auth'],
      method: 'post',
      path: '/app/auth/login',
      request: {
        body: {
          content: {
            'application/json': {
              schema: loginRequestSchema,
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
    async (c) => {
      const currentSession = c.get('session')
      if (currentSession) {
        return c.json({ message: 'Already logged in' }, 409)
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

  //* POST /app/auth/signup
  app.post('/signup', zValidator('json', signUpRequestSchema), async (c) => {
    const { name, email, password } = c.req.valid('json')

    const result = await mediator.send(
      new SignUpUserCommand(name, email, password)
    )

    return result.toApiResponse()
  })

  //* POST /app/auth/logout
  app.post('/logout', async (c) => {
    const session = c.get('session')
    if (!session) {
      return c.json({ message: 'Unauthorized' }, 401)
    }

    const invalidationResult = await mediator.send(
      new InvalidateUserSessionCommand(session.id)
    )
    if (!invalidationResult.isSuccess()) {
      return invalidationResult.toApiResponse()
    }

    const blankCookieResult = await mediator.send(
      new CreateBlankSessionCookieCommand()
    )
    // Clear session cookie if logout is successful, by setting an empty cookie
    if (blankCookieResult.isSuccess()) {
      c.header('Set-Cookie', blankCookieResult.value!.serialize())
    }

    return c.body(null, 200)
  })

  //* GET /app/auth/check
  app.get('/check', async (c) => {
    const session = c.get('session')
    if (!session) {
      return c.json({ message: 'Unauthorized' }, 401)
    }

    return c.json({ message: 'Authorized', session }, 200)
  })

  return app
}
