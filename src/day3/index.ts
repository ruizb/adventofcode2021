import { resolve } from 'path'
import { EOL } from 'os'
import { pipe } from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'
import * as NEA from 'fp-ts/NonEmptyArray'
import { getFileContents, srcRoot } from '../getFileContents'
import { buildMatrix } from './buildMatrix'

const inputFilePath = resolve(srcRoot, './day3/input.txt')

export const getInputFileContents = pipe(
  getFileContents(inputFilePath),
  TE.mapLeft(error => error.message)
)

export const getMatrix = (fileContents: string) =>
  pipe(
    fileContents.split(EOL) as NEA.NonEmptyArray<string>,
    lines =>
      NEA.last(lines) === ''
        ? (NEA.init(lines) as NEA.NonEmptyArray<string>)
        : lines,
    buildMatrix
  )
