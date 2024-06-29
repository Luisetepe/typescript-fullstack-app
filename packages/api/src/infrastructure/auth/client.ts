import { env } from '@/env'
import { authAdapter } from '@/infrastructure/db/context'
import { Lucia } from 'lucia'

export const luciaAuthClient = new Lucia(authAdapter, {
  sessionCookie: {
    attributes: {
      // set to `true` when using HTTPS
      secure: env.NODE_ENV === 'production',
      path: '/app',
    },
  },
})

declare module 'lucia' {
  interface Register {
    Lucia: typeof luciaAuthClient
  }
}
