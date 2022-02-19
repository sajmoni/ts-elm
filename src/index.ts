export type Ok<T> = {
  type: ResultType.OkType
  value: T
}

export type Error = {
  type: ResultType.ErrorType
  message: string
}

export type Result<T> = Ok<T> | Error

enum ResultType {
  OkType = 'Ok',
  ErrorType = 'Error',
}

export const error = (message: string): Error => {
  return {
    type: ResultType.ErrorType,
    message,
  }
}

export const ok = <T>(value: T): Ok<T> => {
  return {
    type: ResultType.OkType,
    value,
  }
}

const _match = <A, B>(
  result: Result<A>,
  onOk: (value: A) => Result<B>,
  onError: (message: string) => Result<A>,
): Result<A> | Result<B> => {
  switch (result.type) {
    case ResultType.OkType:
      return onOk(result.value)
    case ResultType.ErrorType:
      return onError(result.message)
  }
}

export const match = <A, B>(
  result: Result<A>,
  onOk: (value: A) => B | void,
  onError: (message: string) => B | void,
): B | void => {
  switch (result.type) {
    case ResultType.OkType:
      return onOk(result.value)
    case ResultType.ErrorType:
      return onError(result.message)
  }
}

/**
 * Apply a function to a result. If the result is Ok, it will be converted. If the result is an Err, the same error value will propagate through.
 * @param fn
 * @param result
 * @returns
 */
export const map = <A, B>(
  fn: (value: A) => B,
  result: Result<A>,
): Result<B> | Result<A> => {
  return _match(
    result,
    (value) => ok(fn(value)),
    () => result,
  )
}

export const map2 = <A, B, Value>(
  fn: (valueA: A, valueB: B) => Value,
  resultA: Result<A>,
  resultB: Result<B>,
): any => {
  return _match(
    resultA,
    (valueA) => {
      switch (resultB.type) {
        case ResultType.OkType:
          return ok(fn(valueA, resultB.value))
        case ResultType.ErrorType:
          return resultB
      }
    },
    () => resultA,
  )
}

export const tap = <A>(
  fn: (value: A) => void,
  result: Result<A>,
): Result<A> => {
  return _match(
    result,
    (value) => {
      fn(value)
      return result
    },
    () => result,
  )
}

/**
 * Chain together a sequence of computations that may fail
 * @param fn
 * @param result
 * @returns
 */
export const andThen = <A, B>(
  fn: (value: A) => Result<B>,
  result: Result<A>,
): Result<A> | Result<B> => {
  return _match(
    result,
    (value) => fn(value),
    () => result,
  )
}

export const mapError = <A>(
  fn: (message: string) => string,
  result: Result<A>,
): Result<A> => {
  return _match(
    result,
    () => result,
    (message) => error(fn(message)),
  )
}

export const withDefault = <A>(
  defaultValue: A,
  result: Result<A>,
): Result<A> => {
  return _match(
    result,
    () => result,
    () => ok(defaultValue),
  )
}
