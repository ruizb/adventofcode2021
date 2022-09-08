# Day 5 part 1

As usual, we begin by parsing the lines from the `input.txt` file to get our domain objects: `Line` and `Point`.

Once we have the lines, we build the initial state of the `Board` with the `initBoard` function. Since we do not know the size of the board yet, we have to compute it with `getMaxXY`.

This function uses `bimap` from the `fp-ts/Tuple` module, with the exact same lambda for both elements of the 2-tuple. I could have extracted this expression into a dedicated `flattenThenFindMax` function, but since they were very close in the code, I didn't mind the duplication. Also, I wish there was a `bimap` version were we only set 1 function that is applied to both elements, e.g. `mapAll`. I could have created one, but again I didn't mind duplication there.

Once we have the max width and height of the board, we can build one filled with zeros in `initBoard`.

Now that we have a `Board`, we can "draw" the lines with the `coverPoint` function.

> I'm starting to realize that I'm 'using `reduce` quite a lot in the recent challenges to build a state (here, the final board) while iterating over a list of values (here, the parsed lines).

The `coverPoint` function is quite interesting as it uses some components of the `monocle-ts` library:

```ts
export const coverPoint = (x: number, y: number): ((board: Board) => Board) =>
  _(
    Tr.id<Board>(),
    Tr.indexNonEmpty(y),
    Tr.composeTraversal(_(Tr.id<Board[number]>(), Tr.indexNonEmpty(x))),
    Tr.modify(increment)
  )
```

The `Board` is essentially a list of list of numbers: `number[][]`. To cover a specific point on the board, we have to increment the value that is already set at `board[i][j]`. As we don't want to mutate the board, this is a great case where the `Traversal` optic is useful.

First we get the right line index with `Tr.indexNonEmpty(y)`. I am using `indexNonEmpty` for 2 reasons:
* I know that `x` and `y` are within the bounds of the board, since I used the whole list of `x`s and `y` to determine the size of the board with `getMaxXY`.
* In addition, I know the board has at least 1 line and 1 column, so I can use the "non empty" version of `index`.

This has the benefit of returning the value at that index directly, instead of returning an `Option`, which makes the code simpler.

Once we have the line, we get the column using the same function and the `x` value.

Finally we can use `modify` to increment the existing value, and return a new instace of the updated `Board`.

Once all the points have been covered, it's time to compute the number of _dangerous overlaps_ with `countPointsWithDangerousOverlaps`. This function is quite simple: we flatten the board to get only a list of numbers `number[]`, then we keep only the numbers that qualify as a _dangerous overlap_, and finally we get the size of the resulting list.
