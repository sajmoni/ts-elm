export type Ok<T> = {
  type: ResultType.Ok
  value: T
}

export type Err<T> = {
  type: ResultType.Err
  error: T
}

export type Result<Value, Error> = Ok<Value> | Err<Error>

enum ResultType {
  Ok = 'Ok',
  Err = 'Err',
}

export const err = <Error>(error: Error): Err<Error> => {
  return {
    type: ResultType.Err,
    error,
  }
}

export const ok = <T>(value: T): Ok<T> => {
  return {
    type: ResultType.Ok,
    value,
  }
}

const _match = <A, B, Error>(
  result: Result<A, Error>,
  onOk: (value: A) => Result<B, Error>,
  onError: (error: Error) => Result<A, Error>,
): Result<A, Error> | Result<B, Error> => {
  switch (result.type) {
    case ResultType.Ok:
      return onOk(result.value)
    case ResultType.Err:
      return onError(result.error)
  }
}

export const match = <A, B, Error>(
  result: Result<A, Error>,
  onOk: (value: A) => B | void,
  onError: (error: Error) => B | void,
): B | void => {
  switch (result.type) {
    case ResultType.Ok:
      return onOk(result.value)
    case ResultType.Err:
      return onError(result.error)
  }
}

/**
 * Apply a function to a result. If the result is Ok, it will be converted. If the result is an Err, the same error value will propagate through.
 */
export const map = <A, B, Error>(
  fn: (value: A) => B,
  result: Result<A, Error>,
): Result<B, Error> | Result<A, Error> => {
  return _match(
    result,
    (value) => ok(fn(value)),
    () => result,
  )
}

/**
 * Apply a function if both results are Ok. If not, the first Err will propagate through.
 */
export const map2 = <A, B, Value, Error>(
  fn: (valueA: A, valueB: B) => Value,
  resultA: Result<A, Error>,
  resultB: Result<B, Error>,
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
export const tap = <A, Error>(
  fn: (value: A) => void,
  result: Result<A, Error>,
): Result<A, Error> => {
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
export const andThen = <A, B, Error>(
  fn: (value: A) => Result<B, Error>,
  result: Result<A, Error>,
): Result<A, Error> | Result<B, Error> => {
  return _match(
    result,
    (value) => fn(value),
    () => result,
  )
}

/**
 * Transform an Err value
 */
export const mapError = <A, X, Y>(
  fn: (error: X) => Y,
  result: Result<A, X>,
): Result<A, Y> | Result<A, X> => {
  return _match(
    result,
    () => result,
    // @ts-expect-error Will fix later
    (error) => err(fn(error)),
  )
}

/**
 * If the result is Ok return the value, but if the result is an Err then return a given default value.
 */
export const withDefault = <A, Error>(
  defaultValue: A,
  result: Result<A, Error>,
): A => {
  return match(
    result,
    (value) => value,
    () => defaultValue,
  ) as A
}
