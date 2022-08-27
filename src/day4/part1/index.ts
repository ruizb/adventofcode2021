import { pipe as _, flow as __ } from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'
import * as E from 'fp-ts/Either'
import { getInputFileContents } from '..'
import { toFinalProgram } from '../..'
import { getGameSet } from '../gameSet'
import { simulateGame } from './simulateGame'

_(
  getInputFileContents,
  TE.chainEitherK(__(getGameSet, E.chain(simulateGame))),
  toFinalProgram
)()
