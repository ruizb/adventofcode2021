# Day 3 part 1

For this one, I chose to validate the input provided to the entry point for 2 reasons:
* I wanted to practice more with `fp-ts` with some validation steps (i.e. a bit of `Either` here and there).
* I wanted to add more tests with edge cases.

I chose to build a `Matrix`, which is essentially the rotation of the input (lines become columns, columns become lines):

```ts
const input = `1001
               0101
               0110`

const matrix = [
  ['1', '0', '0'],
  ['0', '1', '1'],
  ['0', '0', '1'],
  ['1', '1', '0']
]
```

_After finishing day 3 part 2, in retrospect, I'm convinced I could come up with a simpler solution than the one based on a `Matrix`._

Validating the input by building a `Matrix` [here](../buildMatrix.ts) pushed me into using more `fp-ts`:

```ts
export const buildMatrix: (
  lines: NEA.NonEmptyArray<string>
) => E.Either<string, Matrix> = flow(
  NEA.traverseWithIndex(E.Applicative)(parseLine),
  E.chain(
    ([firstDiagnosticNumber, ...restDiagnosticNumbers]) =>
      pipe(
        restDiagnosticNumbers,
        A.reduce(
          E.of<string, Matrix>(initMatrix(firstDiagnosticNumber)),
          addDiagnosticNumberBitsToMatrix
        )
      )
  )
)
```

First, whenever I see one the following patterns, I always think about either `sequence` or `traverse`:
* I have a `F[G[A]]`, I want a `G[F[A]]`. I can use `sequence` (if available) to do that:
   ```ts
   declare const input: NEA.NonEmptyArray<O.Option<number>> // F = NEA.NonEmptyArray, G = O.Option, A = number

   const output = pipe(input, NEA.sequence(O.Applicative))
   // output: O.Option<NEA.NonEmptyArray<number>>
   ```
* I have a `F[A]` and `A => G[B]`, I want a `G[F[B]]`. I can use `traverse` (if available) to do that:
   ```ts
   declare const input: NEA.NonEmptyArray<number> // F = NEA.NonEmptyArray, A = number
   declare const parseNum: (n: number) => O.Option<boolean> // G = O.Option, B = boolean

   const output = pipe(input, NEA.traverse(O.Applicative)(parseNum))
   // output: O.Option<NEA.NonEmptyArray<number>>
   ```

In our case, we have:
* A list of lines: `NonEmptyArray<string>` (`F[A]`)
* The `parseLine` function, which takes a line and its index, and returns an `Either<string, DiagnosticNumber>` (`A => G[E, B]`)

If I didn't need the index of the line for the error messages, I could've used `NEA.traverse`. However since I need the index, I'm using `NEA.traverseWithIndex`. Thus, instead of getting a list of lines that each may fail (with `NonEmptyArray<Either<string, DiagnosticNumber>>`), I get either an error message for the first line that could not be parsed, or the whole list of `DiagnosticNumber`s (with `Either<string, NonEmptyArray<DiagnosticNumber>>`), which is more convenient for the next step.

Speaking of the next step, I used `NEA.reduce` to transform the list of `DiagnosticNumber`s into a `Matrix`.

Other than within this `buildMatrix` function, there is a bunch of `reduce` calls here and there to build the `Matrix`. _After completing day 3 part 2, I think some complexity due to these reducers can be removed, using a simpler data structure than `Matrix`_.

Let's open [computePowerConsumption.ts](./computePowerConsumption.ts), which contains another interesting part, in the `computeRates` function:

```ts
export const computeRates: (matrix: Matrix) => Rates = flow(
  NEA.map(getMostCommonBit),
  mostCommonBits => ({
    gamma: mostCommonBits,
    epsilon: pipe(mostCommonBits, NEA.map(invertBit)),
  }),
  R.map(flow(NEA.concatAll(S.Semigroup), parseBinToDec))
)
```

First, we transform a list of `DiagnosticNumber`s (a.k.a the `Matrix`) into a list of `Bit`s:

```ts
const before: Matrix = [['1', '1', '0'], ['1', '0', '1'], ['0', '1', '0']]
const after: NEA.NonEmptyArray<Bit> = ['1', '1', '0']
```

Then, we build a record that looks like this:

```ts
const record = {
  gamma: ['1', '1', '0'],
  epsilon: ['0', '0', '1']
}
```

And finally, we use `R.map` to build a `string` from the `NonEmptyArray<Bit>`, then parse this `string` to get a decimal `number`, ending up with a `Rates` record.

As for the tests, I was able to write more cases for invalid inputs.
