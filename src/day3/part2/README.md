# Day 3 part 2

I finally decided to extract the code to parse a `string` (i.e. file contents) into a list of lines:

```ts
export const getLines = (fileContents: string): string[] =>
  pipe(fileContents.split(EOL) as NEA.NonEmptyArray<string>, lines =>
    NEA.last(lines) === ''
      ? (NEA.init(lines) as NEA.NonEmptyArray<string>)
      : lines
  )
```

This allows me to write test cases in a more convenient way.

We still have the assumption that the file contents is not empty. We could make this function more resilient with an `Either<string, string[]>` return type, but let's keep this assumption for now.

Let's dive into the [getLifeSupportRating.ts](./getLifeSupportRating.ts) module:

```ts
export const getLifeSupportRating: (
  lines: string[]
) => E.Either<string[], number> = flow(
  getRatings,
  E.map(({ oxygen, co2 }) => oxygen * co2)
)
```

The entry point returns an `Either<string[], number>`, which means some validation is performed in `getRatings`:

```ts
const getRatings = (lines: string[]): E.Either<string[], Ratings> =>
  pipe(
    {
      oxygen: pipe(getOxygenRating(lines), E.mapLeft(A.of)),
      co2: pipe(getCO2Rating(lines), E.mapLeft(A.of)),
    },
    R.sequence(E.getApplicativeValidation(A.getSemigroup<string>()))
  )
```

Here, we build a record that looks like this:

```ts
{
  oxygen: E.Either<string[], number>,
  co2: E.Either<string[], number>
}
```

Then we use `R.sequence` to transform a `Record<string, Either<string[], number>>` into a `Either<string[], Record<string, number>>`. Remember from [the previous part](../part1/README.md):
* We see a `F[G[A]]`: `Record<string, Either<string[], number>>`.
* We want a `G[F[A]]`: `Either<string[], Record<string, number>>`.
* We can use `F.sequence` and `G.Applicative` to do that.

I could've used `Either<string, number>` and `R.sequence(E.Applicative)`. But for the challenge, I chose to have a list of validation errors, instead of just the _first_ error that occurs.

For that, I used `E.getApplicativeValidation`, and since I wanted a list of errors (`string[]`) instead of a single error built from the concatenation of errors (`string`), I had to transform the errors into singletons of 1 error, with `pipe(getXRating(lines), E.mapLeft(A.of))`:

```ts
declare const someLines: string[]

const getRatings = (lines: string[]): E.Either<string[], Ratings> =>
  pipe(
    {
      oxygen: pipe(getOxygenRating(lines), E.mapLeft(A.of)),
      co2: pipe(getCO2Rating(lines), E.mapLeft(A.of)),
    },
    R.sequence(E.getApplicativeValidation(A.getSemigroup<string>()))
  )

const simpleGetRatings = (lines: string[]): E.Either<string, Ratings> =>
  pipe(
    {
      oxygen: getOxygenRating(lines),
      co2: getCO2Rating(lines),
    },
    R.sequence(E.Applicative)
  )

import * as S from 'fp-ts/string'

const altGetRatings = (lines: string[]): E.Either<string, Ratings> =>
  pipe(
    {
      oxygen: getOxygenRating(lines),
      co2: getCO2Rating(lines),
    },
    R.sequence(E.getApplicativeValidation(S.Semigroup))
  )

getRatings(someLines) // may produce: E.left(['first error', 'second error'])
simpleGetRatings(someLines) // may produce: E.left('first error')
altGetRatings(someLines) // may produce: E.left('first errorsecond error')
```

Anyway, this also means that it's not `getRatings` that does some validation, but `getOxygenRating` and `getCO2Rating`.

Indeed, when we look at these functions, we see they use the generic `getRatingRec` which returns `Either<string, number>`.

This recursive function performs 2 validations:
* It makes sure that there are no duplicates in a list of lines (_granted, we could use a `Set` sooner, in a `getUniqueLines` function for example_).
* It makes sure there is at least 1 line left to compute the rating, after getting the lines matching the appropriate bit (most or least common, depending on the rating).

By the way, this generic function is recursive, and its definition is a single expression (contrasted to the recursive functions from day 1 parts).

Finally, I wrote test cases using the `input.txt` and example provided by Advent of Code 2021, as well as tests to make sure the validations worked as intended.
