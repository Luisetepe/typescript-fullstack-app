import type { StatusCode } from 'hono/utils/http-status'

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

export class Result<T = void> {
  private _value?: T extends void ? never : T
  private _status: ResultStatus

  private _errors: string[] = []
  private _validationErrors: ValidationError[] = []

  get value(): T | undefined {
    return this._value
  }
  get status(): ResultStatus {
    return this._status
  }
  get errors(): string[] {
    return this._errors
  }
  get validationErrors(): ValidationError[] {
    return this._validationErrors
  }

  private constructor(status: ResultStatus) {
    this._status = status
  }

  static Success<T>(value?: T extends void ? never : T): Result<T> {
    const result = new Result<T>(ResultStatus.Ok)
    result._value = value

    return result
  }
  static Created<T = void>(value?: T): Result<T> {
    const result = new Result<T>(ResultStatus.Created)
    result._value = value

    return result
  }
  static Error<T = void>(message: string): Result<T> {
    const result = new Result<T>(ResultStatus.Error)
    result._errors = [message]

    return result
  }
  static Forbidden<T = void>(errorMessages: string[] = []): Result<T> {
    const result = new Result<T>(ResultStatus.Forbidden)
    result._errors = errorMessages

    return result
  }
  static Unauthorized<T = void>(errorMessages: string[] = []): Result<T> {
    const result = new Result<T>(ResultStatus.Unauthorized)
    result._errors = errorMessages

    return result
  }
  static Invalid<T = void>(validationErrors: ValidationError[]): Result<T> {
    const result = new Result<T>(ResultStatus.Invalid)
    result._validationErrors = validationErrors

    return result
  }
  static NotFound<T = void>(errorMessages: string[] = []): Result<T> {
    const result = new Result<T>(ResultStatus.NotFound)
    result._errors = errorMessages

    return result
  }
  static NoContent<T = void>(): Result<T> {
    return new Result<T>(ResultStatus.NoContent)
  }
  static Conflict<T = void>(errorMessages: string[] = []): Result<T> {
    const result = new Result<T>(ResultStatus.Conflict)
    result._errors = errorMessages

    return result
  }
  static CriticalError<T = void>(errorMessages: string[] = []): Result<T> {
    const result = new Result<T>(ResultStatus.CriticalError)
    result._errors = errorMessages

    return result
  }
  static Unavailable<T = void>(errorMessages: string[] = []): Result<T> {
    const result = new Result<T>(ResultStatus.Unavailable)
    result._errors = errorMessages

    return result
  }

  isSuccess(): boolean {
    return (
      this.status === ResultStatus.Ok ||
      this.status === ResultStatus.Created ||
      this.status === ResultStatus.NoContent
    )
  }

  mapTo<U>(fn: (value: T) => U): Result<U> {
    if (this.isSuccess() && this.value !== undefined) {
      return Result.Success(fn(this.value as T))
    }

    return new Result<U>(this.status)
  }

  toApiResponse(): {
    status: StatusCode
    body: { errors: string[] } | T | null | { errors: ValidationError[] }
    success: boolean
  } {
    switch (this.status) {
      case ResultStatus.Ok:
        return { status: 200, body: this.value ?? null, success: true }
      case ResultStatus.Created:
        return { status: 201, body: this.value ?? null, success: true }
      case ResultStatus.NoContent:
        return { status: 204, body: null, success: true }
      case ResultStatus.Error:
        return { status: 500, body: { errors: this.errors }, success: false }
      case ResultStatus.Forbidden:
        return { status: 403, body: { errors: this.errors }, success: false }
      case ResultStatus.Unauthorized:
        return { status: 401, body: { errors: this.errors }, success: false }
      case ResultStatus.Invalid:
        return {
          status: 400,
          body: { errors: this.validationErrors },
          success: false,
        }
      case ResultStatus.NotFound:
        return { status: 404, body: { errors: this.errors }, success: false }
      case ResultStatus.Conflict:
        return { status: 409, body: { errors: this.errors }, success: false }
      case ResultStatus.CriticalError:
        return { status: 500, body: { errors: this.errors }, success: false }
      case ResultStatus.Unavailable:
        return { status: 503, body: { errors: this.errors }, success: false }
      default:
        return {
          status: 500,
          body: { errors: ['Unknown error'] },
          success: false,
        }
    }
  }
}
