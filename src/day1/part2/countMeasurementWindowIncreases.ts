import { identity, pipe } from 'fp-ts/function'
import * as A from 'fp-ts/Array'
import * as NEA from 'fp-ts/NonEmptyArray'
import * as N from 'fp-ts/number'

type CompleteMeasurementWindow = [number, number, number]
type PartialMeasurementWindow = [number] | [number, number]
type MeasurementWindow = PartialMeasurementWindow | CompleteMeasurementWindow

const getWindowSum: (w: CompleteMeasurementWindow) => number = NEA.concatAll(
  N.SemigroupSum
)

const getIncrement = (w1: MeasurementWindow, w2: MeasurementWindow): 0 | 1 =>
  isCompleteWindow(w1) &&
  isCompleteWindow(w2) &&
  getWindowSum(w1) < getWindowSum(w2)
    ? 1
    : 0

const addMeasurementToPartialWindow =
  (measurement: number) =>
  (w: MeasurementWindow): MeasurementWindow =>
    isCompleteWindow(w) ? w : [...w, measurement]

const initWindow = (firstMeasurement: number): MeasurementWindow => [
  firstMeasurement,
]

const canCreateNewWindow = (remainingMeasurements: number[]): boolean =>
  remainingMeasurements.length >= 2

const isCompleteWindow = (
  w: MeasurementWindow
): w is CompleteMeasurementWindow =>
  w.length === 3 && w.every(m => typeof m === 'number')

const countMeasurementWindowIncreasesRec = (
  measurement: number,
  remainingMeasurements: number[],
  ongoingWindows: NEA.NonEmptyArray<MeasurementWindow>,
  increases: number
): number => {
  const [window1, window2, ...restWindows] = pipe(
    ongoingWindows,
    NEA.map(addMeasurementToPartialWindow(measurement)),
    canCreateNewWindow(remainingMeasurements)
      ? A.append(initWindow(measurement))
      : identity
  )

  const newIncreases = increases + getIncrement(window1, window2)

  if (remainingMeasurements.length === 0) {
    return newIncreases
  }

  const newOngoingWindows: NEA.NonEmptyArray<MeasurementWindow> =
    isCompleteWindow(window1) && isCompleteWindow(window2)
      ? [window2, ...restWindows]
      : [window1, window2, ...restWindows]

  const [newMeasurement, ...newRemainingMeasurements] = remainingMeasurements

  return countMeasurementWindowIncreasesRec(
    newMeasurement,
    newRemainingMeasurements,
    newOngoingWindows,
    newIncreases
  )
}

export const countMeasurementWindowIncreases = (
  measurements: NEA.NonEmptyArray<number>
): number => {
  const [firstMeasurement, remainingMeasurements] = NEA.unprepend(measurements)
  return countMeasurementWindowIncreasesRec(
    firstMeasurement,
    remainingMeasurements,
    [initWindow(firstMeasurement)],
    0
  )
}
