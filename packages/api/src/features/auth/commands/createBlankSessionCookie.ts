import type { Cookie, IAuthService } from '@/infrastructure/auth/service'
import { Result } from '@/utils/types/result'
import { Request } from '@myty/jimmy'

export class CreateBlankSessionCookieCommand extends Request<
  Promise<Result<Cookie>>
> {
  constructor() {
    super()
  }
}

export function CreateBlankSessionCookieCommandHandler(
  authService: IAuthService
) {
  return async function (_command: CreateBlankSessionCookieCommand) {
    try {
      const blankCookie = authService.createBlankSessionCookie()

      return Result.Success<Cookie>(blankCookie)
    } catch (error) {
      return Result.CriticalError<Cookie>(
        'Failed to create blank session cookie.'
      )
    }
  }
}
