import type { CookieAttributes, Session, User } from 'lucia'
import { luciaAuthClient } from './client'

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

export interface Cookie {
  name: string
  value: string
  attributes: CookieAttributes
  serialize(): string
}

export function LuciaAuthService(): IAuthService {
  return {
    validateSession(sessionId: string) {
      return luciaAuthClient.validateSession(sessionId)
    },
    readSessionCookie(cookie: string) {
      return luciaAuthClient.readSessionCookie(cookie)
    },
    createSessionCookie(sessionId: string) {
      return luciaAuthClient.createSessionCookie(sessionId)
    },
    createBlankSessionCookie() {
      return luciaAuthClient.createBlankSessionCookie()
    },
    createSession(
      userId: string,
      attributes: Parameters<typeof luciaAuthClient.createSession>[1],
      options?: Parameters<typeof luciaAuthClient.createSession>[2]
    ) {
      return luciaAuthClient.createSession(userId, attributes, options)
    },
    invalidateSession(sessionId: string) {
      return luciaAuthClient.invalidateSession(sessionId)
    },
  }
}
