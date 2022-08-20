import { resolve } from 'path'
import { EOL } from 'os'
import { getFileContents, srcRoot } from '../getFileContents'
import { pipe, absurd } from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'
import * as NEA from 'fp-ts/NonEmptyArray'

const inputFilePath = resolve(srcRoot, './day2/input.txt')

export interface Direction {
  type: 'forward' | 'up' | 'down'
  value: number
}

const getDirection = (rawDirection: string): Direction => {
  const [directionType, strValue] = rawDirection.split(' ')
  return {
    type: directionType as Direction['type'],
    value: parseInt(strValue, 10),
  }
}

export const getDirections = pipe(
  inputFilePath,
  getFileContents,
  TE.map(fileContents =>
    pipe(
      fileContents.split(EOL) as NEA.NonEmptyArray<string>,
      NEA.init,
      m => m as NEA.NonEmptyArray<string>,
      NEA.map(getDirection)
    )
  )
)
