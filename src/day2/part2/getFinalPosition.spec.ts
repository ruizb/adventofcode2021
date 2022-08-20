import { describe, expect, it } from 'vitest'
import { Right } from 'fp-ts/Either'
import { NonEmptyArray } from 'fp-ts/NonEmptyArray'
import { Direction, getDirections } from '..'
import { getFinalPosition } from './getFinalPosition'

describe('getFinalPosition', () => {
  it('should solve the example puzzle from adventofcode', async () => {
    const directions = [
      { type: 'forward', value: 5 },
      { type: 'down', value: 5 },
      { type: 'forward', value: 8 },
      { type: 'up', value: 3 },
      { type: 'down', value: 8 },
      { type: 'forward', value: 2 },
    ] as NonEmptyArray<Direction>
    const { horizontal, depth } = getFinalPosition(directions)
    expect(horizontal * depth).toEqual(900)
  })

  it('should solve puzzle from adventofcode', async () => {
    const directions = (
      (await getDirections()) as Right<NonEmptyArray<Direction>>
    ).right
    const { horizontal, depth } = getFinalPosition(directions)
    expect(horizontal * depth).toEqual(1599311480)
  })
})
