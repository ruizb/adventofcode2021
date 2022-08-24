import { resolve } from 'path'
import { pipe } from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'
import { getFileContents, srcRoot } from '../getFileContents'

export type Bit = '0' | '1'

const inputFilePath = resolve(srcRoot, './day3/input.txt')

export const getInputFileContents = pipe(
  getFileContents(inputFilePath),
  TE.mapLeft(error => error.message)
)
