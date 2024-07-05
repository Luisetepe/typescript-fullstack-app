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

const jsonHeaders = {
  'Content-Type': 'application/json; charset=UTF-8',
}

export type ValidationError =
  | {
      field: string
      messages: string[]
    }
  | string

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

  toApiResponse(additionalHeaders?: Record<string, string>): Response {
    const headers = new Headers(jsonHeaders)
    for (const [k, v] of Object.entries(additionalHeaders ?? {})) {
      if (k === 'set-cookie') {
        headers.append(k, v)
      } else {
        headers.set(k, v)
      }
    }

    switch (this.status) {
      case ResultStatus.Ok:
        return new Response(this._value ? JSON.stringify(this._value) : null, {
          status: 200,
          headers,
        })
      case ResultStatus.Created:
        return new Response(this._value ? JSON.stringify(this._value) : null, {
          status: 201,
          headers,
        })
      case ResultStatus.NoContent:
        return new Response(null, {
          status: 204,
          headers,
        })
      case ResultStatus.Error:
        return new Response(JSON.stringify({ message: this._errorMessage }), {
          status: 422,
          headers,
        })
      case ResultStatus.Forbidden:
        return new Response(JSON.stringify({ message: this._errorMessage }), {
          status: 403,
          headers,
        })
      case ResultStatus.Unauthorized:
        return new Response(JSON.stringify({ message: this._errorMessage }), {
          status: 401,
          headers,
        })
      case ResultStatus.Invalid:
        return new Response(
          JSON.stringify({
            message: this._errorMessage,
            errors: this._validationErrors,
          }),
          {
            status: 400,
            headers,
          }
        )
      case ResultStatus.NotFound:
        return new Response(JSON.stringify({ message: this._errorMessage }), {
          status: 404,
          headers,
        })
      case ResultStatus.Conflict:
        return new Response(JSON.stringify({ message: this._errorMessage }), {
          status: 409,
          headers,
        })
      case ResultStatus.CriticalError:
        return new Response(JSON.stringify({ message: this._errorMessage }), {
          status: 500,
          headers,
        })
      case ResultStatus.Unavailable:
        return new Response(JSON.stringify({ message: this._errorMessage }), {
          status: 503,
          headers,
        })
      default:
        return new Response(JSON.stringify({ message: this._errorMessage }), {
          status: 500,
          headers,
        })
    }
  }
}
