import { describe, expect, it } from 'vitest'
import { pipe as _, flow as __ } from 'fp-ts/function'
import * as E from 'fp-ts/Either'
import { getInputFileContents } from '..'
import { parseFishes } from '.'
import { countFishes } from './countFishes'

describe('countFishes', () => {
  it('should solve puzzle from adventofcode (80 days)', async () => {
    const fileContents = await getInputFileContents()
    expect(
      _(fileContents, E.chain(parseFishes), E.map(countFishes(80)))
    ).toEqual(E.right(360268))
  })

  it('should solve puzzle from adventofcode (256 days)', async () => {
    const fileContents = await getInputFileContents()
    expect(
      _(fileContents, E.chain(parseFishes), E.map(countFishes(256)))
    ).toEqual(E.right(1632146183902))
  })

  it('should solve example puzzle from adventofcode (80 days)', () => {
    const fileContents = E.of('3,4,3,1,2')
    expect(
      _(fileContents, E.chain(parseFishes), E.map(countFishes(80)))
    ).toEqual(E.right(5934))
  })

  it('should solve example puzzle from adventofcode (256 days)', () => {
    const fileContents = E.of('3,4,3,1,2')
    expect(
      _(fileContents, E.chain(parseFishes), E.map(countFishes(256)))
    ).toEqual(E.right(26984457539))
  })
})
