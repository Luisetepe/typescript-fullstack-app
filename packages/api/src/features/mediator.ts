import {
  CheckUserLoginQuery,
  CheckUserLoginQueryHandler,
} from '@/features/user/checkUserLogin'
import {
  SignUpUserCommand,
  SignUpUserCommandHandler,
} from '@/features/user/signUpUser'
import { dbContext } from '@/infrastructure/db/context'
import { Mediator } from '@myty/jimmy'

const mediator = new Mediator()

mediator.handle(CheckUserLoginQuery, CheckUserLoginQueryHandler(dbContext))
mediator.handle(SignUpUserCommand, SignUpUserCommandHandler(dbContext))

export default mediator
