// Run: node --experimental-specifier-resolution=node --loader ts-node/esm --test tests/qcd-triad.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { createAdjointBasisState, evolveAdjointState } from "../pages/physics/qcd/gluonField";
import { adjointToMatrix, describeTriad, editTriadColumn, exampleGluon, absSquared } from "../pages/physics/qcd/triad";
import { applyGluon, ColorState, Complex, createColorState, setColorProbability } from "../pages/physics/qcd/model";
import { evolveBoth, fieldStepAngle } from "../pages/physics/qcd/fieldEvolution";
import { fieldArrows, hitFieldArrow, plotPoint } from "../pages/physics/qcd/triadCanvas";
import { makeFieldArrow } from "../pages/physics/qcd/fieldArrows";
import { createGluonTransition } from "../pages/physics/qcd/transition";
import { TORUS_SPAN } from "../pages/physics/qcd/torusGeometry";

const close = (actual: number, expected: number, message = "") =>
    assert.ok(Math.abs(actual - expected) < 1e-9, message + ": " + actual + " ≠ " + expected);
const product = (a: Complex, b: Complex) => ({
    re: a.re * b.re - a.im * b.im, im: a.re * b.im + a.im * b.re,
});

test("adjoint field evolution agrees with fundamental U G U† for all eight fields", () => {
    const start = exampleGluon();
    const matrix = adjointToMatrix(start);
    for (let field = 0; field < 8; field++) {
        for (const angle of [-1.1, .8, 2.4]) {
            const columns = [0, 1, 2].map(column => applyGluon(
                [0, 1, 2].map(i => ({ re: i === column ? 1 : 0, im: 0 })) as ColorState,
                field, angle
            ));
            const result = adjointToMatrix(evolveAdjointState(start, field, angle));
            for (let row = 0; row < 3; row++) for (let col = 0; col < 3; col++) {
                let sum = { re: 0, im: 0 };
                for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
                    const right = columns[j][col];
                    const term = product(product(columns[i][row], matrix[i][j]), { re: right.re, im: -right.im });
                    sum = { re: sum.re + term.re, im: sum.im + term.im };
                }
                close(result[row][col].re, sum.re, "real " + field);
                close(result[row][col].im, sum.im, "imag " + field);
            }
        }
    }
});

test("triad preserves all matrix amplitudes including zero and singular columns", () => {
    const states = [exampleGluon(), ...Array.from({ length: 8 }, (_, i) => createAdjointBasisState(i))];
    for (const state of states) {
        const matrix = adjointToMatrix(state);
        const columns = describeTriad(state);
        close(columns.reduce((sum, c) => sum + c.weight, 0), 1);
        columns.forEach(c => {
            const phases = [c.phase, c.phase + c.deltaGreen, c.phase + c.deltaBlue];
            c.probabilities.forEach((probability, row) => {
                const magnitude = c.amplitude * Math.sqrt(probability);
                close(magnitude * Math.cos(phases[row]), matrix[row][c.index].re);
                close(magnitude * Math.sin(phases[row]), matrix[row][c.index].im);
            });
        });
    }
});

test("successive noncommuting actions remain traceless, normalized and reversible", () => {
    const start = exampleGluon();
    let state = start;
    for (let a = 0; a < 8; a++) {
        state = evolveAdjointState(state, a, .63);
        const matrix = adjointToMatrix(state);
        close(matrix.flat().reduce((sum, z) => sum + absSquared(z), 0), 1);
        close(matrix.reduce((sum, row, i) => sum + row[i].re, 0), 0);
        close(matrix.reduce((sum, row, i) => sum + row[i].im, 0), 0);
    }
    for (let a = 7; a >= 0; a--) state = evolveAdjointState(state, a, -.63);
    state.forEach((z, i) => { close(z.re, start[i].re); close(z.im, start[i].im); });
});

test("editing a triad column keeps its RGB proportions, phases and zero trace", () => {
    const start = exampleGluon();
    const target: [number, number, number] = [.2, .5, .3];
    const after = editTriadColumn(start, 1, {
        probabilities: target, deltaGreen: 1.1, deltaBlue: 2.2,
    });
    const selected = describeTriad(after)[1];
    target.forEach((value, index) => close(selected.probabilities[index], value));
    close(selected.deltaGreen, 1.1);
    close(selected.deltaBlue, 2.2);
    const matrix = adjointToMatrix(after);
    close(matrix.reduce((sum, row, i) => sum + row[i].re, 0), 0);
    close(matrix.reduce((sum, row, i) => sum + row[i].im, 0), 0);
    close(matrix.flat().reduce((sum, z) => sum + absSquared(z), 0), 1);

    const activated = editTriadColumn(createAdjointBasisState(0), 2, {
        probabilities: target,
    });
    target.forEach((value, index) => close(describeTriad(activated)[2].probabilities[index], value));
});

test("the same field step evolves quark and gluon in both representations", () => {
    const quark = createColorState([.4, .35, .25], .8, 2.1, .2);
    const gluon = exampleGluon();
    for (const anti of [false, true]) {
        const after = evolveBoth(quark, gluon, 4, .16, anti);
        const actualStart = anti ? quark.map(z => ({ re: z.re, im: -z.im })) as ColorState : quark;
        const actualAfter = applyGluon(actualStart, 4, .16, anti);
        after.quark.forEach((z, i) => {
            close(z.re, actualAfter[i].re);
            close(z.im, anti ? -actualAfter[i].im : actualAfter[i].im);
        });
        const expectedGluon = evolveAdjointState(gluon, 4, .16);
        after.gluon.forEach((z, i) => {
            close(z.re, expectedGluon[i].re);
            close(z.im, expectedGluon[i].im);
        });
    }
});

