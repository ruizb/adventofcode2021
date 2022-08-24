import { EOL } from 'os'

import { pipe, flow } from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'
import * as NEA from 'fp-ts/NonEmptyArray'

import {
  computePowerConsumption,
  computeRates,
} from './computePowerConsumption'
import { getInputFileContents } from '..'
import { toFinalProgram } from '../..'
import { buildMatrix } from './buildMatrix'

export const getMatrix = (fileContents: string) =>
  pipe(
    fileContents.split(EOL) as NEA.NonEmptyArray<string>,
    lines =>
      NEA.last(lines) === ''
        ? (NEA.init(lines) as NEA.NonEmptyArray<string>)
        : lines,
    buildMatrix
  )

pipe(
  getInputFileContents,
  TE.chainEitherK(getMatrix),
  TE.map(flow(computeRates, computePowerConsumption)),
  toFinalProgram
)()
