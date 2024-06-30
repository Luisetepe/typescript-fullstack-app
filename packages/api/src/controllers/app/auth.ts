import { CheckUserLoginQuery } from '@/features/auth/checkUserLogin'
import { SignUpUserCommand } from '@/features/auth/signUpUser'
import type { IAuthService } from '@/infrastructure/auth/service'
import type { Context } from '@/utils/types/context'
import {
  loginRequestSchema,
  signUpRequestSchema,
} from '@fullstack-monorepo/lib/contracts/endpoints/app/auth'
import { zValidator } from '@hono/zod-validator'
import type { Mediator } from '@myty/jimmy'
import { Hono } from 'hono'

export function AppAuthController(
  mediator: Mediator,
  authService: IAuthService
) {
  const app = new Hono<Context>()

  //* POST /app/auth/login
  app.post('/login', zValidator('json', loginRequestSchema), async (c) => {
    const currentSession = c.get('session')
    if (currentSession) {
      return c.json({ message: 'Already logged in' }, 400)
    }

    const { email, password } = c.req.valid('json')

    const result = await mediator.send(new CheckUserLoginQuery(email, password))

    const { body, status, success } = result.toApiResponse()

    if (!success) {
      return c.json(body, status)
    }

    const session = await authService.createSession(result.value!.id, {})
    c.header(
      'Set-Cookie',
      authService.createSessionCookie(session.id).serialize(),
      {
        append: true,
      }
    )

    return c.json(body, status)
  })

  //* POST /app/auth/signup
  app.post('/signup', zValidator('json', signUpRequestSchema), async (c) => {
    const { name, email, password } = c.req.valid('json')

    const result = await mediator.send(
      new SignUpUserCommand(name, email, password)
    )
    const { body, status } = result.toApiResponse()

    return c.json(body, status)
  })

  //* POST /app/auth/logout
  app.post('/logout', async (c) => {
    const session = c.get('session')
    if (!session) {
      return c.json({ message: 'Unauthorized' }, 401)
    }

    await authService.invalidateSession(session.id)
    c.header('Set-Cookie', authService.createBlankSessionCookie().serialize())

    return c.body(null, 204)
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
