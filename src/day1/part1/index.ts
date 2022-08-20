import { pipe } from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'
import { countMeasurementIncreases } from './countMeasurementIncreases'
import { getMeasurements } from '..'
import { toFinalProgram } from '../..'

pipe(getMeasurements, TE.map(countMeasurementIncreases), toFinalProgram)()
