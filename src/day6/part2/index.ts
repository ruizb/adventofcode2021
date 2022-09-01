import { pipe as _, flow as __ } from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'
import * as E from 'fp-ts/Either'
import { getInputFileContents } from '..'
import { countFishes } from '../part1/countFishes'
import { parseFishes } from '../part1'
import { toFinalProgram } from '../..'

_(
  getInputFileContents,
  TE.chainEitherK(__(parseFishes, E.map(countFishes(256)))),
  toFinalProgram
)()
