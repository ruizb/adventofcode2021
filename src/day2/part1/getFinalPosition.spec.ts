import { describe, expect, it } from 'vitest'
import { Right } from 'fp-ts/Either'
import { NonEmptyArray } from 'fp-ts/NonEmptyArray'
import { Direction, getDirections } from '..'
import { getFinalPosition } from './getFinalPosition'

describe('getFinalPosition', () => {
  it('should solve puzzle from adventofcode', async () => {
    const directions = (
      (await getDirections()) as Right<NonEmptyArray<Direction>>
    ).right
    const { horizontal, depth } = getFinalPosition(directions)
    expect(horizontal * depth).toEqual(2019945)
  })
})
