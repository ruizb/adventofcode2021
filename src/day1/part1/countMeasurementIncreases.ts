import * as NEA from 'fp-ts/NonEmptyArray'

const countMeasurementIncreasesRec = (
  previousMeasurement: number,
  remainingMeasurements: NEA.NonEmptyArray<number>,
  increases: number
): number => {
  const [currentMeasurement, newRemainingMeasurements] = NEA.unprepend(
    remainingMeasurements
  )
  const newIncreases =
    increases + (currentMeasurement > previousMeasurement ? 1 : 0)

  if (newRemainingMeasurements.length === 0) {
    return newIncreases
  }

  return countMeasurementIncreasesRec(
    currentMeasurement,
    newRemainingMeasurements as NEA.NonEmptyArray<number>,
    newIncreases
  )
}

export const countMeasurementIncreases = (
  measurements: NEA.NonEmptyArray<number>
): number =>
  countMeasurementIncreasesRec(
    NEA.head(measurements),
    NEA.tail(measurements) as NEA.NonEmptyArray<number>,
    0
  )
