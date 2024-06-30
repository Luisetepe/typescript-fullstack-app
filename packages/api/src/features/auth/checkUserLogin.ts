import type { ICryptoService } from '@/infrastructure/crypto/service'
import type { DbContext } from '@/infrastructure/db/context'
import { Result } from '@/utils/types/result'
import { Request } from '@myty/jimmy'

type CheckUserLoginQueryResponse =
  | {
      id: string
      email: string
      password: string
    }
  | undefined

export class CheckUserLoginQuery extends Request<
  Promise<Result<CheckUserLoginQueryResponse>>
> {
  constructor(
    public email: string,
    public password: string
  ) {
    super()
  }
}

export function CheckUserLoginQueryHandler(
  dbContext: DbContext,
  cryptoService: ICryptoService
) {
  return async function (
    command: CheckUserLoginQuery
  ): Promise<Result<CheckUserLoginQueryResponse>> {
    const user = await dbContext.query.USER_TABLE.findFirst({
      columns: {
        id: true,
        email: true,
        password: true,
      },
      where: (users, { eq }) => eq(users.email, command.email),
    })

    if (!user) {
      return Result.Unauthorized(['Invalid user or password'])
    }

    const validPassword = await cryptoService.verifyPassword(
      command.password,
      user.password
    )
    if (!validPassword) {
      return Result.Unauthorized(['Invalid user or password'])
    }

    return Result.Success(user)
  }
}
