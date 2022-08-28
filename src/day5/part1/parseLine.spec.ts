import { describe, expect, it } from 'vitest'
import { pipe as _ } from 'fp-ts/function'
import * as E from 'fp-ts/Either'
import { parseLine } from '.'

describe('parseLine', () => {
  it('should return Right<Line> if line is valid', () => {
    const line = '1,23 -> 45,6'
    expect(parseLine(line)).toEqual(
      E.right({ start: { x: 1, y: 23 }, end: { x: 45, y: 6 } })
    )
  })

  const invalidCases = [
    '->',
    '1 -> 4',
    '1 -> 3,4',
    '1,2 -> 3',
    '1, -> 3,4',
    ' -> 3,4',
    '1,2 -> ',
    '1, -> 3,4',
    ',2 -> 3,4',
    '1,2 -> 3,',
    '1,2 -> ,4',
    '1,2 => 3,4',
    '1,2 --> 3,4',
    '1,2->3,4',
  ]
  it.each(invalidCases)(
    'should return Left<string> when the line is: %s',
    line => {
      expect(parseLine(line)).toEqual(
        E.left('Line has invalid format. Valid format: x0,y0 -> x1,y1')
      )
    }
  )
})
