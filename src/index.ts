export type Ok<T> = {
  type: ResultType.Ok
  value: T
}

export type Err = {
  type: ResultType.Err
  message: string
}

export type Result<T> = Ok<T> | Err

enum ResultType {
  Ok = 'Ok',
  Err = 'Err',
}

export const err = (message: string): Err => {
  return {
    type: ResultType.Err,
    message,
  }
}

export const ok = <T>(value: T): Ok<T> => {
  return {
    type: ResultType.Ok,
    value,
  }
}

const _match = <A, B>(
  result: Result<A>,
  onOk: (value: A) => Result<B>,
  onError: (message: string) => Result<A>,
): Result<A> | Result<B> => {
  switch (result.type) {
    case ResultType.Ok:
      return onOk(result.value)
    case ResultType.Err:
      return onError(result.message)
  }
}

export const match = <A, B>(
  result: Result<A>,
  onOk: (value: A) => B | void,
  onError: (message: string) => B | void,
): B | void => {
  switch (result.type) {
    case ResultType.Ok:
      return onOk(result.value)
    case ResultType.Err:
      return onError(result.message)
  }
}

/**
 * Apply a function to a result. If the result is Ok, it will be converted. If the result is an Err, the same error value will propagate through.
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

/**
 * Apply a function if both results are Ok. If not, the first Err will propagate through.
 */
export const map2 = <A, B, Value>(
  fn: (valueA: A, valueB: B) => Value,
  resultA: Result<A>,
  resultB: Result<B>,
): any => {
  return _match(
    resultA,
    (valueA) => {
      switch (resultB.type) {
        case ResultType.Ok:
          return ok(fn(valueA, resultB.value))
        case ResultType.Err:
          return resultB
      }
    },
    () => resultA,
  )
}

/**
 * Execute a side effect without affecting the underlying result
 *
 * This is for obvious reasons not included in the original Elm API
 */
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

/**
 * Transform an Err value
 */
export const mapError = <A>(
  fn: (message: string) => string,
  result: Result<A>,
): Result<A> => {
  return _match(
    result,
    () => result,
    (message) => err(fn(message)),
  )
}

/**
 * If the result is Ok return the value, but if the result is an Err then return a given default value.
 */
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
