import { describe, expect, it } from 'vitest'
import * as E from 'fp-ts/Either'
import { getLines } from '.'
import { getLifeSupportRating } from './getLifeSupportRating'
import { getInputFileContents } from '../'

describe('getLifeSupportRating', () => {
  it('should solve the example puzzle from adventofcode', () => {
    const lines = [
      '00100',
      '11110',
      '10110',
      '10111',
      '10101',
      '01111',
      '00111',
      '11100',
      '10000',
      '11001',
      '00010',
      '01010',
    ]
    expect(getLifeSupportRating(lines)).toEqual(E.right(230))
  })

  it('should solve puzzle from adventofcode', async () => {
    const lines = getLines(
      ((await getInputFileContents()) as E.Right<string>).right
    )
    expect(getLifeSupportRating(lines)).toEqual(E.right(4412188))
  })

  it('should handle duplicate lines', () => {
    const lines = ['10101', '11110', '11110', '01011']
    expect(getLifeSupportRating(lines)).toEqual(
      E.left(['Duplicate lines detected for oxygen rating'])
    )
  })

  it('should handle rating with 0 lines', () => {
    const lines = ['10101', '10010', '11011']
    expect(getLifeSupportRating(lines)).toEqual(
      E.left(['No more lines available to compute co2 rating'])
    )
  })
})
