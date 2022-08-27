import { describe, expect, it } from 'vitest'
import { Right, left, right } from 'fp-ts/Either'
import { GameSet, getGameSet } from '../gameSet'
import { simulateGame } from './simulateGame'
import { getInputFileContents } from '..'

describe('simulateGame', () => {
  it('should solve puzzle from adventofcode', async () => {
    const fileContents = ((await getInputFileContents()) as Right<string>).right
    const gameSet = (getGameSet(fileContents) as Right<GameSet>).right
    expect(simulateGame(gameSet)).toEqual(right(33462))
  })

  it('should solve example puzzle from adventofcode', () => {
    const fileContents = `7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

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
 2  0 12  3  7`
    const gameSet = (getGameSet(fileContents) as Right<GameSet>).right
    expect(simulateGame(gameSet)).toEqual(right(4512))
  })

  it('should handle empty input', () => {
    const fileContents = ''
    expect(getGameSet(fileContents)).toEqual(
      left('There are no lines to parse')
    )
  })

  it('should handle input with only 1 line', () => {
    const fileContents = '1,2,3'
    expect(getGameSet(fileContents)).toEqual(
      left('Missing lines containing the boards')
    )
  })

  it('should handle input with an incomplete board', () => {
    const fileContents = `7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7`
    expect(getGameSet(fileContents)).toEqual(left('Board 2 is incomplete'))
  })

  it('should handle input with no winning board', () => {
    const fileContents = `7,4,9,5,11,17,23,2,0,14,21

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
 2  0 12  3  7`
    const gameSet = (getGameSet(fileContents) as Right<GameSet>).right
    expect(simulateGame(gameSet)).toEqual(left('There is no winner'))
  })
})
