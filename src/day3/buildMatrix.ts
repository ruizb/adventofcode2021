import { pipe, flow, unsafeCoerce, increment, tuple } from 'fp-ts/function'
import * as E from 'fp-ts/Either'
import * as A from 'fp-ts/Array'
import * as RA from 'fp-ts/ReadonlyArray'
import * as NEA from 'fp-ts/NonEmptyArray'
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'
import * as T from 'fp-ts/Tuple'
import * as S from 'fp-ts/string'

export type Bit = '0' | '1'

type DiagnosticNumber = RNEA.ReadonlyNonEmptyArray<Bit>

export type Matrix = NEA.NonEmptyArray<NEA.NonEmptyArray<Bit>>

const diagnosticNumberSize = 12

export const getMostCommonBit: (bits: Bit[]) => Bit = flow(
  A.reduce({ '0': 0, '1': 0 }, (occurrences, bit) => ({
    ...occurrences,
    [bit]: occurrences[bit] + 1,
  })),
  occurrences => (occurrences[0] > occurrences[1] ? '0' : '1')
)

export const invertBit = (bit: Bit): Bit => (bit === '0' ? '1' : '0')

const initMatrix = (firstDiagnosticNumber: DiagnosticNumber): Matrix =>
  pipe(
    diagnosticNumberSize,
    NEA.makeBy(i => [firstDiagnosticNumber[i]])
  )

const hasValidSize: (lineWithIndex: [index: number, line: string]) => boolean =
  flow(T.snd, S.size, size => size === diagnosticNumberSize)

const isValidDiagnosticNumber = (
  lineWithIndex: [index: number, line: RNEA.ReadonlyNonEmptyArray<string>]
): lineWithIndex is [index: number, diagnosticNumber: DiagnosticNumber] =>
  pipe(
    lineWithIndex,
    T.snd,
    // somehow `T.fst` and `A.every` do not play along here...
    unsafeCoerce<RNEA.ReadonlyNonEmptyArray<string>, string[]>,
    A.every((n: string) => n === '0' || n === '1')
  )

const validateLineHasCorrectSize = E.filterOrElse(
  // ([line]) => line.length === diagnosticNumberSize,
  hasValidSize,
  ([index, line]) =>
    `Line ${index} contains more than ${diagnosticNumberSize} characters: ${line}`
)

const validateCharsAreDiagnosticNumber: (
  charsWithIndex: [index: number, chars: RNEA.ReadonlyNonEmptyArray<string>]
) => E.Either<string, [index: number, diagnosticNumber: DiagnosticNumber]> =
  E.fromPredicate(
    isValidDiagnosticNumber,
    ([index, chars]) =>
      `Diagnostic number at line ${index} is invalid: ${chars.join('')}`
  )

const parseLine: (
  index: number,
  line: string
) => E.Either<string, DiagnosticNumber> = flow(
  tuple,
  E.of<string, [number, string]>,
  E.map(T.mapFst(increment)),
  validateLineHasCorrectSize,
  E.chain(
    flow(T.mapSnd(S.split('')), validateCharsAreDiagnosticNumber, E.map(T.snd))
  )
)

const addBitToMatrixAt = (
  bit: Bit,
  index: number
): ((matrix: Matrix) => E.Either<string, Matrix>) =>
  flow(
    NEA.modifyAt(index, A.append(bit)),
    E.fromOption(() => `Tried to append bit to invalid index: ${index}`)
  )

const addDiagnosticNumberBitsToMatrix = (
  matrix: E.Either<string, Matrix>,
  diagnosticNumber: DiagnosticNumber
): E.Either<string, Matrix> =>
  pipe(
    diagnosticNumber,
    RNEA.reduceWithIndex(matrix, (index, matrix, bit) =>
      pipe(matrix, E.chain(addBitToMatrixAt(bit, index)))
    )
  )

export const buildMatrix: (
  lines: NEA.NonEmptyArray<string>
) => E.Either<string, Matrix> = flow(
  NEA.traverseWithIndex(E.Applicative)(parseLine),
  E.chain(
    ([firstDiagnosticNumber, ...restDiagnosticNumbers]) =>
      pipe(
        restDiagnosticNumbers,
        A.reduce(
          E.of<string, Matrix>(initMatrix(firstDiagnosticNumber)),
          addDiagnosticNumberBitsToMatrix
        )
      )
    // flow(
    //   RNEA.unprepend,
    //   RT.mapFst(flow(initMatrix, E.of<string, Matrix>)),
    //   ([matrix, restDiagnosticNumbers]) =>
    //     pipe(
    //       restDiagnosticNumbers,
    //       RA.reduce(matrix, addDiagnosticNumberBitsToMatrix)
    //     )
    // )
  )
)
