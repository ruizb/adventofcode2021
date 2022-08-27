# Day 4 part 1

This challenge was very interesting, `fp-ts`-wise.

## Misc

I decided to replace `pipe` with `_`, and `flow` with `__` for 2 reasons:
* I felt like these words were polluting a bit too much my code, as I'm using quite a lot of [function composition](https://dev.to/ruizb/function-composition-and-higher-order-function-3953#function-composition)
* `_` and `__` are faster to type (and I don't use [lodash](https://github.com/lodash/lodash) anyway)

I don't have a strong opinion yet, but so far I like it.

## Data structure

Initially, I chose the following data structure for this challenge:

```ts
interface BoardNumber {
  value: number
  marked: boolean
}

type Board = [
  [BoardNumber, BoardNumber, BoardNumber, BoardNumber, BoardNumber],
  [BoardNumber, BoardNumber, BoardNumber, BoardNumber, BoardNumber],
  [BoardNumber, BoardNumber, BoardNumber, BoardNumber, BoardNumber],
  [BoardNumber, BoardNumber, BoardNumber, BoardNumber, BoardNumber],
  [BoardNumber, BoardNumber, BoardNumber, BoardNumber, BoardNumber]
]

interface GameSet {
  drawNumbers: NonEmptyArray<number>
  boards: NonEmptyArray<Board>
}
```

But, when writing the function that marks a board number, I ended up having too many nested calls to `NEA.modifyAt`.

Modifying the boards using mutable data is pretty straightforward, with something along these lines:

```ts
declare const drawnNumber: number

for (const board of gameSet.boards) {
  for (const line of board) {
    const index = line.indexOf(drawnNumber)
    if (Number.isFinite(index)) {
      line[index].marked = true
    }
  }
}
```

However, doing the same with immutable data is quite a challenge, because we have to build an entire new `GameSet` with an updated list of boards every time we draw a new number. With the data structure aforementioned, targeting a board number from the "root" game set requires 3 indices: `gameSet.boards[boardIndex][boardLineIndex][boardColumnIndex]`.

To remove one level of complexity, I chose to represent the board as a tuple containing 25 `BoardNumber`s (i.e. a fancy `NonEmptyArray<BoardNumber>`), then use some _math_ to compute the columns of this list (getting the lines was pretty easy with `chop`).

Marking a board number required only 2 nested calls of `modifyAt`, which was already an improvement. But, I still had difficulties to put everything together. My brain kind of froze when I had to preserve full immutability while marking the numbers of all the boards, AND checking whether a board was complete or not.

Eventually, I ended up pulling the [monocle-ts](https://github.com/gcanti/monocle-ts) library. It contains optics, which are essentially functional/composable getters and setters. Using a `Traversal`, I was able to quite easily achieve what I wanted: target each `BoardNumber` of a list of `Board`s that had to be marked, whilst preserving immutability:

<details>
<summary>Click here to see code</summary>

```ts
import { Traversable1 } from 'fp-ts/Traversable'
import * as Tr from 'monocle-ts/Traversal'

const boardNumberT: Tr.Traversal<Board, BoardNumber> = Tr.fromTraversable(
  NEA.Traversable as unknown as Traversable1<'Board'>
)<BoardNumber>()

const markDrawnNumberInBoard: (
  drawnNumber: number
) => (board: Board) => Board = drawnNumber =>
  _(
    boardNumberT,
    Tr.filter(({ value }) => value === drawnNumber),
    Tr.modify(boardNumber => ({ ...boardNumber, marked: true }))
  )

const markDrawnNumberInBoards: (
  drawnNumber: number
) => (boards: GameSet['boards']) => GameSet['boards'] = drawnNumber =>
  NEA.map(markDrawnNumberInBoard(drawnNumber))
```
</details>

## Building the game set

The `GameSet` is composed of 2 parts:
* A list of numbers to draw
* A list of boards

Getting the list of `drawNumbers` was fairly easy:

```ts
const parseDrawNumbers: (line: string) => RNEA.ReadonlyNonEmptyArray<number> =
  __(S.split(','), RNEA.map(toInt))
```

Getting the list of `boards` was not as straightforward:

```ts
const parseBoards: (
  nonEmptyLines: NEA.NonEmptyArray<string>
) => E.Either<string, NEA.NonEmptyArray<Board>> = __(
  NEA.chunksOf(1 + BOARD_SIZE),
  NEA.map(
    __(
      NEA.concatAll({ concat: (x, y) => x + ' ' + y }),
      S.split(' '),
      RNEA.filter(not(S.isEmpty)),
      O.map(RNEA.map(__(toInt, createBoardNumber)))
    )
  ),
  A.compact,
  A.traverseWithIndex(E.Applicative)(__(tuple, validateBoard)),
  E.chain(E.fromPredicate(A.isNonEmpty, () => 'The list of boards is empty'))
)
```

1. First, we split the list of lines into lists of 6 lines to btain a list of "1 blank line + 5x5 board"
2. Next, we flatten the list of 6 lines (each containing either an empty string, or 5 numbers with spaces in-between) into a single line of 25 numbers and spaces
3. We split this line into a list of stringified numbers
4. We make sure to remove empty strings (e.g. ` 2 13 45  7 17` becomes `['', '2', '13', '45', '', '7', '17']`)
5. We parse these strings into integers, then we create `BoardNumber`s out of them
6. Because of the `RNEA.filter` line, we end up with a `NonEmptyArray<Option<ReadonlyNonEmptyArray<BoardNumber>>>`. To get rid of options, we use `compact`
7. At this point we have a `ReadonlyNonEmptyString<BoardNumber>[]`. We want to make sure that the `ReadonlyNonEmptyString<BoardNumber>[]` is actually a valid `Board[]` (i.e. a list of tuples of 25 `BoardNumber`s). For that, we use `validateBoard` which returns an `E.Either<string, Board>`, and since we prefer having `E.Either<string, Board[]>` instead of `E.Either<string, Board>[]`, we use `traverseWithIndex`.
8. Finally, we need to make sure the list of boards contains at least 1 valid board, otherwise the game is pointless. The last expression ensures we end up with a non-empty list of boards.

Npw that we have both pieces of data, we can compose them to transform a list of lines into a valid `GameSet`:

<details>
<summary>Click here to see code</summary>

```ts
const toEitherOfTuple = tupled(Ap.sequenceT(E.Applicative))

const buildGameSet: (
  lines: NEA.NonEmptyArray<string>
) => E.Either<string, GameSet> = __(
  NEA.unprepend,
  E.fromPredicate(
    __(T.snd, A.isNonEmpty) as Refinement<
      [string, string[]],
      [string, NEA.NonEmptyArray<string>]
    >,
    () => 'Missing lines containing the boards'
  ),
  E.map(
    T.bimap(
      parseBoards,
      __(parseDrawNumbers, E.of<string, ReturnType<typeof parseDrawNumbers>>)
    )
  ),
  // Somehow, inlining `tupled(Ap.sequenceT(E.Applicative))` raises a TS error here
  E.chain(toEitherOfTuple),
  E.map(([drawNumbers, boards]) => ({ drawNumbers, boards }))
)

export const getGameSet: (fileContents: string) => E.Either<string, GameSet> =
  __(
    getLines,
    validateNonEmptyLines,
    E.chain(buildGameSet)
  )
```
</details>

The `buildGameSet` function splits the lines into `[firstLine, ...restLines]`, then uses `T.bimap` to transform `firstLine` into `drawnNumbers`, and `restLines` into `boards`.

As for the `toEitherOfTuple` part, it transforms a "tuple of eithers" into an "either of tuple", for example:

```ts
type TupleOfEithers = [Either<string, A>, Either<string, B>, Either<string, C>]

type EitherOfTuple = Either<string [A, B, C]>
```

## Simulating the game to find the winning board

The main function of [simulateGame.ts](./simulateGame.ts) is `findWinningBoard`. As mentioned in the [Data structure](#data-structure) part above, we use the `Traversal` optic from the `monocle-ts` library to mark the drawn number in the list of boards from the game set:

After marking the drawn number on all the boards, we check whether a winning board is available or not, with `A.findFirst(isWinningBoard)`. The `isWinningBoard` function is defined as:

```ts
export const isWinningBoard = (board: Board): boolean =>
  _(
    board,
    getBoardLines,
    A.some(A.every(isMarked)),
    B.match(
      () => _(board, getBoardColumns, A.some(A.every(isMarked))),
      () => true
    )
  )
```

In other words:
* First we check if one of its lines is complete, with `_(getBoardLines(board), A.some(A.every(isMarked)))`.
* If at least 1 line is complete, we return `true`. Otherwise, we check if one of the columns is complete, with `_(getBoardColumns(board), A.some(A.every(isMarked)))`.

Finally, if we have a winning board, we can use the `computeFinalScore` function:

```ts
export const computeFinalScore: (
  drawnNumber: number
) => (board: Board) => number = drawnNumber =>
  _(
    boardNumberT,
    Tr.filter(({ marked }) => !marked),
    Tr.foldMap(N.MonoidSum)(({ value }) => value * drawnNumber)
  )
```

This one also uses `Traversal`:
* First, we target each `BoardNumber` of the given `Board` with the traversal `boardNumberT`
* Then, we use `Tr.filter` to target only the `BoardNumber`s that have not been marked
* Finally, we use `Tr.foldMap` to compute the score, i.e. the sum of "unmarked number" multiplied by the drawn number that led the board to victory
  * _Side note: computing `(1 * 4) + (2 * 4) + (3 * 4)` is the same as `(1 + 2 + 3) * 4` because the multiplication is distributive._
