import {
  CheckUserLoginQuery,
  CheckUserLoginQueryHandler,
} from '@/features/auth/checkUserLogin'
import {
  SignUpUserCommand,
  SignUpUserCommandHandler,
} from '@/features/auth/signUpUser'
import type { ICryptoService } from '@/infrastructure/crypto/service'
import type { DbContext } from '@/infrastructure/db/context'
import { Mediator } from '@myty/jimmy'

export function CreateMediator(
  dbContext: DbContext,
  cryptoService: ICryptoService
) {
  const mediator = new Mediator()

  mediator.handle(
    CheckUserLoginQuery,
    CheckUserLoginQueryHandler(dbContext, cryptoService)
  )
  mediator.handle(
    SignUpUserCommand,
    SignUpUserCommandHandler(dbContext, cryptoService)
  )

  return mediator
}
