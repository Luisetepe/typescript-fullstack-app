import { AppAuthController } from '@/controllers/app/auth'
import { environment } from '@/env'
import { ApiMediator } from '@/features/mediator'
import { LuciaAuthService } from '@/infrastructure/auth/service'
import { CryptoService } from '@/infrastructure/crypto/service'
import { AppDbContext } from '@/infrastructure/db/context'
import { SessionCookieMiddleware } from '@/infrastructure/middlewares/sessionCookie'
import type { Context } from '@/utils/types/context'
import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'

//* Dependency building
const authService = LuciaAuthService()
const cryptoService = CryptoService()
const appDbContext = AppDbContext()
const mediator = ApiMediator(appDbContext, cryptoService, authService)

//* ----------------Configure api server----------------
const app = new Hono<Context>()

// Configure global app middlewares
app.use(SessionCookieMiddleware(authService))

// Configure app routes
app.route('/app/auth', AppAuthController(mediator))

// Configure api routes
// /api/ routes here...

// Configure static file serving for the frontend SPA
app.use('/*', serveStatic({ root: './static' }))
app.use('*', serveStatic({ path: './static/index.html' }))

export default {
  port: environment.PORT,
  fetch: app.fetch,
}

//* ----------------------------------------------------
