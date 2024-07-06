import { AppAuthController } from '@/endpoints/app/authController'
import { environment } from '@/env'
import { ApiMediator } from '@/features/mediator'
import { LuciaAuthService } from '@/infrastructure/auth/service'
import { CryptoService } from '@/infrastructure/crypto/service'
import { AppDbContext } from '@/infrastructure/db/context'
import { SessionCookieMiddleware } from '@/infrastructure/middlewares/sessionCookie'
import type { Context } from '@/utils/types/context'
import { swaggerUI } from '@hono/swagger-ui'
import { OpenAPIHono } from '@hono/zod-openapi'
import { serveStatic } from 'hono/bun'

//* Dependency building
const authService = LuciaAuthService()
const cryptoService = CryptoService()
const appDbContext = AppDbContext()
const mediator = ApiMediator(appDbContext, cryptoService, authService)

//* ----------------Configure api server----------------
const app = new OpenAPIHono<Context>()

// Configure global app middlewares
app.use(SessionCookieMiddleware(authService))

// Configure app routes
app.route('/app/auth', AppAuthController(mediator))

// Configure api routes
// /api/ routes here...

// The OpenAPI documentation will be available at /doc
app.doc('/openapi', {
  openapi: '3.0.0',
  info: {
    version: '0.0.1',
    title: 'Fullstack Monorepo API',
  },
})
// Use the middleware to serve Swagger UI at /ui
app.get('/swagger', swaggerUI({ url: '/openapi' }))

// Configure static file serving for the frontend SPA
app.use('/*', serveStatic({ root: './static' }))
app.use('*', serveStatic({ path: './static/index.html' }))

export default {
  port: environment.PORT,
  fetch: app.fetch,
}

//* ----------------------------------------------------
