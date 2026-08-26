import { Component, StateClass } from "parvis";

import { Lang } from "../../../blocks";
import { Breadcrumbs } from "../../../components";
import { block } from "../../../utils";
import { ColorProbabilities, normalizeWeights, wrapPhase } from "./model";
import { PhaseTorus } from "./PhaseTorus";
import { QCDControls } from "./QCDControls";
import { QCDLegend } from "./QCDLegend";
import { createGluonTransition } from "./transition";

import "./QCD.less";

const b = block("qcd");

const INITIAL_WEIGHTS: ColorProbabilities = [58, 29, 13];
const INITIAL_DELTA_GREEN = 0.82;
const INITIAL_DELTA_BLUE = 4.72;
const INITIAL_COMMON_PHASE = 0.42;
const INITIAL_GLUON_ANGLE = 0.8;

export const QCD = Component("QCD", ({ state }) => {
    const [weights, setWeights] = state<ColorProbabilities>(INITIAL_WEIGHTS);
    const [deltaGreen, setDeltaGreen] = state(INITIAL_DELTA_GREEN);
    const [deltaBlue, setDeltaBlue] = state(INITIAL_DELTA_BLUE);
    const [commonPhase, setCommonPhase] = state(INITIAL_COMMON_PHASE);
    const [anti, setAnti] = state(false);
    const [gluonAngle, setGluonAngle] = state(INITIAL_GLUON_ANGLE);
    const [hoveredGluon, setHoveredGluon] = state<number | null>(null) as StateClass<
        number | null
    >;
    const [showGluons, setShowGluons] = state(true);

    const probabilities = () => normalizeWeights(weights());

    const getTransition = (gluonIndex: number) =>
        createGluonTransition({
            probabilities: probabilities(),
            deltaGreen: deltaGreen(),
            deltaBlue: deltaBlue(),
            commonPhase: commonPhase(),
            anti: anti(),
            gluonAngle: gluonAngle(),
            gluonIndex,
        });

    const applyTransition = (gluonIndex: number) => {
        const { next } = getTransition(gluonIndex);
        setWeights(
            next.probabilities.map((value) => value * 100) as ColorProbabilities
        );
        setDeltaGreen(wrapPhase(anti() ? -next.deltaGreen : next.deltaGreen));
        setDeltaBlue(wrapPhase(anti() ? -next.deltaBlue : next.deltaBlue));
    };

    const updateWeight = (index: number, value: number) => {
        const next = [...weights()] as ColorProbabilities;
        next[index] = value;
        if (next[0] + next[1] + next[2] === 0) next[index] = 1;
        setWeights(next);
    };

    const reset = () => {
        setWeights(INITIAL_WEIGHTS);
        setDeltaGreen(INITIAL_DELTA_GREEN);
        setDeltaBlue(INITIAL_DELTA_BLUE);
        setCommonPhase(INITIAL_COMMON_PHASE);
        setGluonAngle(INITIAL_GLUON_ANGLE);
        setHoveredGluon(null);
    };

    return () => {
        const normalizedWeights = probabilities();
        const isAnti = anti();
        const hovered = hoveredGluon();
        const preview = hovered === null ? null : getTransition(hovered);

        return (
            <div class={b()}>
                <Breadcrumbs
                    items={[
                        [<Lang token={`menu/physics`} />, "physics"],
                        [<Lang token={`tile/qcd`} />],
                    ]}
                />
                <div class={b("header")}>
                    <h2>Цветовое пространство кварка</h2>
                    <br />
                    <p>
                        RGB показывает вероятности цветовых компонент, квадрат — две
                        относительные фазы, а стрелки — действие восьми генераторов SU(3).
                    </p>
                </div>

                <div class={b("workspace")}>
                    <PhaseTorus
                        probabilities={normalizedWeights}
                        deltaGreen={deltaGreen()}
                        deltaBlue={deltaBlue()}
                        commonPhase={commonPhase()}
                        anti={isAnti}
                        hoveredGluon={hovered}
                        showGluons={showGluons()}
                        getTransition={getTransition}
                        onPhaseChange={(green, blue) => {
                            setDeltaGreen(green);
                            setDeltaBlue(blue);
                        }}
                        onHoverGluon={setHoveredGluon}
                        onApplyGluon={applyTransition}
                    />
                    <QCDControls
                        weights={weights()}
                        probabilities={normalizedWeights}
                        anti={isAnti}
                        commonPhase={commonPhase()}
                        gluonAngle={gluonAngle()}
                        hoveredGluon={hovered}
                        showGluons={showGluons()}
                        preview={preview}
                        onToggleAnti={() => setAnti((value) => !value)}
                        onWeightChange={updateWeight}
                        onProbabilitiesChange={(next) =>
                            setWeights(
                                next.map((value) => value * 100) as ColorProbabilities
                            )
                        }
                        onCommonPhaseChange={setCommonPhase}
                        onGluonAngleChange={setGluonAngle}
                        onToggleGluons={() => setShowGluons((value) => !value)}
                        onHoverGluon={setHoveredGluon}
                        onApplyGluon={applyTransition}
                        onReset={reset}
                    />
                </div>

                <QCDLegend />
            </div>
        );
    };
});
