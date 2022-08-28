import { resolve } from 'path'
import { getFileContents, srcRoot } from '../getFileContents'

const inputFilePath = resolve(srcRoot, './day5/input.txt')

export const getInputFileContents = getFileContents(inputFilePath)
