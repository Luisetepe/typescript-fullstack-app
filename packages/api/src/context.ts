import type { Env } from 'bun'
import type { Session, User } from 'lucia'

export interface Context extends Env {
  Variables: {
    user: User | null
    session: Session | null
  }
}
