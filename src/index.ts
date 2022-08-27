import { EOL } from 'os'
import { pipe, flow } from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'
import * as T from 'fp-ts/Task'
import * as NEA from 'fp-ts/NonEmptyArray'
import * as Logger from 'fp-ts/Console'

export const parseBinToDec = (b: string): number => parseInt(b, 2)

export const toInt = (s: string) => parseInt(s, 10)

export const getLines = (fileContents: string): string[] =>
  pipe(fileContents.split(EOL) as NEA.NonEmptyArray<string>, lines =>
    NEA.last(lines) === ''
      ? (NEA.init(lines) as NEA.NonEmptyArray<string>)
      : lines
  )

export const toFinalProgram = TE.fold(
  flow(Logger.error, T.fromIO),
  flow(Logger.log, T.fromIO)
)
