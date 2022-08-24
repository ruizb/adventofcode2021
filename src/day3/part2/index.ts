import { EOL } from 'os'

import { pipe, flow } from 'fp-ts/function'
import * as T from 'fp-ts/Task'
import * as TE from 'fp-ts/TaskEither'
import * as A from 'fp-ts/lib/Array'
import * as E from 'fp-ts/lib/Either'
import * as NEA from 'fp-ts/lib/NonEmptyArray'

import { getLifeSupportRating } from './getLifeSupportRating'
import { getInputFileContents } from '..'
import { toFinalProgram } from '../..'

export const getLines = (fileContents: string): string[] =>
  pipe(fileContents.split(EOL) as NEA.NonEmptyArray<string>, lines =>
    NEA.last(lines) === ''
      ? (NEA.init(lines) as NEA.NonEmptyArray<string>)
      : lines
  )

pipe(
  getInputFileContents,
  T.map(E.mapLeft(A.of)), // string => string[]
  TE.chainEitherK(flow(getLines, getLifeSupportRating)),
  toFinalProgram
)()
