import { resolve } from 'path'
import { promises as fs } from 'fs'
import { tryCatch, TaskEither } from 'fp-ts/TaskEither'

export const srcRoot = resolve(__dirname, '../src')

export const getFileContents = (path: string): TaskEither<string, string> =>
  tryCatch(() => fs.readFile(path, 'utf-8'), String)
