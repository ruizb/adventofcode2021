import { resolve } from 'path'
import { getFileContents, srcRoot } from '../getFileContents'

export type Bit = '0' | '1'

const inputFilePath = resolve(srcRoot, './day3/input.txt')

export const getInputFileContents = getFileContents(inputFilePath)
