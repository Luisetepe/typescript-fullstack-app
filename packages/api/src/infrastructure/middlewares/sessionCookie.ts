import type { IAuthService } from '@/infrastructure/auth/service'
import type { Context, Next } from 'hono'

export function SessionCookieMiddleware(authService: IAuthService) {
  return async function (c: Context, next: Next) {
    const cookie = c.req.header('Cookie') ?? ''
    const sessionId = authService.readSessionCookie(cookie)
    if (!sessionId) {
      c.set('user', null)
      c.set('session', null)
      return next()
    }

    const { session, user } = await authService.validateSession(sessionId)
    if (session && session.fresh) {
      c.header(
        'Set-Cookie',
        authService.createSessionCookie(session.id).serialize(),
        {
          append: true,
        }
      )
    }
    if (!session) {
      c.header(
        'Set-Cookie',
        authService.createBlankSessionCookie().serialize(),
        {
          append: true,
        }
      )
    }
    c.set('session', session)
    c.set('user', user)
    return next()
  }
}
