<h1 align="center">
  ts-elm
</h1>
<h4 align="center">
    Elm types in TypeScript
</h4>

<div align="center">
  <img src="https://badgen.net/npm/v/ts-elm?icon=npm" />
  <img src="https://badgen.net/bundlephobia/minzip/ts-elm" />
</div>

Implements [Elm's](https://elm-lang.org/) [`Result`](https://package.elm-lang.org/packages/elm/core/latest/Result) type in TypeScript. Use it to make error handling explicit.
Instead of throwing errors, you create Results with the `error` function.

Benefits:

- Type signatures indicate if a function can fail or not
- Ensures that errors are always handled
- Work with the data as if it always succeeds and add error handling where it makes the most sense

There is purposefully no type guards to detect if a `Result` is `Ok` or `Err`. This is to force the use
of `match`, which ensures that Errors are always handled.

## :sparkles: Features

- Written in TypeScript
- Zero dependencies

---

## :wrench: Example usage

---

## :package: Install

```sh
npm install ts-elm
```

---

## :newspaper: API

The goal of the API is to be as similar to the original Elm code as possible

### Type and Constructors

```ts
type Result<Value, Error> = Ok<Value> | Err<Error>
```

A Result is either Ok meaning the computation succeeded, or it is an Err meaning that there was some failure.

### Mapping

```ts
type map = ((x: any) => any, result: Result) => Result
```

Apply a function to a result. If the result is Ok, it will be converted. If the result is an Err, the same error value will propagate through.

Example:

```ts
const sqrt = (x) => x ** 2

map(sqrt, ok(4)) === ok(2)
map(sqrt, err('Bad input')) === err('Bad input')
```

