import { absurd } from 'fp-ts/function'
import * as NEA from 'fp-ts/NonEmptyArray'
import {
  Position as BasePosition,
  initialPosition as baseInitialPosition,
} from '../part1/getFinalPosition'
import { Direction } from '..'

interface Position extends BasePosition {
  aim: number
}

const initialPosition: Position = {
  ...baseInitialPosition,
  aim: 0,
}

export const getFinalPosition: (
  directions: NEA.NonEmptyArray<Direction>
) => Position = NEA.reduce(
  initialPosition,
  (position, { type: directionType, value }) => {
    switch (directionType) {
      case 'forward':
        return {
          ...position,
          horizontal: position.horizontal + value,
          depth: position.depth + position.aim * value,
        }
      case 'up':
        return { ...position, aim: position.aim - value }
      case 'down':
        return { ...position, aim: position.aim + value }
      default:
        absurd(directionType)
        return position
    }
  }
)
