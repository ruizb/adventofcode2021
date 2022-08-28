import { pipe as _, flow as __ } from 'fp-ts/function'
import * as S from 'fp-ts/string'
import * as B from 'fp-ts/boolean'
import * as TE from 'fp-ts/TaskEither'
import * as E from 'fp-ts/Either'
import * as A from 'fp-ts/Array'
import * as NEA from 'fp-ts/NonEmptyArray'
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'
import { getLines, toFinalProgram, toInt } from '../..'
import { getInputFileContents } from '..'
import { countDangerousOverlaps } from './countDangerousOverlaps'

export interface Point {
  x: number
  y: number
}

export interface Line {
  start: Point
  end: Point
}

export type Board = RNEA.ReadonlyNonEmptyArray<
  RNEA.ReadonlyNonEmptyArray<number>
>

export const parseLine: (line: string) => E.Either<string, Line> = __(
  S.split(' -> '),
  RNEA.map(__(S.split(','), RNEA.map(toInt))),
  E.fromPredicate(
    __(
      RNEA.flatten,
      coords =>
        coords.length === 4 &&
        RNEA.foldMap(B.SemigroupAll)(Number.isFinite)(coords)
    ),
    () => 'Line has invalid format. Valid format: x0,y0 -> x1,y1'
  ),
  E.map(
    __(
      RNEA.map(([x, y]) => ({ x, y })),
      ([start, end]) => ({ start, end })
    )
  )
)

export const run: (fileContents: string) => E.Either<string, number> = __(
  getLines,
  E.fromPredicate(A.isNonEmpty, () => 'There are no lines to parse'),
  E.chain(
    __(NEA.traverse(E.Applicative)(parseLine), E.map(countDangerousOverlaps))
  )
)

_(getInputFileContents, TE.chainEitherK(run), toFinalProgram)()
