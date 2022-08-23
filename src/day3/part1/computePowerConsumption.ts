import { pipe, flow } from 'fp-ts/function'
import * as NEA from 'fp-ts/NonEmptyArray'
import * as S from 'fp-ts/string'
import * as R from 'fp-ts/Record'
import { getMostCommonBit, invertBit, Matrix } from '../buildMatrix'
import { parseBinToDec } from '../..'

interface Rates {
  gamma: number
  epsilon: number
}

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
