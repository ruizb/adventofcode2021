import { describe, expect, it } from 'vitest'
import { pipe as _ } from 'fp-ts/function'
import * as E from 'fp-ts/Either'
import { run } from '.'
import { getInputFileContents } from '..'

describe('countDangerousOverlaps', () => {
  it('should solve puzzle from adventofcode', async () => {
    const fileContents = await getInputFileContents()
    expect(_(fileContents, E.chain(run))).toEqual(E.right(5197))
  })

  it('should solve example puzzle from adventofcode', () => {
    const fileContents = E.of(`0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2`)
    expect(_(fileContents, E.chain(run))).toEqual(E.right(5))
  })
})
