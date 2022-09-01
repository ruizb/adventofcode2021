import { pipe as _, flow as __ } from 'fp-ts/function'
import * as S from 'fp-ts/string'
import * as TE from 'fp-ts/TaskEither'
import * as E from 'fp-ts/Either'
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'
import { getInputFileContents } from '..'
import { countFishes, parseFish } from './countFishes'
import { toFinalProgram } from '../..'

export const parseFishes = (fileContents: string) =>
  _(fileContents, S.trim, S.split(','), RNEA.traverse(E.Applicative)(parseFish))

_(
  getInputFileContents,
  TE.chainEitherK(__(parseFishes, E.map(countFishes(80)))),
  toFinalProgram
)()
