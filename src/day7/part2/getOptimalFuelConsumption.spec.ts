import { describe, expect, it } from 'vitest'
import { pipe as _, flow as __ } from 'fp-ts/function'
import * as E from 'fp-ts/Either'
import { getInputFileContents } from '..'
import { parsePositions } from '../part1'
import { getOptimalFuelConsumption } from './getOptimalFuelConsumption'

describe('getOptimalFuelConsumption', () => {
  it('should solve puzzle from adventofcode', async () => {
    const fileContents = await getInputFileContents()
    expect(
      _(fileContents, E.map(__(parsePositions, getOptimalFuelConsumption)))
    ).toEqual(E.right(100148777))
  })

  it('should solve example puzzle from adventofcode', () => {
    const fileContents = E.of('16,1,2,0,4,2,7,1,2,14')
    expect(
      _(fileContents, E.map(__(parsePositions, getOptimalFuelConsumption)))
    ).toEqual(E.right(168))
  })
})
