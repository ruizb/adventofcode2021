import { pipe, flow } from 'fp-ts/function'
import * as A from 'fp-ts/Array'
import * as E from 'fp-ts/Either'
import * as R from 'fp-ts/Record'
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
  (
    label: string,
    cursor: number,
    getLinesForRating: (linesByBit: LinesByBit) => string[]
  ) =>
  (lines: string[]): E.Either<string, number> =>
    isSingleton(lines)
      ? pipe(lines[0], parseBinToDec, E.of)
      : pipe(
          lines,
          E.fromPredicate(
            lines => new Set(lines).size > 1,
            () => `Duplicate lines detected for ${label} rating`
          ),
          E.map(flow(getLinesByBit(cursor), getLinesForRating)),
          E.filterOrElse(
            linesForRating => linesForRating.length > 0,
            () => `No more lines available to compute ${label} rating`
          ),
          E.chain(getRatingRec(label, cursor + 1, getLinesForRating))
        )

const getOxygenRating = getRatingRec('oxygen', 0, getLinesForOxygenRating)

const getCO2Rating = getRatingRec('co2', 0, getLinesForCO2Rating)

const getRatings = (lines: string[]): E.Either<string[], Ratings> =>
  pipe(
    {
      oxygen: pipe(getOxygenRating(lines), E.mapLeft(A.of)),
      co2: pipe(getCO2Rating(lines), E.mapLeft(A.of)),
    },
    R.sequence(E.getApplicativeValidation(A.getSemigroup<string>()))
  )

export const getLifeSupportRating: (
  lines: string[]
) => E.Either<string[], number> = flow(
  getRatings,
  E.map(({ oxygen, co2 }) => oxygen * co2)
)
