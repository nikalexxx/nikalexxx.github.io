import { AdjointState, createAdjointBasisState } from "./gluonField";
import { Complex, ColorProbabilities, gellMann, wrapPhase } from "./model";

export const COLUMN_NAMES = ["r̄", "ḡ", "b̄"];
export const COLUMN_COLORS = ["#ef4444", "#22b85a", "#3978ff"];
const EPSILON = 1e-10;
export const absSquared = (z: Complex) => z.re ** 2 + z.im ** 2;

export function normalizeAdjoint(values: AdjointState): AdjointState {
    const norm = Math.sqrt(values.reduce((sum, z) => sum + absSquared(z), 0));
    if (norm < EPSILON) return createAdjointBasisState(0);
    return values.map(z => ({ re: z.re / norm, im: z.im / norm })) as AdjointState;
}

export function exampleGluon(): AdjointState {
    // Separated torus positions; equal diagonal magnitudes with phases 120°
    // apart give zero trace without a projection that would move the markers.
    const phases = [.45, .45 - Math.PI / 3, .45 + 4 * Math.PI / 3 - .9 * Math.PI];
    const relative = [[0, .5 * Math.PI, .5 * Math.PI],
        [0, Math.PI, 1.5 * Math.PI], [0, 1.5 * Math.PI, .9 * Math.PI]];
    const magnitudes = [[.25, .1, .4], [.4, .25, .12], [.2, .4, .25]];
    const matrix = [0, 1, 2].map(row => [0, 1, 2].map(col => ({
        re: magnitudes[col][row] * Math.cos(phases[col] + relative[col][row]),
        im: magnitudes[col][row] * Math.sin(phases[col] + relative[col][row]),
    })));
    return normalizeAdjoint(gellMann.map(basis =>
        matrix.reduce((sum, row, i) => row.reduce((acc, z, j) => ({
            re: acc.re + (basis[i][j].re * z.re + basis[i][j].im * z.im) / Math.SQRT2,
            im: acc.im + (basis[i][j].re * z.im - basis[i][j].im * z.re) / Math.SQRT2,
        }), sum), { re: 0, im: 0 })
    ) as AdjointState);
}

// B_a = λ_a / √2 is orthonormal for the Hilbert–Schmidt inner product.
export function adjointToMatrix(state: AdjointState): Complex[][] {
    return Array.from({ length: 3 }, (_, row) =>
        Array.from({ length: 3 }, (_, column) =>
            state.reduce((sum, coefficient, a) => {
                const basis = gellMann[a][row][column];
                return {
                    re: sum.re + (coefficient.re * basis.re - coefficient.im * basis.im) / Math.SQRT2,
                    im: sum.im + (coefficient.re * basis.im + coefficient.im * basis.re) / Math.SQRT2,
                };
            }, { re: 0, im: 0 })
        )
    );
}

export function matrixToAdjoint(matrix: Complex[][]): AdjointState {
    return gellMann.map(basis => matrix.reduce((sum, row, i) =>
        row.reduce((acc, value, j) => ({
            re: acc.re + (basis[i][j].re * value.re + basis[i][j].im * value.im) / Math.SQRT2,
            im: acc.im + (basis[i][j].re * value.im - basis[i][j].im * value.re) / Math.SQRT2,
        }), sum), { re: 0, im: 0 })) as AdjointState;
}

/** Edit one column while keeping G traceless. Its diagonal change is shared
 * between the other two diagonal cells; normalization preserves its RGB ratios. */
export function editTriadColumn(
    state: AdjointState, index: number,
    options: { probabilities?: ColorProbabilities; deltaGreen?: number; deltaBlue?: number }
): AdjointState {
    const column = describeTriad(state)[index];
    const probabilities = options.probabilities ?? column.probabilities;
    const amplitude = column.active ? column.amplitude : 1 / Math.sqrt(3);
    const phase = column.phase;
    const angles = [phase, phase + (options.deltaGreen ?? column.deltaGreen),
        phase + (options.deltaBlue ?? column.deltaBlue)];
    const matrix = adjointToMatrix(state);
    const oldDiagonal = matrix[index][index];
    for (let row = 0; row < 3; row++) {
        const magnitude = amplitude * Math.sqrt(Math.max(0, probabilities[row]));
        matrix[row][index] = {
            re: magnitude * Math.cos(angles[row]),
            im: magnitude * Math.sin(angles[row]),
        };
    }
    const change = {
        re: matrix[index][index].re - oldDiagonal.re,
        im: matrix[index][index].im - oldDiagonal.im,
    };
    for (let other = 0; other < 3; other++) if (other !== index) {
        matrix[other][other] = {
            re: matrix[other][other].re - change.re / 2,
            im: matrix[other][other].im - change.im / 2,
        };
    }
    return normalizeAdjoint(matrixToAdjoint(matrix));
}

export type TriadColumn = {
    index: number;
    amplitude: number;
    weight: number;
    probabilities: ColorProbabilities;
    phase: number;
    deltaGreen: number;
    deltaBlue: number;
    active: boolean;
    singular: boolean;
    reference: number;
};

export function describeTriad(state: AdjointState): TriadColumn[] {
    const matrix = adjointToMatrix(state);
    return [0, 1, 2].map(index => {
        const values = matrix.map(row => row[index]);
        const weights = values.map(absSquared);
        const weight = weights.reduce((sum, value) => sum + value, 0);
        const active = weight > EPSILON;
        // At a vanished red amplitude choose the first nonzero component as
        // a phase reference. The plotted location is then explicitly conventional.
        const reference = Math.max(0, weights.findIndex(value => value > EPSILON));
        const phase = active ? Math.atan2(values[reference].im, values[reference].re) : 0;
        const phases = values.map((z, i) => weights[i] > EPSILON ? Math.atan2(z.im, z.re) : phase);
        return {
            index, weight, amplitude: Math.sqrt(weight), active, reference,
            probabilities: (active ? weights.map(value => value / weight) : [0, 0, 0]) as ColorProbabilities,
            phase,
            deltaGreen: wrapPhase(phases[1] - phase),
            deltaBlue: wrapPhase(phases[2] - phase),
            singular: active && weights.some(value => value <= EPSILON),
        };
    });
}

// One shared saturation factor is recoverable from the pure anti-colour tip.
// The shaft contains the original RGB probabilities, not a normalized bright hue.
export function columnColor(column: TriadColumn, tip = false) {
    const rgb = tip ? [0, 1, 2].map(i => i === column.index ? 1 : 0) : column.probabilities;
    return "rgb(" + rgb.map(value => Math.round(255 * (.48 * (1 - column.amplitude) + column.amplitude * value))).join(",") + ")";
}

export function formatComplex(z: Complex) {
    const re = Math.abs(z.re) < .0005 ? 0 : z.re;
    const im = Math.abs(z.im) < .0005 ? 0 : z.im;
    if (!im) return re.toFixed(2);
    if (!re) return im.toFixed(2) + "i";
    return re.toFixed(2) + (im < 0 ? " − " : " + ") + Math.abs(im).toFixed(2) + "i";
}
