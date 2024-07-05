import type { Cookie, IAuthService } from '@/infrastructure/auth/service'
import type { ICryptoService } from '@/infrastructure/crypto/service'
import type { DbContext } from '@/infrastructure/db/context'
import { Result } from '@/utils/types/result'
import { Request } from '@myty/jimmy'

export class CreateUserSessionCookieCommand extends Request<
  Promise<Result<Cookie>>
> {
  constructor(
    public email: string,
    public password: string
  ) {
    super()
  }
}

export function CreateUserSessionCookieCommandHandler(
  dbContext: DbContext,
  cryptoService: ICryptoService,
  authService: IAuthService
) {
  return async function (command: CreateUserSessionCookieCommand) {
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
        return Result.Unauthorized<Cookie>('Invalid user or password.')
      }

      const validPassword = await cryptoService.verifyPassword(
        command.password,
        user.password
      )
      if (!validPassword) {
        return Result.Unauthorized<Cookie>('Invalid user or password.')
      }

      const session = await authService.createSession(user.id, {})
      const cookie = authService.createSessionCookie(session.id)

      return Result.Success<Cookie>(cookie)
    } catch (error) {
      return Result.CriticalError<Cookie>('Failed to create session cookie.')
    }
  }
}
