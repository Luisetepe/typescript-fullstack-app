import {
  CreateBlankSessionCookieCommand,
  CreateBlankSessionCookieCommandHandler,
} from '@/features/auth/commands/createBlankSessionCookie'
import {
  CreateUserSessionCookieCommand,
  CreateUserSessionCookieCommandHandler,
} from '@/features/auth/commands/createUserSessionCookie'
import {
  InvalidateUserSessionCommand,
  InvalidateUserSessionCommandHandler,
} from '@/features/auth/commands/invalidateUserSession'
import {
  SignUpUserCommand,
  SignUpUserCommandHandler,
} from '@/features/auth/commands/signUpUser'
import type { IAuthService } from '@/infrastructure/auth/service'
import type { ICryptoService } from '@/infrastructure/crypto/service'
import type { DbContext } from '@/infrastructure/db/context'
import { Mediator } from '@myty/jimmy'

export function ApiMediator(
  dbContext: DbContext,
  cryptoService: ICryptoService,
  authService: IAuthService
) {
  const mediator = new Mediator()

  mediator.handle(
    CreateUserSessionCookieCommand,
    CreateUserSessionCookieCommandHandler(dbContext, cryptoService, authService)
  )
  mediator.handle(
    SignUpUserCommand,
    SignUpUserCommandHandler(dbContext, cryptoService)
  )
  mediator.handle(
    InvalidateUserSessionCommand,
    InvalidateUserSessionCommandHandler(authService)
  )
  mediator.handle(
    CreateBlankSessionCookieCommand,
    CreateBlankSessionCookieCommandHandler(authService)
  )

  return mediator
}
