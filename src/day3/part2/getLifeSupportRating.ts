import { pipe, flow } from 'fp-ts/function'
import * as A from 'fp-ts/Array'
import { Bit } from '../buildMatrix'
import { parseBinToDec } from '../..'

interface Ratings {
  oxygen: number
  co2: number
}

type LinesByBit = Record<Bit, string[]>

const initialLinesByBit: LinesByBit = {
  '0': [],
  '1': [],
}

const getLinesByBit: (
  cursor: number
) => (lines: string[]) => LinesByBit = cursor =>
  A.reduce(initialLinesByBit, (linesByBit, line) => {
    const bit = line[cursor] as Bit
    return {
      ...linesByBit,
      [bit]: [...linesByBit[bit], line],
    }
  })

const getLinesForOxygenRating = (linesByBit: LinesByBit): string[] => {
  const bit: Bit = linesByBit['1'].length >= linesByBit['0'].length ? '1' : '0'
  return linesByBit[bit]
}

const getLinesForCO2Rating = (linesByBit: LinesByBit): string[] => {
  const bit: Bit = linesByBit['0'].length <= linesByBit['1'].length ? '0' : '1'
  return linesByBit[bit]
}

const isSingleton = <A>(as: A[]): as is [A] => as.length === 1

const getRatingRec =
  (cursor: number, getLinesForRating: (linesByBit: LinesByBit) => string[]) =>
  (lines: string[]): number =>
    isSingleton(lines)
      ? parseBinToDec(lines[0])
      : pipe(
          lines,
          getLinesByBit(cursor),
          getLinesForRating,
          getRatingRec(cursor + 1, getLinesForRating)
        )

const getOxygenRating = getRatingRec(0, getLinesForOxygenRating)

const getCO2Rating = getRatingRec(0, getLinesForCO2Rating)

const getRatings = (lines: string[]): Ratings => ({
  oxygen: getOxygenRating(lines),
  co2: getCO2Rating(lines),
})

export const getLifeSupportRating: (lines: string[]) => number = flow(
  getRatings,
  ({ oxygen, co2 }) => oxygen * co2
)
