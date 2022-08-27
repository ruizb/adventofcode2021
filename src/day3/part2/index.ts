import { pipe, flow } from 'fp-ts/function'
import * as T from 'fp-ts/Task'
import * as TE from 'fp-ts/TaskEither'
import * as A from 'fp-ts/lib/Array'
import * as E from 'fp-ts/lib/Either'

import { getLifeSupportRating } from './getLifeSupportRating'
import { getInputFileContents } from '..'
import { getLines, toFinalProgram } from '../..'

pipe(
  getInputFileContents,
  T.map(E.mapLeft(A.of)), // string => string[]
  TE.chainEitherK(flow(getLines, getLifeSupportRating)),
  toFinalProgram
)()
