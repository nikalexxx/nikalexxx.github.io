import {
    applyGluon,
    ColorProbabilities,
    createColorState,
    describeColorState,
    signedPhaseDelta,
} from "./model";
import { arrowColors, displayColor, Rgb } from "./visual";

export type GluonTransition = {
    base: ReturnType<typeof describeColorState>;
    next: ReturnType<typeof describeColorState>;
    deltaGreen: number;
    deltaBlue: number;
    colors: {
        loss: Rgb;
        gain: Rgb;
    };
};

type TransitionInput = {
    probabilities: ColorProbabilities;
    deltaGreen: number;
    deltaBlue: number;
    commonPhase: number;
    anti: boolean;
    gluonAngle: number;
    gluonIndex: number;
};

export const createGluonTransition = ({
    probabilities,
    deltaGreen,
    deltaBlue,
    commonPhase,
    anti,
    gluonAngle,
    gluonIndex,
}: TransitionInput): GluonTransition => {
    const baseState = createColorState(
        probabilities,
        deltaGreen,
        deltaBlue,
        commonPhase,
        anti
    );
    const base = describeColorState(baseState);
    const next = describeColorState(
        applyGluon(baseState, gluonIndex, gluonAngle, anti)
    );

    return {
        base,
        next,
        deltaGreen: signedPhaseDelta(next.deltaGreen - base.deltaGreen),
        deltaBlue: signedPhaseDelta(next.deltaBlue - base.deltaBlue),
        colors: arrowColors(
            displayColor(probabilities, anti),
            displayColor(next.probabilities, anti)
        ),
    };
};
