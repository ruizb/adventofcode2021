import { EOL } from 'os'

import { pipe, flow } from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'
import * as E from 'fp-ts/Either'
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
  TE.chainEitherK(flow(getLines, getLifeSupportRating, E.of<string, any>)),
  toFinalProgram
)()
