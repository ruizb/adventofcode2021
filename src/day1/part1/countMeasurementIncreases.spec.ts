import { describe, expect, it } from 'vitest'
import { Right } from 'fp-ts/Either'
import { NonEmptyArray } from 'fp-ts/NonEmptyArray'
import { getMeasurements } from '..'
import { countMeasurementIncreases } from './countMeasurementIncreases'

describe('countMeasurementIncreases', () => {
  it('should solve puzzle from adventofcode', async () => {
    const measurements = (
      (await getMeasurements()) as Right<NonEmptyArray<number>>
    ).right
    expect(countMeasurementIncreases(measurements)).toEqual(1121)
  })
})
