import { pipe as _, flow as __ } from 'fp-ts/function'
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'
import * as A from 'fp-ts/Array'
import * as N from 'fp-ts/number'

export const buildRange = (
  positions: RNEA.ReadonlyNonEmptyArray<number>
): RNEA.ReadonlyNonEmptyArray<number> =>
  RNEA.range(Math.min(...positions), Math.max(...positions))

const computeFuelConsumption =
  (from: number) =>
  (to: number): number =>
    Math.abs(from - to)

export const getOptimalFuelConsumptionGen =
  (computeFuelConsumptionStrategy: typeof computeFuelConsumption) =>
  (positions: RNEA.ReadonlyNonEmptyArray<number>): number =>
    _(
      buildRange(positions),
      RNEA.reduce([] as number[], (consumptions, rangePosition) =>
        _(
          positions,
          RNEA.map(computeFuelConsumptionStrategy(rangePosition)),
          RNEA.concatAll(N.SemigroupSum),
          consumption => [...consumptions, consumption]
        )
      ),
      A.reduce(+Infinity, Math.min)
    )

export const getOptimalFuelConsumption = getOptimalFuelConsumptionGen(
  computeFuelConsumption
)
