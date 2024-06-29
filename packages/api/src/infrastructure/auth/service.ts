import type { Cookie, Session, User } from 'lucia'
import type { luciaAuthClient } from './client'

export interface IAuthService {
  validateSession(
    sessionId: string
  ): Promise<{ session: Session | null; user: User | null }>
  readSessionCookie(cookie: string): string | null
  createSessionCookie(sessionId: string): Cookie
  createBlankSessionCookie(): Cookie
  createSession(
    userId: string,
    attributes: Parameters<typeof luciaAuthClient.createSession>[1],
    options?: Parameters<typeof luciaAuthClient.createSession>[2]
  ): Promise<Session>
  invalidateSession(sessionId: string): Promise<void>
}

export class AuthService implements IAuthService {
  constructor(private readonly authClient: typeof luciaAuthClient) {}

  validateSession(sessionId: string) {
    return this.authClient.validateSession(sessionId)
  }
  readSessionCookie(cookie: string) {
    return this.authClient.readSessionCookie(cookie)
  }
  createSessionCookie(sessionId: string) {
    return this.authClient.createSessionCookie(sessionId)
  }
  createBlankSessionCookie() {
    return this.authClient.createBlankSessionCookie()
  }
  createSession(
    userId: string,
    attributes: Parameters<typeof luciaAuthClient.createSession>[1],
    options?: Parameters<typeof luciaAuthClient.createSession>[2]
  ) {
    return this.authClient.createSession(userId, attributes, options)
  }
  invalidateSession(sessionId: string) {
    return this.authClient.invalidateSession(sessionId)
  }
}
