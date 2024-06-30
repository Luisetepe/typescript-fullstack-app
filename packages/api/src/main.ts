import type { Context } from '@/context'
import { AppAuthController } from '@/controllers/app/auth'
import { env } from '@/env'
import mediator from '@/features/mediator'
import { LuciaAuthService } from '@/infrastructure/auth/service'
import { CryptoService } from '@/infrastructure/crypto/service'
import { SessionCookieMiddleware } from '@/infrastructure/middlewares/sessionCookie'
import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'

//* Dependency building
const authService = new LuciaAuthService()
const cryptoService = new CryptoService()

//* ----------------Configure api server----------------
const app = new Hono<Context>()

// Configure global app middlewares
app.use(SessionCookieMiddleware(authService))

// Configure app routes
app.route('/app/auth', AppAuthController(mediator, authService, cryptoService))

// Configure api routes
// /api/ routes here...

// Configure static file serving for the frontend SPA
app.use('/*', serveStatic({ root: './static' }))
app.use('*', serveStatic({ path: './static/index.html' }))

export default {
  port: env.PORT,
  fetch: app.fetch,
}

//* ----------------------------------------------------
