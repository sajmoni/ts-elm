import test from 'ava'

import * as elm from 'ts-elm'

test('map', (t) => {
  const result = elm.ok('This is ok')

  t.deepEqual(
    elm.map((value) => `${value} still`, result),
    elm.ok('This is ok still'),
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
  ): elm.Result<number> | elm.Result<undefined> => {
    const integer = Number.parseInt(maybeInt, 10)

    return typeof integer === 'number' && !Number.isNaN(integer)
      ? elm.ok(integer)
      : elm.error(errorMessage)
  }

  const result1 = elm.ok('123')
  t.deepEqual(
    elm.andThen((value) => parseIntResult(value), result1),
    elm.ok(123),
  )

  const result2 = elm.ok('Not a number')
  t.deepEqual(
    elm.andThen((value) => parseIntResult(value), result2),
    elm.error(errorMessage),
  )
})
