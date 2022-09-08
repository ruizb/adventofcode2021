# Day 6 part 1

First, we parse the input to make sure we get a list of `Fish`es.

Once we have such list, we build the initial `FishGenerations` with `getInitialGenerations`. This is a 9-tuple of `Fish`, but to make it simpler, I chose to use the `ReadonlyNonEmptyArray<Fish>` type.

Given a `FishGenerations`, computing the next iteration with `getNextGenerations` is quite trivial: we simply rotate the array 1 element to the left, with a special operation on the index `6`.

Finally, to get the generations on the 80th day, we use a recurvive function `nextDay` that uses `getNextGenerations` until the 80th day is reached.

The last part is to count the total number of fishes with `countAllFishes`, which uses `concatAll` and `SemigroupSum` that we already used in the past challenges.

Note that initially the `nextDay` function was less generic. The max day 80 was hardcoded, but once I got to part 2, the only difference was that the max day had to be 256. This is where I chose to add a `maxDay` parameter, to reuse the `nextDay` function in day6/part2.
