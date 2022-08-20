import { resolve } from 'path'
import { promises as fs } from 'fs'
import { toError } from 'fp-ts/lib/Either'
import { tryCatch, TaskEither } from 'fp-ts/lib/TaskEither'

export const srcRoot = resolve(__dirname, '../src')

export const getFileContents = (path: string): TaskEither<Error, string> =>
  tryCatch(() => fs.readFile(path, 'utf-8'), toError)
