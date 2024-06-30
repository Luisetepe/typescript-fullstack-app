import {
  CreateBlankSessionCookieCommand,
  CreateBlankSessionCookieCommandHandler,
} from '@/features/auth/createBlankSessionCookie'
import {
  CreateUserSessionCookieCommand,
  CreateUserSessionCookieCommandHandler,
} from '@/features/auth/createUserSessionCookie'
import {
  InvalidateUserSessionCommand,
  InvalidateUserSessionCommandHandler,
} from '@/features/auth/invalidateUserSession'
import {
  SignUpUserCommand,
  SignUpUserCommandHandler,
} from '@/features/auth/signUpUser'
import type { IAuthService } from '@/infrastructure/auth/service'
import type { ICryptoService } from '@/infrastructure/crypto/service'
import type { DbContext } from '@/infrastructure/db/context'
import { Mediator } from '@myty/jimmy'

export function CreateMediator(
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
