import { pipe as _, flow as __ } from 'fp-ts/function'
import { not } from 'fp-ts/Predicate'
import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import * as A from 'fp-ts/Array'
import * as NEA from 'fp-ts/NonEmptyArray'
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'
import * as T from 'fp-ts/Tuple'
import { Traversable1 } from 'fp-ts/Traversable'
import * as Eq from 'fp-ts/Eq'
import * as B from 'fp-ts/boolean'
import * as Tr from 'monocle-ts/Traversal'
import * as L from 'monocle-ts/Lens'
import * as Op from 'monocle-ts/Optional'
import { Board, BoardNumber, GameSet as GameSetPart1 } from '../gameSet'
import {
  computeFinalScore,
  duplicate,
  isWinningBoard,
} from '../part1/simulateGame'

interface EnrichedBoard {
  board: Board
  winningDrawnNumber: O.Option<number>
}

interface WinningEnrichedBoard
  extends Omit<EnrichedBoard, 'winningDrawnNumber'> {
  winningDrawnNumber: O.Some<number>
}

interface GameSet extends Omit<GameSetPart1, 'boards'> {
  boards: NEA.NonEmptyArray<EnrichedBoard>
}

export const toGameSetPart2 = ({
  drawNumbers,
  boards,
}: GameSetPart1): GameSet => ({
  drawNumbers,
  boards: _(
    boards,
    NEA.map(board => ({ board, winningDrawnNumber: O.none }))
  ),
})

const boardEq: Eq.Eq<Board> = {
  equals: (x, y) =>
    _(
      NEA.zipWith(x, y, (bn1, bn2) => bn1.value === bn2.value),
      NEA.concatAll(B.SemigroupAll)
    ),
}

// const enrichedBoardEq: Eq.Eq<EnrichedBoard> = {
//   equals: (x, y) => boardEq.equals(x.board, y.board),
// }

const enrichedBoardEq: Eq.Eq<EnrichedBoard> = Eq.struct({
  board: boardEq,
})

export const validateGameSetPart2 = (
  gameSet: GameSet
): E.Either<string, GameSet> =>
  _(
    gameSet,
    duplicate,
    T.mapSnd(gameSet =>
      _(
        gameSet.boards,
        NEA.group(enrichedBoardEq),
        A.filter(groupedBoards => groupedBoards.length > 1)
      )
    ),
    E.fromPredicate(
      ([, duplicateBoards]) => _(duplicateBoards, A.isEmpty),
      ([, duplicateBoards]) =>
        `Found ${duplicateBoards.length} duplicated boards`
    ),
    E.map(T.fst)
  )

const boardNumberT: Tr.Traversal<EnrichedBoard, BoardNumber> = _(
  L.id<EnrichedBoard>(),
  L.prop('board'),
  L.composeTraversal(
    Tr.fromTraversable(
      NEA.Traversable as unknown as Traversable1<'Board'>
    )<BoardNumber>()
  )
)

const markDrawnNumberInBoard: (
  drawnNumber: number
) => (board: EnrichedBoard) => EnrichedBoard = drawnNumber =>
  _(
    boardNumberT,
    Tr.filter(({ value }) => value === drawnNumber),
    Tr.modify(boardNumber => ({ ...boardNumber, marked: true }))
  )

const assignWinningDrawnNumber: (
  winningDrawnNumber: number
) => (
  board: EnrichedBoard
) => EnrichedBoard | WinningEnrichedBoard = winningDrawnNumber =>
  _(
    L.id<EnrichedBoard>(),
    L.filter(
      ({ board, winningDrawnNumber }) =>
        isWinningBoard(board) && O.isNone(winningDrawnNumber)
    ),
    Op.composeLens(_(L.id<EnrichedBoard>(), L.prop('winningDrawnNumber'))),
    Op.modify(() => O.some(winningDrawnNumber))
  )

// const assignWinningDrawnNumber =
//   (winningDrawnNumber: number) =>
//   (enrichedBoard: EnrichedBoard): EnrichedBoard | WinningEnrichedBoard =>
//     isWinningBoard(enrichedBoard.board) &&
//     O.isNone(enrichedBoard.winningDrawnNumber)
//       ? {
//           ...enrichedBoard,
//           winningDrawnNumber: O.some(winningDrawnNumber),
//         }
//       : enrichedBoard

const hasAlreadyWon =
  (winningBoards: EnrichedBoard[]) =>
  (board: EnrichedBoard): boolean =>
    A.elem(enrichedBoardEq)(board)(winningBoards)

const findAllWinningBoards = ({
  drawNumbers,
  boards: initialBoards,
}: GameSet): WinningEnrichedBoard[] =>
  _(
    drawNumbers,
    RNEA.reduce(
      { winningBoards: [] as WinningEnrichedBoard[], boards: initialBoards },
      ({ winningBoards, boards }, drawnNumber) =>
        _(
          boards,
          NEA.map(
            __(
              markDrawnNumberInBoard(drawnNumber),
              assignWinningDrawnNumber(drawnNumber)
            )
          ),
          updatedBoards => {
            const updatedWinningBoards = _(
              winningBoards,
              A.concat(
                _(
                  updatedBoards,
                  A.filter(
                    (enrichedBoard): enrichedBoard is WinningEnrichedBoard =>
                      O.isSome(enrichedBoard.winningDrawnNumber)
                  ),
                  A.filter(not(hasAlreadyWon(winningBoards)))
                )
              )
            )
            return {
              winningBoards: updatedWinningBoards,
              boards: updatedBoards,
            }
          }
        )
    ),
    ({ winningBoards }) => winningBoards
  )

export const simulateGame: (gameSet: GameSet) => E.Either<string, number> = __(
  findAllWinningBoards,
  E.fromPredicate(A.isNonEmpty, () => 'There is no winner'),
  E.map(
    __(NEA.last, ({ board, winningDrawnNumber }) =>
      computeFinalScore(winningDrawnNumber.value)(board)
    )
  )
)
