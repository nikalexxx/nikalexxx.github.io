export const TAU = Math.PI * 2;

export type Complex = {
    re: number;
    im: number;
};

export type ColorProbabilities = [number, number, number];
export type ColorState = [Complex, Complex, Complex];

type Matrix = Complex[][];

const complex = (re = 0, im = 0): Complex => ({ re, im });

const add = (a: Complex, b: Complex): Complex => ({
    re: a.re + b.re,
    im: a.im + b.im,
});

const multiply = (a: Complex, b: Complex): Complex => ({
    re: a.re * b.re - a.im * b.im,
    im: a.re * b.im + a.im * b.re,
});

const scale = (a: Complex, value: number): Complex => ({
    re: a.re * value,
    im: a.im * value,
});

const conjugate = (a: Complex): Complex => ({ re: a.re, im: -a.im });

const phase = (angle: number): Complex => ({
    re: Math.cos(angle),
    im: Math.sin(angle),
});

const abs2 = (a: Complex) => a.re * a.re + a.im * a.im;

export function wrapPhase(value: number) {
    return ((value % TAU) + TAU) % TAU;
}

export function signedPhaseDelta(value: number) {
    return ((value + Math.PI) % TAU + TAU) % TAU - Math.PI;
}

export function normalizeWeights(weights: ColorProbabilities): ColorProbabilities {
    const safe = weights.map((value) => Math.max(0, value)) as ColorProbabilities;
    const sum = safe[0] + safe[1] + safe[2];
    if (sum <= Number.EPSILON) return [1 / 3, 1 / 3, 1 / 3];
    return safe.map((value) => value / sum) as ColorProbabilities;
}

export function createColorState(
    probabilities: ColorProbabilities,
    deltaGreen: number,
    deltaBlue: number,
    commonPhase: number,
    anti = false
): ColorState {
    const angles = [commonPhase, commonPhase + deltaGreen, commonPhase + deltaBlue];
    const state = probabilities.map((probability, index) =>
        scale(phase(angles[index]), Math.sqrt(probability))
    ) as ColorState;
    return anti ? (state.map(conjugate) as ColorState) : state;
}

const zeroMatrix = (): Matrix =>
    Array.from({ length: 3 }, () =>
        Array.from({ length: 3 }, () => complex())
    );

const identityMatrix = (): Matrix => {
    const result = zeroMatrix();
    for (let i = 0; i < 3; i++) result[i][i] = complex(1);
    return result;
};

const addMatrices = (a: Matrix, b: Matrix): Matrix =>
    a.map((row, i) => row.map((value, j) => add(value, b[i][j])));

const scaleMatrix = (matrix: Matrix, value: number): Matrix =>
    matrix.map((row) => row.map((item) => scale(item, value)));

const multiplyMatrices = (a: Matrix, b: Matrix): Matrix => {
    const result = zeroMatrix();
    for (let row = 0; row < 3; row++) {
        for (let column = 0; column < 3; column++) {
            for (let k = 0; k < 3; k++) {
                result[row][column] = add(
                    result[row][column],
                    multiply(a[row][k], b[k][column])
                );
            }
        }
    }
    return result;
};

const applyMatrix = (matrix: Matrix, state: ColorState): ColorState =>
    matrix.map((row) =>
        row.reduce(
            (sum, value, index) => add(sum, multiply(value, state[index])),
            complex()
        )
    ) as ColorState;

const matrixExponential = (matrix: Matrix): Matrix => {
    let result = identityMatrix();
    let term = identityMatrix();
    for (let order = 1; order <= 18; order++) {
        term = scaleMatrix(multiplyMatrices(term, matrix), 1 / order);
        result = addMatrices(result, term);
    }
    return result;
};

const R = complex(1);
const I = complex(0, 1);
const MI = complex(0, -1);
const Z = () => complex();

const gellMann: Matrix[] = [
    [[Z(), R, Z()], [R, Z(), Z()], [Z(), Z(), Z()]],
    [[Z(), MI, Z()], [I, Z(), Z()], [Z(), Z(), Z()]],
    [[R, Z(), Z()], [Z(), complex(-1), Z()], [Z(), Z(), Z()]],
    [[Z(), Z(), R], [Z(), Z(), Z()], [R, Z(), Z()]],
    [[Z(), Z(), MI], [Z(), Z(), Z()], [I, Z(), Z()]],
    [[Z(), Z(), Z()], [Z(), Z(), R], [Z(), R, Z()]],
    [[Z(), Z(), Z()], [Z(), Z(), MI], [Z(), I, Z()]],
    [
        [complex(1 / Math.sqrt(3)), Z(), Z()],
        [Z(), complex(1 / Math.sqrt(3)), Z()],
        [Z(), Z(), complex(-2 / Math.sqrt(3))],
    ],
];

export const GLUON_NAMES = [
    "λ₁ · r↔g",
    "λ₂ · r↔g",
    "λ₃ · фаза r/g",
    "λ₄ · r↔b",
    "λ₅ · r↔b",
    "λ₆ · g↔b",
    "λ₇ · g↔b",
    "λ₈ · диагональ",
];

export const GLUON_MATRICES = [
    { factor: "½", cells: [["0", "1", "0"], ["1", "0", "0"], ["0", "0", "0"]] },
    { factor: "½", cells: [["0", "−i", "0"], ["i", "0", "0"], ["0", "0", "0"]] },
    { factor: "½", cells: [["1", "0", "0"], ["0", "−1", "0"], ["0", "0", "0"]] },
    { factor: "½", cells: [["0", "0", "1"], ["0", "0", "0"], ["1", "0", "0"]] },
    { factor: "½", cells: [["0", "0", "−i"], ["0", "0", "0"], ["i", "0", "0"]] },
    { factor: "½", cells: [["0", "0", "0"], ["0", "0", "1"], ["0", "1", "0"]] },
    { factor: "½", cells: [["0", "0", "0"], ["0", "0", "−i"], ["0", "i", "0"]] },
    { factor: "1⁄(2√3)", cells: [["1", "0", "0"], ["0", "1", "0"], ["0", "0", "−2"]] },
];

export function applyGluon(
    state: ColorState,
    gluonIndex: number,
    angle: number,
    anti = false
): ColorState {
    const generator = gellMann[gluonIndex].map((row) =>
        row.map((value) => (anti ? conjugate(value) : value))
    );
    const coefficient = anti ? complex(0, angle / 2) : complex(0, -angle / 2);
    const exponent = generator.map((row) =>
        row.map((value) => multiply(coefficient, value))
    );
    const transformed = applyMatrix(matrixExponential(exponent), state);
    const norm = Math.sqrt(transformed.reduce((sum, value) => sum + abs2(value), 0));
    return transformed.map((value) => scale(value, 1 / norm)) as ColorState;
}

export function describeColorState(state: ColorState) {
    const probabilities = state.map(abs2) as ColorProbabilities;
    const phases = state.map((value) => Math.atan2(value.im, value.re));
    return {
        probabilities,
        deltaGreen: wrapPhase(phases[1] - phases[0]),
        deltaBlue: wrapPhase(phases[2] - phases[0]),
        commonPhase: wrapPhase(phases[0]),
    };
}
