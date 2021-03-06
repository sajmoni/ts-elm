import test from 'ava'

import * as elm from 'ts-elm'

test('map', (t) => {
  const result = elm.ok('This is ok')

  t.deepEqual(
    elm.map((value) => `${value} still`, result),
    elm.ok('This is ok still'),
  )
})

test('mapError', (t) => {
  const result = elm.err('This is an error')

  t.deepEqual(
    elm.mapError((message) => `${message} still`, result),
    elm.err('This is an error still'),
  )
})

test('withDefault', (t) => {
  const result = elm.err('This is an error')

  t.is(elm.withDefault(10, result), 10)

  const result2 = elm.ok(20)

  t.is(elm.withDefault(10, result2), 20)
})

test('tap', (t) => {
  const result = elm.ok('This is ok')

  t.deepEqual(
    elm.tap(() => {
      // No return
    }, result),
    elm.ok('This is ok'),
  )
})

test('map2', (t) => {
  const result1 = elm.ok(5)
  const result2 = elm.ok(7)

  const add = (a: number, b: number) => a + b

  t.deepEqual(
    elm.map2((a, b) => add(a, b), result1, result2),
    elm.ok(12),
  )
})

test('andThen', (t) => {
  const errorMessage = 'Could not parse integer from string'

  const parseIntResult = (
    maybeInt: string,
  ): elm.Result<number | undefined, string | undefined> => {
    const integer = Number.parseInt(maybeInt, 10)

    return typeof integer === 'number' && !Number.isNaN(integer)
      ? elm.ok(integer)
      : elm.err(errorMessage)
  }

  const result1 = elm.ok('123')
  t.deepEqual(
    elm.andThen((value) => parseIntResult(value), result1),
    elm.ok(123),
  )

  const result2 = elm.ok('Not a number')
  t.deepEqual(
    elm.andThen((value) => parseIntResult(value), result2),
    elm.err(errorMessage),
  )
})
