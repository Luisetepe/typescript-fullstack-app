import { SignUpUserCommand } from '@/features/auth/commands/signUpUser'
import type { Context } from '@/utils/types/context'
import { SignUpRequestSchema } from '@fullstack-monorepo/lib/contracts/endpoints/app/auth'
import { createRoute, z, type OpenAPIHono } from '@hono/zod-openapi'
import type { Mediator } from '@myty/jimmy'

export function RegisterUserSignupEndpoint(
  app: OpenAPIHono<Context>,
  mediator: Mediator
) {
  //* POST /app/auth/signup
  app.openapi(
    // OpenAPI route definition
    createRoute({
      tags: ['APP - Auth'],
      method: 'post',
      path: '/signup',
      request: {
        body: {
          content: {
            'application/json': {
              schema: SignUpRequestSchema,
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Successfully created the new user.',
        },
        400: {
          description: 'One or more request fields are invalid.',
          content: {
            'application/json': {
              schema: z.object({
                message: z.string().openapi({
                  example: 'One or more validation errors ocurred.',
                }),
                errors: z.array(
                  z.object({
                    field: z.string().openapi({ example: 'email' }),
                    messages: z.array(z.string()).openapi({
                      example: ['Email already exists.'],
                    }),
                  })
                ),
              }),
            },
          },
        },
      },
    }),
    // Route handler
    async (c) => {
      const { name, email, password } = c.req.valid('json')

      const result = await mediator.send(
        new SignUpUserCommand(name, email, password)
      )

      return result.toApiResponse()
    }
  )
}
