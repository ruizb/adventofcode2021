import { describe, expect, it } from 'vitest'
import { Right, left } from 'fp-ts/Either'
import { Matrix } from '../buildMatrix'
import { getMatrix, getInputFileContents } from '..'
import {
  computeRates,
  computePowerConsumption,
} from './computePowerConsumption'

describe('computePowerConsumption', () => {
  it('should solve puzzle from adventofcode', async () => {
    const fileContents = ((await getInputFileContents()) as Right<string>).right
    const matrix = (getMatrix(fileContents) as Right<Matrix>).right
    const rates = computeRates(matrix)
    expect(computePowerConsumption(rates)).toEqual(3901196)
  })

  it('should handle invalid input containing line with more than 12 characters', () => {
    const fileContents = `110100110100
111001101001
1011011011011
100111001010`
    const matrix = getMatrix(fileContents)
    expect(matrix).toEqual(
      left('Line 3 contains more than 12 characters: 1011011011011')
    )
  })

  it('should handle invalid input containing invalid diagnostic number', () => {
    const fileContents = `110100110100
111001101001
101101101101
100111031010`
    const matrix = getMatrix(fileContents)
    expect(matrix).toEqual(
      left('Diagnostic number at line 4 is invalid: 100111031010')
    )
  })
})
