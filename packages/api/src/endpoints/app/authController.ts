import type { Context } from '@/utils/types/context'
import { OpenAPIHono } from '@hono/zod-openapi'
import type { Mediator } from '@myty/jimmy'
import { RegisterUserLoginEndpoint } from './auth/userLogin'
import { RegisterUserLogoutEndpoint } from './auth/userLogout'
import { RegisterUserSignupEndpoint } from './auth/userSignup'

export function AppAuthController(mediator: Mediator) {
  const app = new OpenAPIHono<Context>()

  RegisterUserLoginEndpoint(app, mediator)
  RegisterUserLogoutEndpoint(app, mediator)
  RegisterUserSignupEndpoint(app, mediator)

  return app
}
