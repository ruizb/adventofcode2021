import { flow } from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'
import * as T from 'fp-ts/Task'
import * as Logger from 'fp-ts/Console'

export const toFinalProgram = TE.fold(
  flow(Logger.error, T.fromIO),
  flow(Logger.log, T.fromIO)
)