test("one field click is a small signed step and matches its preview", () => {
    close(fieldStepAngle(.8), .04);
    close(fieldStepAngle(-.8), -.04);
    close(fieldStepAngle(10), .5);
    close(fieldStepAngle(0), 0);

    const quark = createColorState([.4, .35, .25], .8, 2.1, .2);
    const gluon = exampleGluon();
    const step = fieldStepAngle(.8);
    const actual = evolveBoth(quark, gluon, 1, step, false);
    const expectedQuark = applyGluon(quark, 1, step);
    const expectedGluon = evolveAdjointState(gluon, 1, step);
    actual.quark.forEach((z, i) => {
        close(z.re, expectedQuark[i].re);
        close(z.im, expectedQuark[i].im);
    });
    actual.gluon.forEach((z, i) => {
        close(z.re, expectedGluon[i].re);
        close(z.im, expectedGluon[i].im);
    });
});

test("continuous small-angle action composes to the requested preview angle", () => {
    const quark = createColorState([.4, .35, .25], .8, 2.1, .2);
    const gluon = exampleGluon();
    const expected = evolveBoth(quark, gluon, 4, .8, false);
    let current = { quark, gluon };
    for (let i = 0; i < 80; i++) current = evolveBoth(current.quark, current.gluon, 4, .01, false);
    current.quark.forEach((z, i) => {
        close(z.re, expected.quark[i].re); close(z.im, expected.quark[i].im);
    });
    current.gluon.forEach((z, i) => {
        close(z.re, expected.gluon[i].re); close(z.im, expected.gluon[i].im);
    });
});

test("every active triad column has eight selectable field arrows", () => {
    const start = exampleGluon();
    const columns = describeTriad(start);
    const futures = Array.from({ length: 8 }, (_, field) =>
        describeTriad(evolveAdjointState(start, field, .8)));
    const arrows = fieldArrows(columns, futures);
    assert.equal(arrows.length, columns.filter(c => c.active).length * 8);
    arrows.forEach(arrow => {
        const origin = plotPoint(columns[arrow.column]);
        close(Math.hypot(arrow.x1 - origin.x, arrow.y1 - origin.y), 15);
        assert.ok(Number.isFinite(Math.hypot(arrow.x2 - arrow.x1, arrow.y2 - arrow.y1)));
    });
    const first = arrows[0];
    assert.ok(hitFieldArrow(arrows, first.x1 + .8 * (first.x2 - first.x1),
        first.y1 + .8 * (first.y2 - first.y1)));
});

test("field-arrow length responds to the phase displacement instead of a fixed minimum", () => {
    const lengths = [0, 1, 3, 12].map(dx => {
        const arrow = makeFieldArrow(100, 100, dx, 0, 0, "red", "blue");
        close(Math.hypot(arrow.x1 - 100, arrow.y1 - 100), 15);
        return Math.hypot(arrow.x2 - arrow.x1, arrow.y2 - arrow.y1);
    });
    close(lengths[0], 0);
    for (let i = 1; i < lengths.length; i++) assert.ok(lengths[i] > lengths[i - 1]);

    const columns = describeTriad(exampleGluon());
    const totalLength = (angle: number) => {
        const futures = Array.from({ length: 8 }, (_, field) =>
            describeTriad(evolveAdjointState(exampleGluon(), field, angle)));
        return fieldArrows(columns, futures).reduce((sum, arrow) =>
            sum + Math.hypot(arrow.x2 - arrow.x1, arrow.y2 - arrow.y1), 0);
    };
    assert.ok(totalLength(.12) > totalLength(.04));

    const lengthForState = (probabilities: [number, number, number]) => {
        const transition = createGluonTransition({
            probabilities, deltaGreen: .82, deltaBlue: 4.72, commonPhase: .42,
            anti: false, gluonAngle: .04, gluonIndex: 0,
        });
        const arrow = makeFieldArrow(100, 100, transition.deltaGreen * TORUS_SPAN / (2 * Math.PI),
            -transition.deltaBlue * TORUS_SPAN / (2 * Math.PI), 0, "red", "blue");
        return Math.hypot(arrow.x2 - arrow.x1, arrow.y2 - arrow.y1);
    };
    assert.notEqual(lengthForState([.58, .29, .13]), lengthForState([.8, .1, .1]));
});

test("quark and gluon field arrows use the same geometry", () => {
    const column = describeTriad(exampleGluon())[0];
    const point = plotPoint(column);
    const fromGluon = makeFieldArrow(point.x, point.y, 35, -17, 3, "red", "blue");
    const fromQuark = makeFieldArrow(point.x, point.y, 35, -17, 3, "green", "yellow");
    for (const coordinate of ["x1", "y1", "x2", "y2"] as const) {
        close(fromGluon[coordinate], fromQuark[coordinate]);
    }
});

test("RGB slider keeps the selected probability under the thumb", () => {
    const before: [number, number, number] = [.27, .04, .69];
    const after = setColorProbability(before, 0, .5);
    close(after[0], .5);
    close(after.reduce((sum, value) => sum + value, 0), 1);
    close(after[1] / after[2], before[1] / before[2]);
    const fromPure = setColorProbability([1, 0, 0], 0, .4);
    close(fromPure[0], .4);
    close(fromPure[1], .3);
    close(fromPure[2], .3);
});
