import { pipe as _, flow as __ } from 'fp-ts/function'
import { getOptimalFuelConsumptionGen } from '../part1/getOptimalFuelConsumption'

const computeFuelConsumption =
  (from: number) =>
  (to: number): number => {
    const n = Math.abs(from - to)
    return (n * (n + 1)) / 2
  }

export const getOptimalFuelConsumption = getOptimalFuelConsumptionGen(
  computeFuelConsumption
)
