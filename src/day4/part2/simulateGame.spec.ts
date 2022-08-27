import { describe, expect, it } from 'vitest'
import { pipe as _ } from 'fp-ts/function'
import * as E from 'fp-ts/Either'
import { GameSet, getGameSet } from '../gameSet'
import {
  simulateGame,
  toGameSetPart2,
  validateGameSetPart2,
} from './simulateGame'
import { getInputFileContents } from '..'

const gameSet = (fileContents: E.Either<string, string>) =>
  _(
    fileContents,
    E.chain(getGameSet),
    E.map(toGameSetPart2),
    E.chain(validateGameSetPart2)
  )

const simulateGameWithGameSet = E.chain(simulateGame)

describe('simulateGame', () => {
  it('should solve puzzle from adventofcode', async () => {
    const fileContents = await getInputFileContents()
    expect(simulateGameWithGameSet(gameSet(fileContents))).toEqual(
      E.right(30070)
    )
  })

  it('should solve example puzzle from adventofcode', () => {
    const fileContents =
      E.of(`7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7`)
    expect(simulateGameWithGameSet(gameSet(fileContents))).toEqual(
      E.right(1924)
    )
  })

  it('should handle input with duplicated boards', () => {
    const fileContents =
      E.of(`7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7`)
    expect(simulateGameWithGameSet(gameSet(fileContents))).toEqual(
      E.left('Found 2 duplicated boards')
    )
  })
})
