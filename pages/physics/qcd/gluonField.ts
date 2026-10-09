import { Complex, TAU } from "./model";

export type AdjointState = [
    Complex,
    Complex,
    Complex,
    Complex,
    Complex,
    Complex,
    Complex,
    Complex,
];

type RealMatrix = number[][];
const evolutionCache = new Map<string, RealMatrix>();

type StructureConstant = {
    indices: [number, number, number];
    value: number;
};

// Independent non-zero structure constants f^{abc} for SU(3), with a < b < c.
const STRUCTURE_CONSTANTS: StructureConstant[] = [
    { indices: [0, 1, 2], value: 1 },
    { indices: [0, 3, 6], value: 1 / 2 },
    { indices: [0, 4, 5], value: -1 / 2 },
    { indices: [1, 3, 5], value: 1 / 2 },
    { indices: [1, 4, 6], value: 1 / 2 },
    { indices: [2, 3, 4], value: 1 / 2 },
    { indices: [2, 5, 6], value: -1 / 2 },
    { indices: [3, 4, 7], value: Math.sqrt(3) / 2 },
    { indices: [5, 6, 7], value: Math.sqrt(3) / 2 },
];

export const GLUON_COMPONENT_COLORS = [
    "#ef4444",
    "#f97316",
    "#eab308",
    "#22c55e",
    "#14b8a6",
    "#3b82f6",
    "#8b5cf6",
    "#d946ef",
];

const zeroMatrix = (size: number): RealMatrix =>
    Array.from({ length: size }, () => Array.from({ length: size }, () => 0));

const identityMatrix = (size: number): RealMatrix => {
    const result = zeroMatrix(size);
    for (let index = 0; index < size; index++) result[index][index] = 1;
    return result;
};

const addMatrices = (left: RealMatrix, right: RealMatrix): RealMatrix =>
    left.map((row, rowIndex) =>
        row.map((value, columnIndex) => value + right[rowIndex][columnIndex])
    );

const scaleMatrix = (matrix: RealMatrix, factor: number): RealMatrix =>
    matrix.map((row) => row.map((value) => value * factor));

const multiplyMatrices = (left: RealMatrix, right: RealMatrix): RealMatrix => {
    const size = left.length;
    const result = zeroMatrix(size);
    for (let row = 0; row < size; row++) {
        for (let column = 0; column < size; column++) {
            for (let inner = 0; inner < size; inner++) {
                result[row][column] += left[row][inner] * right[inner][column];
            }
        }
    }
    return result;
};

const matrixOneNorm = (matrix: RealMatrix) =>
    Math.max(
        ...matrix.map((_, column) =>
            matrix.reduce((sum, row) => sum + Math.abs(row[column]), 0)
        )
    );

// Scaling-and-squaring keeps the Taylor series stable over the full 0…2π range.
const matrixExponential = (matrix: RealMatrix): RealMatrix => {
    const norm = matrixOneNorm(matrix);
    const squarings = Math.max(0, Math.ceil(Math.log2(Math.max(1, norm / 0.5))));
    const scaled = scaleMatrix(matrix, 1 / 2 ** squarings);
    let result = identityMatrix(matrix.length);
    let term = identityMatrix(matrix.length);

    for (let order = 1; order <= 28; order++) {
        term = scaleMatrix(multiplyMatrices(term, scaled), 1 / order);
        result = addMatrices(result, term);
    }
    for (let index = 0; index < squarings; index++) {
        result = multiplyMatrices(result, result);
    }
    return result;
};

const permutationSign = (values: [number, number, number]) => {
    let inversions = 0;
    for (let left = 0; left < values.length; left++) {
        for (let right = left + 1; right < values.length; right++) {
            if (values[left] > values[right]) inversions++;
        }
    }
    return inversions % 2 === 0 ? 1 : -1;
};

export const structureConstant = (a: number, b: number, c: number) => {
    if (a === b || b === c || a === c) return 0;
    const requested: [number, number, number] = [a, b, c];
    const sorted = [...requested].sort((left, right) => left - right) as [
        number,
        number,
        number,
    ];
    const entry = STRUCTURE_CONSTANTS.find(
        ({ indices }) => indices.every((value, index) => value === sorted[index])
    );
    return entry ? entry.value * permutationSign(requested) : 0;
};

/**
 * The adjoint generators are (F^a)_{bc} = -i f^{abc}. Therefore
 * exp(-i θ F^a) is the real orthogonal matrix exp(-θ f^{abc}).
 */
export const adjointEvolutionMatrix = (fieldComponent: number, angle: number) => {
    const key = `${fieldComponent}:${angle}`;
    const cached = evolutionCache.get(key);
    if (cached) return cached;
    const exponent = zeroMatrix(8);
    for (let row = 0; row < 8; row++) {
        for (let column = 0; column < 8; column++) {
            exponent[row][column] =
                -angle * structureConstant(fieldComponent, row, column);
        }
    }
    const evolution = matrixExponential(exponent);
    if (evolutionCache.size >= 32) evolutionCache.delete(evolutionCache.keys().next().value!);
    evolutionCache.set(key, evolution);
    return evolution;
};

export const createAdjointBasisState = (component: number): AdjointState =>
    Array.from({ length: 8 }, (_, index) => ({
        re: index === component ? 1 : 0,
        im: 0,
    })) as AdjointState;

export const evolveAdjointState = (
    state: AdjointState,
    fieldComponent: number,
    angle: number
): AdjointState => {
    const evolution = adjointEvolutionMatrix(fieldComponent, angle);
    const transformed = evolution.map((row) =>
        row.reduce(
            (sum, value, index) => ({
                re: sum.re + value * state[index].re,
                im: sum.im + value * state[index].im,
            }),
            { re: 0, im: 0 }
        )
    ) as AdjointState;
    const norm = Math.sqrt(
        transformed.reduce(
            (sum, value) => sum + value.re * value.re + value.im * value.im,
            0
        )
    );
    return transformed.map((value) => ({
        re: value.re / norm,
        im: value.im / norm,
    })) as AdjointState;
};

export const adjointProbabilities = (state: AdjointState) =>
    state.map((value) => value.re * value.re + value.im * value.im);

export const stateChange = (before: AdjointState, after: AdjointState) =>
    Math.sqrt(
        before.reduce((sum, value, index) => {
            const deltaRe = after[index].re - value.re;
            const deltaIm = after[index].im - value.im;
            return sum + deltaRe * deltaRe + deltaIm * deltaIm;
        }, 0)
    );

export type AdjointCoupling = {
    from: number;
    to: number;
    value: number;
};

export const adjointCouplings = (fieldComponent: number): AdjointCoupling[] => {
    const result: AdjointCoupling[] = [];
    for (let from = 0; from < 8; from++) {
        for (let to = from + 1; to < 8; to++) {
            const value = structureConstant(fieldComponent, from, to);
            if (Math.abs(value) > Number.EPSILON) result.push({ from, to, value });
        }
    }
    return result;
};

export const wrapFieldAngle = (angle: number) => ((angle % TAU) + TAU) % TAU;
