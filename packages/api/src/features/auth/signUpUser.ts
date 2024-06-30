import type { ICryptoService } from '@/infrastructure/crypto/service'
import type { DbContext } from '@/infrastructure/db/context'
import { USER_TABLE } from '@/infrastructure/db/schema/auth'
import { Result } from '@/utils/types/result'
import { Request } from '@myty/jimmy'
import { Xid } from 'xid-ts'

export class SignUpUserCommand extends Request<Promise<Result>> {
  constructor(
    public name: string,
    public email: string,
    public password: string
  ) {
    super()
  }
}

export function SignUpUserCommandHandler(
  dbContext: DbContext,
  cryptoService: ICryptoService
) {
  return async function (command: SignUpUserCommand) {
    try {
      const user = await dbContext.query.USER_TABLE.findFirst({
        columns: {
          id: true,
          email: true,
          password: true,
        },
        where: (users, { eq }) => eq(users.email, command.email),
      })

      if (!user) {
        return Result.Invalid([{ field: 'email', messages: 'Invalid email.' }])
      }

      const passwordHash = await cryptoService.hashPassword(command.password)
      await dbContext.insert(USER_TABLE).values({
        id: new Xid().toString(),
        name: command.name,
        email: command.email,
        password: passwordHash,
      })

      return Result.Created()
    } catch (error) {
      return Result.CriticalError('Failed to sign up user.')
    }
  }
}
