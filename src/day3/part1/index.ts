import { pipe, flow } from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'

import {
  computePowerConsumption,
  computeRates,
} from './computePowerConsumption'
import { getInputFileContents, getMatrix } from '..'
import { toFinalProgram } from '../..'

pipe(
  getInputFileContents,
  TE.chainEitherK(getMatrix),
  TE.map(flow(computeRates, computePowerConsumption)),
  toFinalProgram
)()
