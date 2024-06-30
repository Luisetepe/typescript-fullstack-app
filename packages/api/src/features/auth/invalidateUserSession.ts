import type { IAuthService } from '@/infrastructure/auth/service'
import { Result } from '@/utils/types/result'
import { Request } from '@myty/jimmy'

export class InvalidateUserSessionCommand extends Request<Promise<Result>> {
  constructor(public readonly sessionId: string) {
    super()
  }
}

export function InvalidateUserSessionCommandHandler(authService: IAuthService) {
  return async function (command: InvalidateUserSessionCommand) {
    try {
      await authService.invalidateSession(command.sessionId)

      return Result.Success()
    } catch (error) {
      return Result.CriticalError('Failed to invalidate user session.')
    }
  }
}
