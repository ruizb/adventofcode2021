import { pipe as _, flow as __ } from 'fp-ts/function'
import * as T from 'fp-ts/Task'
import * as E from 'fp-ts/Either'
import { getInputFileContents } from '..'
import { toFinalProgram } from '../..'
import {
  simulateGame,
  toGameSetPart2,
  validateGameSetPart2,
} from './simulateGame'
import { getGameSet } from '../gameSet'

_(
  getInputFileContents,
  T.map(
    __(
      E.bindTo('fileContents'),
      E.bind('gameSet', ({ fileContents }) =>
        _(getGameSet(fileContents), E.map(toGameSetPart2))
      ),
      E.bind('validGameSet', ({ gameSet }) => validateGameSetPart2(gameSet)),
      E.bind('result', ({ validGameSet }) => simulateGame(validGameSet)),
      E.map(({ result }) => result)
    )
  ),
  toFinalProgram
)()
