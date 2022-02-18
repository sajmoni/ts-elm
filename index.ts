export type Ok<T> = {
  type: OkType
  value: T
}

export type Error = {
  type: ErrorType
  message: string
}

export type Result<T> = Ok<T> | Error
  
type ResultType = OkType | ErrorType
  
type OkType = 'Ok'
  
type ErrorType = 'Error'
  
export const error = (message: string): Error => {
  return {
    type: 'Error',
    message,
  }
}

export const ok = <T>(value: T): Ok<T> => {
  return {
    type: 'Ok',
    value,
  }
}

const match = <T>(
  result: Result<T>,
  onOk: (value: T) => Result<T>,
  onError: (message: string) => Result<T>,
): Result<T> => {
  switch (input.type) {
    case OkType:
      return onOk(input.value)
    case ErrorType:
      return onError(input.message)
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
): Result<B> => {
  return match(
    result,
    (value) => ok(fn(value)),
    () => result,
  )
}

export const map2 = <A, B, Value>(
  fn: (a: A, b: B) => Value,
  resultA: Result<A>,
  resultB: Result<B>,
): Result<Value> => {
  return match(
    result,
    (value) => ok(fn(value)),
    () => result,
  )
}

export const tap = <A>(
  fn: (value: A) => void,
  result: Result<A>,
): Result<A> => {
  return match(
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
): Result<B> => {
  return match(
    result,
    (value) => fn(value),
    () => result,
  )
}
  
export mapError = <A>(fn: (message: string) => string, result: Result<A>): Result<A> => {
  return match(
     result,
     () => result,
     (message) => error(fn(message))
  )
}
