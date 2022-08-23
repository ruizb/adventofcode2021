import { describe, expect, it } from 'vitest'
import { Right } from 'fp-ts/Either'
import { getLines } from '.'
import { getLifeSupportRating } from './getLifeSupportRating'
import { getInputFileContents } from '../'

describe('getLifeSupportRating', () => {
  it('should solve the example puzzle from adventofcode', async () => {
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
    expect(getLifeSupportRating(lines)).toEqual(230)
  })

  it('should solve puzzle from adventofcode', async () => {
    const lines = getLines(
      ((await getInputFileContents()) as Right<string>).right
    )
    expect(getLifeSupportRating(lines)).toEqual(4412188)
  })
})
