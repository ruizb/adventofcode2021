import { resolve } from 'path'
import { EOL } from 'os'
import { getFileContents, srcRoot } from '../getFileContents'
import { pipe } from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'
import * as NEA from 'fp-ts/NonEmptyArray'

const inputFilePath = resolve(srcRoot, './day1/input.txt')

// We could define a `Measurement` branded type to ensure measurements are positive integers,
// but the input is provided by adventofcode, so let's assume it is correct.
export const getMeasurements = pipe(
  inputFilePath,
  getFileContents,
  TE.map(fileContents =>
    pipe(
      fileContents.split(EOL) as NEA.NonEmptyArray<string>,
      NEA.init,
      m => m as NEA.NonEmptyArray<string>,
      NEA.map(m => parseInt(m, 10))
    )
  )
)
