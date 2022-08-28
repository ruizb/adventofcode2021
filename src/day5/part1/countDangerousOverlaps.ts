import { pipe as _, flow as __, increment } from 'fp-ts/function'
import * as T from 'fp-ts/Tuple'
import * as O from 'fp-ts/Option'
import * as A from 'fp-ts/Array'
import * as NEA from 'fp-ts/NonEmptyArray'
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'
import * as Tr from 'monocle-ts/Traversal'
import { Board, Line, Point } from '.'

// Supports only horizontal and vertical lines
const getPointsCoveredByLine = ({
  start: { x: x0, y: y0 },
  end: { x: x1, y: y1 },
}: Line): Point[] =>
  x0 === x1
    ? _(
        NEA.range(Math.min(y0, y1), Math.max(y0, y1)),
        NEA.map(y => ({ x: x0, y }))
      )
    : y0 === y1
    ? _(
        NEA.range(Math.min(x0, x1), Math.max(x0, x1)),
        NEA.map(x => ({ x, y: y0 }))
      )
    : []

const getMaxXY = (lines: NEA.NonEmptyArray<Line>): [x: number, y: number] =>
  _(
    lines,
    NEA.map(
      ({ start, end }) =>
        [
          [start.x, end.x],
          [start.y, end.y],
        ] as [xs: NEA.NonEmptyArray<number>, ys: NEA.NonEmptyArray<number>]
    ),
    NEA.unzip,
    T.bimap(
      __(NEA.flatten, NEA.reduce(-Infinity, Math.max)),
      __(NEA.flatten, NEA.reduce(-Infinity, Math.max))
    )
  )

const initBoard: (lines: NEA.NonEmptyArray<Line>) => Board = __(
  getMaxXY,
  ([maxX, maxY]) =>
    _(
      NEA.range(0, maxY),
      NEA.map(() => NEA.replicate(0)(maxX + 1))
    )
)

const coverPoint = (x: number, y: number): ((board: Board) => Board) =>
  _(
    Tr.id<Board>(),
    Tr.indexNonEmpty(y),
    Tr.composeTraversal(_(Tr.id<Board[number]>(), Tr.indexNonEmpty(x))),
    Tr.modify(increment)
  )

const countPointsWithDangerousOverlaps = (board: Board): number =>
  _(
    board,
    RNEA.flatten,
    RNEA.filter(n => n > 1),
    O.match(
      () => 0,
      ns => ns.length
    )
  )

export const countDangerousOverlaps = (
  lines: NEA.NonEmptyArray<Line>
): number =>
  _(
    lines,
    A.chain(getPointsCoveredByLine),
    A.reduce(initBoard(lines), (board, { x, y }) => coverPoint(x, y)(board)),
    countPointsWithDangerousOverlaps
  )
