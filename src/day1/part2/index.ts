import { pipe } from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'
import { countMeasurementWindowIncreases } from './countMeasurementWindowIncreases'
import { getMeasurements } from '..'
import { toFinalProgram } from '../..'

pipe(getMeasurements, TE.map(countMeasurementWindowIncreases), toFinalProgram)()
