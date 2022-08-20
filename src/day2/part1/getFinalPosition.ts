import { absurd } from 'fp-ts/function'
import * as NEA from 'fp-ts/NonEmptyArray'
import { Direction } from '..'

export interface Position {
  horizontal: number
  depth: number
}

export const initialPosition: Position = {
  horizontal: 0,
  depth: 0,
}

export const getFinalPosition: (
  directions: NEA.NonEmptyArray<Direction>
) => Position = NEA.reduce(
  initialPosition,
  (position, { type: directionType, value }) => {
    switch (directionType) {
      case 'forward':
        return { ...position, horizontal: position.horizontal + value }
      case 'up':
        return { ...position, depth: position.depth - value }
      case 'down':
        return { ...position, depth: position.depth + value }
      default:
        absurd(directionType)
        return position
    }
  }
)
