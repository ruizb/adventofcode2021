import { pipe, flow } from 'fp-ts/function'
import * as A from 'fp-ts/Array'
import * as NEA from 'fp-ts/NonEmptyArray'
import * as S from 'fp-ts/string'
import * as R from 'fp-ts/Record'
import { Bit, Matrix } from '../buildMatrix'

interface Rates {
  gamma: number
  epsilon: number
}

const parseBinToDec = (b: string): number => parseInt(b, 2)

const getMostCommonBit: (bits: Bit[]) => Bit = flow(
  A.reduce({ '0': 0, '1': 0 }, (occurrences, bit) => ({
    ...occurrences,
    [bit]: occurrences[bit] + 1,
  })),
  occurrences => (occurrences[0] > occurrences[1] ? '0' : '1')
)

const invertBit = (bit: Bit): Bit => (bit === '0' ? '1' : '0')

export const computeRates: (matrix: Matrix) => Rates = flow(
  NEA.map(getMostCommonBit),
  mostCommonBits => ({
    gamma: mostCommonBits,
    epsilon: pipe(mostCommonBits, NEA.map(invertBit)),
  }),
  R.map(flow(NEA.concatAll(S.Semigroup), parseBinToDec))
)

export const computePowerConsumption = ({ gamma, epsilon }: Rates): number =>
  gamma * epsilon
