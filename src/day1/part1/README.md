# Day 1 part 1

For this challenge, I haven't used a lot of `fp-ts`. The main algorithm is a recursive function written in plain old JavaScript. I did use `NEA.head`, `NEA.tail` and `NEA.unprepend`:

```ts
const [currentMeasurement, newRemainingMeasurements] = NEA.unprepend(
  remainingMeasurements
)

countMeasurementIncreasesRec(
  NEA.head(measurements),
  NEA.tail(measurements) as NEA.NonEmptyArray<number>,
  0
)
```

But let's be honest, I could've gotten the same result with array destructuring:

```ts
const [currentMeasurement, ...newRemainingMeasurements] = remainingMeasurements

const [firstMeasurement, ...restMeasurements] = measurements
countMeasurementIncreasesRec(
  firstMeasurement,
  restMeasurements as NEA.NonEmptyArray<number>,
  0
)
```

I might revisit this function later, with more `fp-ts` components. Also, I chose to assume the contents of `input.txt` was valid, hence the missing validation pieces of code.

Oh, and this is the first time I've used `vitest` to write some tests. So far, I've got the same experience as [jest](https://github.com/facebook/jest) writing tests, **but** the setup is way better as TypeScript is supported by default!
