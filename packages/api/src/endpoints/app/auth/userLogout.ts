import { CreateBlankSessionCookieCommand } from '@/features/auth/commands/createBlankSessionCookie'
import { InvalidateUserSessionCommand } from '@/features/auth/commands/invalidateUserSession'
import type { Context } from '@/utils/types/context'
import { createRoute, z, type OpenAPIHono } from '@hono/zod-openapi'
import type { Mediator } from '@myty/jimmy'

export function RegisterUserLogoutEndpoint(
  app: OpenAPIHono<Context>,
  mediator: Mediator
) {
  //* POST /app/auth/logout
  app.openapi(
    // OpenAPI route definition
    createRoute({
      tags: ['APP - Auth'],
      method: 'post',
      path: '/logout',
      responses: {
        200: {
          description: 'Successfully logged out.',
        },
        401: {
          description: 'No session existed to log out from.',
          content: {
            'application/json': {
              schema: z.object({
                message: z.string().openapi({ example: 'Unauthorized.' }),
              }),
            },
          },
        },
      },
    }),
    // Route handler
    async (c) => {
      const session = c.get('session')
      if (!session) {
        return c.json({ message: 'Unauthorized.' }, 401)
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
      if (!blankCookieResult.isSuccess()) {
        return blankCookieResult.toApiResponse()
      }

      // Clear session cookie if logout is successful, by setting an empty cookie
      c.header('Set-Cookie', blankCookieResult.value!.serialize())

      return c.body(null, 200)
    }
  )
}
