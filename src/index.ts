import { flow } from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'
import * as T from 'fp-ts/Task'
import * as Logger from 'fp-ts/Console'

export const parseBinToDec = (b: string): number => parseInt(b, 2)

export const toFinalProgram = TE.fold(
  flow(Logger.error, T.fromIO),
  flow(Logger.log, T.fromIO)
)
