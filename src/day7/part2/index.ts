import { pipe as _, flow as __ } from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'
import { toFinalProgram } from '../..'
import { getInputFileContents } from '..'
import { getOptimalFuelConsumption } from './getOptimalFuelConsumption'
import { parsePositions } from '../part1'

_(
  getInputFileContents,
  TE.map(__(parsePositions, getOptimalFuelConsumption)),
  toFinalProgram
)()
