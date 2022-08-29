import { pipe as _, flow as __ } from 'fp-ts/function'
import * as A from 'fp-ts/Array'
import * as NEA from 'fp-ts/NonEmptyArray'
import { Line, Point } from '.'
import {
  countPointsWithDangerousOverlaps,
  coverPoint,
  getPointsCoveredByLine as getPointsCoveredByLineHV,
  initBoard,
} from '../part1/countDangerousOverlaps'

// Supports, horizontal, vertical, and diagonal (45deg) lines
const getPointsCoveredByLine = ({
  start: { x: x0, y: y0 },
  end: { x: x1, y: y1 },
}: Line): Point[] =>
  x0 === x1 || y0 === y1
    ? getPointsCoveredByLineHV({
        start: { x: x0, y: y0 },
        end: { x: x1, y: y1 },
      })
    : _(
        NEA.makeBy(i => (x0 <= x1 ? x0 + i : x0 - i))(
          Math.max(x0, x1) - Math.min(x0, x1) + 1
        ),
        NEA.zip(
          NEA.makeBy(i => (y0 <= y1 ? y0 + i : y0 - i))(
            Math.max(y0, y1) - Math.min(y0, y1) + 1
          )
        ),
        NEA.map(([x, y]) => ({ x, y }))
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
