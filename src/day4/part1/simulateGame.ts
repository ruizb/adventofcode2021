import { pipe as _, flow as __, unsafeCoerce } from 'fp-ts/function'
import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import * as A from 'fp-ts/Array'
import * as NEA from 'fp-ts/NonEmptyArray'
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'
import * as T from 'fp-ts/Tuple'
import * as N from 'fp-ts/number'
import * as B from 'fp-ts/boolean'
import { Traversable1 } from 'fp-ts/Traversable'
import * as Tr from 'monocle-ts/Traversal'
import { Board, BoardLine, BoardNumber, BOARD_SIZE, GameSet } from '../gameSet'

declare module 'fp-ts/HKT' {
  interface URItoKind<A> {
    readonly Board: Board
  }
}

export const duplicate = <A>(value: A): [A, A] => [value, value]

// const boardT: Tr.Traversal<GameSet['boards'], Board> = Tr.fromTraversable(
//   NEA.Traversable
// )<Board>()

// const boardsToBoardNumberT: Tr.Traversal<GameSet['boards'], BoardNumber> = _(
//   boardT,
//   Tr.compose(boardNumberT)
// )

const boardNumberT: Tr.Traversal<Board, BoardNumber> = Tr.fromTraversable(
  NEA.Traversable as unknown as Traversable1<'Board'>
)<BoardNumber>()

type BoardColumn = BoardLine

export interface Winner {
  board: Board
  drawnNumber: number
}

const getBoardLines: (board: Board) => NEA.NonEmptyArray<BoardLine> = __(
  NEA.chunksOf(BOARD_SIZE),
  unsafeCoerce<
    NEA.NonEmptyArray<NEA.NonEmptyArray<BoardNumber>>,
    NEA.NonEmptyArray<BoardLine>
  >
)

const computeColumnIndex = (lineIndex: number, offset: number): number =>
  lineIndex + offset * BOARD_SIZE

const getBoardColumns = (board: Board): NEA.NonEmptyArray<BoardColumn> =>
  _(
    NEA.range(0, BOARD_SIZE - 1),
    NEA.map(i =>
      _(
        BOARD_SIZE,
        NEA.makeBy(j =>
          _(board, A.lookup(computeColumnIndex(i, j)), O.toUndefined)
        ),
        unsafeCoerce<NEA.NonEmptyArray<BoardNumber | undefined>, BoardColumn>
      )
    )
  )

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

const isMarked = ({ marked }: BoardNumber): boolean => marked

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

const findWinningBoard = ({
  drawNumbers,
  boards: initialBoards,
}: GameSet): [winner: O.Option<Winner>, finalBoards: GameSet['boards']] =>
  _(
    drawNumbers,
    RNEA.reduce(
      [O.none, initialBoards] as [
        winner: O.Option<Winner>,
        finalBoards: GameSet['boards']
      ],
      ([winner, boards], drawnNumber) =>
        O.isSome(winner)
          ? [winner, boards]
          : _(
              boards,
              markDrawnNumberInBoards(drawnNumber),
              duplicate,
              T.mapFst(A.findFirst(isWinningBoard)),
              T.mapFst(O.map(board => ({ board, drawnNumber })))
            )
    )
  )

export const simulateGame: (gameSet: GameSet) => E.Either<string, number> = __(
  findWinningBoard,
  T.fst,
  O.map(({ board, drawnNumber }) => computeFinalScore(drawnNumber)(board)),
  E.fromOption(() => 'There is no winner')
)

export const computeFinalScore: (
  drawnNumber: number
) => (board: Board) => number = drawnNumber =>
  _(
    boardNumberT,
    Tr.filter(({ marked }) => !marked),
    Tr.foldMap(N.MonoidSum)(({ value }) => value * drawnNumber)
  )
