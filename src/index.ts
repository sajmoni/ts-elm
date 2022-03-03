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

/**
 * Internal match that returns a result
 */
const _match = <A, Value, X, Error>(
  result: Result<A, X>,
  onOk: (value: A) => Result<Value, X>,
  onError: (error: X) => Result<A, Error>,
): Result<A | Value, X | Error> => {
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
export const map = <A, Value, X>(
  fn: (value: A) => Value,
  result: Result<A, X>,
): Result<A | Value, X> => {
  return _match(
    result,
    (value) => ok(fn(value)),
    () => result,
  )
}

/**
 * Apply a function if both results are Ok. If not, the first Err will propagate through.
 */
export const map2 = <A, B, Value, X>(
  fn: (valueA: A, valueB: B) => Value,
  resultA: Result<A, X>,
  resultB: Result<B, X>,
): Result<A | B | Value, X> => {
  return _match(
    resultA,
    (valueA) => {
      return _match(
        resultB,
        (valueB) => ok(fn(valueA, valueB)),
        () => resultB,
      )
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
): Result<A | B, Error> => {
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
): Result<A, X | Y> => {
  return _match(
    result,
    () => result,
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
