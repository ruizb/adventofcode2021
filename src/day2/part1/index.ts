import { pipe, flow } from 'fp-ts/lib/function'
import * as TE from 'fp-ts/TaskEither'
import { getFinalPosition } from './getFinalPosition'
import { getDirections } from '..'
import { toFinalProgram } from '../..'

pipe(
  getDirections,
  TE.map(flow(getFinalPosition, ({ horizontal, depth }) => horizontal * depth)),
  toFinalProgram
)()
