import type { DbContext } from '@/infrastructure/db/context'
import { USER_TABLE } from '@/infrastructure/db/schema/auth'
import { Request } from '@myty/jimmy'
import { Xid } from 'xid-ts'

export class SignUpUserCommand extends Request<Promise<void>> {
  constructor(
    public name: string,
    public email: string,
    public password: string
  ) {
    super()
  }
}

export function SignUpUserCommandHandler(dbContext: DbContext) {
  return async function (command: SignUpUserCommand) {
    await dbContext.insert(USER_TABLE).values({
      id: new Xid().toString(),
      name: command.name,
      email: command.email,
      password: command.password,
    })
  }
}
