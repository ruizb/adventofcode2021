# Day 1 part 2

Here again, I haven't used a lot of `fp-ts`, and I chose to trust the `input.txt` file without validating it.

The main function is recursive with a bunch of statements, i.e. it's not implemented with a single expression. I used `pipe` to get the sliding windows:

```ts
const [window1, window2, ...restWindows] = pipe(
  ongoingWindows,
  NEA.map(addMeasurementToPartialWindow(measurement)),
  canCreateNewWindow(remainingMeasurements)
    ? A.append(initWindow(measurement))
    : identity
)
```

Another interesting part is how we get the sum of measurements that compose a full sliding window:

```ts
const getWindowSum: (w: CompleteMeasurementWindow) => number = NEA.concatAll(
  N.SemigroupSum
)
```

Other than that, nothing fancy, just some predicates here and there, and a main recursive function. I might also revisit this part later to make it more `fp-ts`-ish.
