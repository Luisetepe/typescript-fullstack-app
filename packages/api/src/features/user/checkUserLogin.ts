import type { DbContext } from '@/infrastructure/db/context'
import { Request } from '@myty/jimmy'

export class CheckUserLoginQuery extends Request<
  Promise<
    | {
        id: string
        email: string
        password: string
      }
    | undefined
  >
> {
  constructor(public email: string) {
    super()
  }
}

export function CheckUserLoginQueryHandler(dbContext: DbContext) {
  return async function (command: CheckUserLoginQuery) {
    const user = await dbContext.query.USER_TABLE.findFirst({
      columns: {
        id: true,
        email: true,
        password: true,
      },
      where: (users, { eq }) => eq(users.email, command.email),
    })

    return user
  }
}
