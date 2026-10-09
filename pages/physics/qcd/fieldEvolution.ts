import { AdjointState, evolveAdjointState } from "./gluonField";
import { applyGluon, ColorState } from "./model";

// One click represents 50 ms of field action at the selected angular speed.
export const fieldStepAngle = (angularSpeed: number) =>
    angularSpeed * .05;

export function evolveBoth(
    quark: ColorState, gluon: AdjointState,
    generator: number, angle: number, anti: boolean
) {
    const conjugate = (state: ColorState) =>
        state.map(z => ({ re: z.re, im: -z.im })) as ColorState;
    const activeQuark = anti ? conjugate(quark) : quark;
    const evolvedQuark = applyGluon(activeQuark, generator, angle, anti);
    return {
        quark: anti ? conjugate(evolvedQuark) : evolvedQuark,
        gluon: evolveAdjointState(gluon, generator, angle),
    };
}
