# Day 2 part 1

This challenge was easier than the [day1/part2](../../day1/part2/README.md) one.

I used `NEA.reduce` to transform a list of `Direction`s into a `Position` record:

```ts
export const getFinalPosition: (
  directions: NEA.NonEmptyArray<Direction>
) => Position = NEA.reduce(...)
```

Also, since `Direction` is a [discriminated union type](https://github.com/ruizb/glossary-typescript#discriminated-union), I was able to use an exhaustive `switch` statement. The exhaustiveness is made possible thanks to the `absurd` function:

```ts
switch (directionType) {
  case 'forward':
    return { ...position, horizontal: position.horizontal + value }
  case 'up':
    return { ...position, depth: position.depth - value }
  case 'down':
    return { ...position, depth: position.depth + value }
  default:
    absurd(directionType)
    return position
}
```

If I were to add a new type of direction, e.g. `'backward'`, `absurd` would make sure that there would be a TS error in that part of the code because of a missing `case 'backward'`.

I considered using [ts-pattern](https://github.com/gvergnaud/ts-pattern) to have an expression instead of a `switch` statement there (and also to experiment with that library), but I chose not (for now) to because this function was simple enough.
