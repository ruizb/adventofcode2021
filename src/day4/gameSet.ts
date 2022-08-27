import { pipe as _, flow as __, tupled, tuple } from 'fp-ts/function'
import { not } from 'fp-ts/Predicate'
import { Refinement } from 'fp-ts/Refinement'
import * as Ap from 'fp-ts/Apply'
import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import * as A from 'fp-ts/Array'
import * as NEA from 'fp-ts/NonEmptyArray'
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'
import * as T from 'fp-ts/Tuple'
import * as S from 'fp-ts/string'
import { getLines, toInt } from '..'

// Could be used for other challenges
type RefinementWithIndex<A, B extends A> = Refinement<
  [index: number, unchecked: A],
  [index: number, checked: B]
>

export interface BoardNumber {
  value: number
  marked: boolean
}

type Line<A> = [A, A, A, A, A]

export type BoardLine = Line<BoardNumber>

export type Board = [
  ...BoardLine,
  ...BoardLine,
  ...BoardLine,
  ...BoardLine,
  ...BoardLine
]

export interface GameSet {
  drawNumbers: RNEA.ReadonlyNonEmptyArray<number>
  boards: NEA.NonEmptyArray<Board>
}

export const BOARD_SIZE = 5

const createBoardNumber = (value: number): BoardNumber => ({
  value,
  marked: false,
})

const isBoard = (
  board: RNEA.ReadonlyNonEmptyArray<BoardNumber>
): board is Board => board.length === BOARD_SIZE ** 2

const validateBoard: (
  a: [index: number, board: RNEA.ReadonlyNonEmptyArray<BoardNumber>]
) => E.Either<string, Board> = __(
  E.fromPredicate(
    __(T.snd, isBoard) as RefinementWithIndex<
      RNEA.ReadonlyNonEmptyArray<BoardNumber>,
      Board
    >,
    ([index]) => `Board ${index + 1} is incomplete`
  ),
  E.map(T.snd)
)

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

const parseDrawNumbers: (line: string) => RNEA.ReadonlyNonEmptyArray<number> =
  __(S.split(','), RNEA.map(toInt))

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

const validateNonEmptyLines: (
  lines: string[]
) => E.Either<string, NEA.NonEmptyArray<string>> = E.fromPredicate(
  A.isNonEmpty,
  () => 'There are no lines to parse'
)

export const getGameSet: (fileContents: string) => E.Either<string, GameSet> =
  __(getLines, validateNonEmptyLines, E.chain(buildGameSet))
