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

**npm**

```
npm install ts-elm
```

**yarn**

```
yarn add ts-elm
```

---

## :newspaper: API

---

## :book: Recipes
