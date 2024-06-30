export enum ResultStatus {
  Ok,
  Created,
  Error,
  Forbidden,
  Unauthorized,
  Invalid,
  NotFound,
  NoContent,
  Conflict,
  CriticalError,
  Unavailable,
}

export type ValidationError = {
  field: string
  messages: string[] | string
}

export class Result<T = null> {
  private _value: T | null
  private _status: ResultStatus

  private _errorMessage: string
  private _validationErrors: ValidationError[] = []

  get value(): T | null {
    return this._value
  }
  get status(): ResultStatus {
    return this._status
  }
  get errorMessage(): string {
    return this._errorMessage
  }
  get validationErrors(): ValidationError[] {
    return this._validationErrors
  }

  private constructor(status: ResultStatus) {
    this._status = status
  }

  static Success<T = null>(value: T | null = null): Result<T> {
    const result = new Result<T>(ResultStatus.Ok)
    result._value = value

    return result
  }
  static Created<T = null>(value: T | null = null): Result<T> {
    const result = new Result<T>(ResultStatus.Created)
    result._value = value

    return result
  }
  static Error<T = null>(errorMessage?: string): Result<T> {
    const result = new Result<T>(ResultStatus.Error)
    result._errorMessage =
      errorMessage ?? 'The data provided could not be processed.'

    return result
  }
  static Forbidden<T = null>(errorMessage?: string): Result<T> {
    const result = new Result<T>(ResultStatus.Forbidden)
    result._errorMessage =
      errorMessage ?? 'Insufficient permissions to perform this action.'

    return result
  }
  static Unauthorized<T = null>(errorMessage?: string): Result<T> {
    const result = new Result<T>(ResultStatus.Unauthorized)
    result._errorMessage =
      errorMessage ?? 'You are not authorized to perform this action.'

    return result
  }
  static Invalid<T = null>(validationErrors: ValidationError[]): Result<T> {
    const result = new Result<T>(ResultStatus.Invalid)
    result._errorMessage = 'One or more validation errors ocurred.'
    result._validationErrors = validationErrors

    return result
  }
  static NotFound<T = null>(errorMessage?: string): Result<T> {
    const result = new Result<T>(ResultStatus.NotFound)
    result._errorMessage =
      errorMessage ?? 'Resource requested could not be found.'

    return result
  }
  static NoContent<T = null>(): Result<T> {
    return new Result<T>(ResultStatus.NoContent)
  }
  static Conflict<T = null>(errorMessage: string): Result<T> {
    const result = new Result<T>(ResultStatus.Conflict)
    result._errorMessage =
      errorMessage ??
      'Request was in conflict with the current state of the system.'

    return result
  }
  static CriticalError<T = null>(errorMessage: string): Result<T> {
    const result = new Result<T>(ResultStatus.CriticalError)
    result._errorMessage = errorMessage ?? 'An unrecoverable error ocurred.'

    return result
  }
  static Unavailable<T = null>(errorMessage: string): Result<T> {
    const result = new Result<T>(ResultStatus.Unavailable)
    result._errorMessage = errorMessage ?? 'Service is currently unavailable.'

    return result
  }

  isSuccess(): boolean {
    return (
      this.status === ResultStatus.Ok ||
      this.status === ResultStatus.Created ||
      this.status === ResultStatus.NoContent
    )
  }

  toApiResponse(): Response {
    switch (this.status) {
      case ResultStatus.Ok:
        return new Response(this._value ? JSON.stringify(this._value) : null, {
          status: 200,
        })
      case ResultStatus.Created:
        return new Response(this._value ? JSON.stringify(this._value) : null, {
          status: 201,
        })
      case ResultStatus.NoContent:
        return new Response(null, { status: 204 })
      case ResultStatus.Error:
        return new Response(JSON.stringify({ message: this._errorMessage }), {
          status: 422,
        })
      case ResultStatus.Forbidden:
        return new Response(JSON.stringify({ message: this._errorMessage }), {
          status: 403,
        })
      case ResultStatus.Unauthorized:
        return new Response(JSON.stringify({ message: this._errorMessage }), {
          status: 401,
        })
      case ResultStatus.Invalid:
        return new Response(JSON.stringify({ message: this._errorMessage }), {
          status: 400,
        })
      case ResultStatus.NotFound:
        return new Response(JSON.stringify({ message: this._errorMessage }), {
          status: 404,
        })
      case ResultStatus.Conflict:
        return new Response(JSON.stringify({ message: this._errorMessage }), {
          status: 409,
        })
      case ResultStatus.CriticalError:
        return new Response(JSON.stringify({ message: this._errorMessage }), {
          status: 500,
        })
      case ResultStatus.Unavailable:
        return new Response(JSON.stringify({ message: this._errorMessage }), {
          status: 503,
        })
      default:
        return new Response(JSON.stringify({ message: this._errorMessage }), {
          status: 500,
        })
    }
  }
}
