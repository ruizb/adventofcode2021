import { pipe as _, flow as __, increment } from 'fp-ts/function'
import * as N from 'fp-ts/number'
import * as E from 'fp-ts/Either'
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'
import * as Tr from 'monocle-ts/Traversal'
import { toInt } from '../..'

type Fish = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

// type FishGenerations = readonly [number, number, number, number, number, number, number, number number]
type FishGenerations = RNEA.ReadonlyNonEmptyArray<number>

const isFish = (n: number): n is Fish => Number.isInteger(n) && n >= 0 && n <= 8

export const parseFish: (n: string) => E.Either<string, Fish> = __(
  toInt,
  E.fromPredicate(isFish, n => `Invalid fish: ${n}`)
)

const emptyGenerations: FishGenerations = [0, 0, 0, 0, 0, 0, 0, 0, 0]

const incrementFishGeneration = (fish: Fish) =>
  _(Tr.id<FishGenerations>(), Tr.indexNonEmpty(fish), Tr.modify(increment))

const getInitialGenerations: (
  fishes: RNEA.ReadonlyNonEmptyArray<Fish>
) => FishGenerations = RNEA.reduce(emptyGenerations, (generations, fish) =>
  _(generations, incrementFishGeneration(fish))
)

const getNextGenerations = (
  currentGenerations: FishGenerations
): FishGenerations => {
  const newAndResetFishes = currentGenerations[0]
  return [
    currentGenerations[1],
    currentGenerations[2],
    currentGenerations[3],
    currentGenerations[4],
    currentGenerations[5],
    currentGenerations[6],
    currentGenerations[7] + newAndResetFishes,
    currentGenerations[8],
    newAndResetFishes,
  ]
}

const countAllFishes: (generations: FishGenerations) => number = RNEA.concatAll(
  N.SemigroupSum
)

const nextDay = (
  day: number,
  maxDay: number,
  generations: FishGenerations
): FishGenerations =>
  day === maxDay
    ? generations
    : _(generations, getNextGenerations, g => nextDay(day + 1, maxDay, g))

export const countFishes: (
  maxDay: number
) => (fishes: RNEA.ReadonlyNonEmptyArray<Fish>) => number = maxDay =>
  __(getInitialGenerations, g => nextDay(0, maxDay, g), countAllFishes)
