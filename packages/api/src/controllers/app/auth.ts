import type { Context } from '@/context'
import { CheckUserLoginQuery } from '@/features/user/checkUserLogin'
import { SignUpUserCommand } from '@/features/user/signUpUser'
import type { IAuthService } from '@/infrastructure/auth/service'
import type { ICryptoService } from '@/infrastructure/crypto/service'
import {
  loginRequestSchema,
  signUpRequestSchema,
} from '@fullstack-monorepo/lib/contracts/endpoints/app/auth'
import { zValidator } from '@hono/zod-validator'
import type { Mediator } from '@myty/jimmy'
import { Hono } from 'hono'

export function AppAuthController(
  mediator: Mediator,
  authService: IAuthService,
  cryptoService: ICryptoService
) {
  const app = new Hono<Context>()

  //* POST /app/auth/login
  app.post('/login', zValidator('json', loginRequestSchema), async (c) => {
    const currentSession = c.get('session')
    if (currentSession) {
      return c.json({ message: 'Already logged in' }, 400)
    }

    const { email, password } = c.req.valid('json')

    const existingUser = await mediator.send(new CheckUserLoginQuery(email))
    if (!existingUser) {
      return c.json({ message: 'Invalid user or password' }, 401)
    }

    const validPassword = await cryptoService.verifyPassword(
      password,
      existingUser.password
    )
    if (!validPassword) {
      return c.json({ message: 'Invalid user or password' }, 401)
    }

    const session = await authService.createSession(existingUser.id, {})
    c.header(
      'Set-Cookie',
      authService.createSessionCookie(session.id).serialize(),
      {
        append: true,
      }
    )

    return c.body(null, 204)
  })

  //* POST /app/auth/signup
  app.post('/signup', zValidator('json', signUpRequestSchema), async (c) => {
    const { name, email, password } = c.req.valid('json')

    const existingUser = await mediator.send(new CheckUserLoginQuery(email))
    if (existingUser) {
      return c.json({ message: 'Invalid new user info' }, 400)
    }

    const passwordHash = await cryptoService.hashPassword(password)

    await mediator.send(new SignUpUserCommand(name, email, passwordHash))
    return c.body(null, 201)
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
