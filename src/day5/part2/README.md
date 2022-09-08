# Day 5 part 2

This part was similar to the first one, but I had to adapt the `getPointsCoveredByLine` function to also take into account the diagonal lines.

Nothing really related to `fp-ts` here, just some _ math_ to build the right `Point`s.

I use `makeBy` to build the list of `x` coordinates of all the extrapolated points, then I `zip` the list with the one for `y` coordinates, also built using `makeBy`. Finally I transform the tuples `[x, y]` into `Point`s.
