import { describe, expect, it } from 'vitest'
import { Right } from 'fp-ts/Either'
import { NonEmptyArray } from 'fp-ts/NonEmptyArray'
import { getMeasurements } from '..'
import { countMeasurementWindowIncreases } from './countMeasurementWindowIncreases'

describe('countMeasurementWindowIncreases', () => {
  it('should solve puzzle from adventofcode', async () => {
    const measurements = (
      (await getMeasurements()) as Right<NonEmptyArray<number>>
    ).right
    expect(countMeasurementWindowIncreases(measurements)).toEqual(1065)
  })
})
