import { pipe as _, flow as __ } from 'fp-ts/function'
import * as S from 'fp-ts/string'
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'
import * as TE from 'fp-ts/TaskEither'
import { toFinalProgram, toInt } from '../..'
import { getInputFileContents } from '..'
import { getOptimalFuelConsumption } from './getOptimalFuelConsumption'

export const parsePositions: (
  fileContents: string
) => RNEA.ReadonlyNonEmptyArray<number> = __(S.split(','), RNEA.map(toInt))

_(
  getInputFileContents,
  TE.map(__(parsePositions, getOptimalFuelConsumption)),
  toFinalProgram
)()
