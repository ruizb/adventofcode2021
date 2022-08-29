import { pipe as _, flow as __ } from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'
import * as E from 'fp-ts/Either'
import * as A from 'fp-ts/Array'
import * as NEA from 'fp-ts/NonEmptyArray'
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'
import { getLines, toFinalProgram, toInt } from '../..'
import { getInputFileContents } from '..'
import { countDangerousOverlaps } from './countDangerousOverlaps'
import { parseLine } from '../part1'

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

export const run: (fileContents: string) => E.Either<string, number> = __(
  getLines,
  E.fromPredicate(A.isNonEmpty, () => 'There are no lines to parse'),
  E.chain(
    __(NEA.traverse(E.Applicative)(parseLine), E.map(countDangerousOverlaps))
  )
)

_(getInputFileContents, TE.chainEitherK(run), toFinalProgram)()
