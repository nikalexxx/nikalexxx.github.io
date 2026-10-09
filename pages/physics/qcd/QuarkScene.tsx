import { Component } from "parvis";
import { block } from "../../../utils";
import { ColorProbabilities, ColorState, describeColorState } from "./model";
import { PhaseTorus } from "./PhaseTorus";
import { QCDControls } from "./QCDControls";
import { QCDLegend } from "./QCDLegend";
import { QCDPanels } from "./QCDPanels";
import { GluonTransition } from "./transition";

const b = block("qcd");

type Props = {
    value: ColorState;
    anti: boolean;
    showGluons: boolean;
    hovered: number | null;
    selectedField: number;
    preview: GluonTransition | null;
    getTransition: (index: number) => GluonTransition;
    onPhaseChange: (green: number, blue: number) => void;
    onColorChange: (probabilities: ColorProbabilities) => void;
    onCommonPhaseChange: (phase: number) => void;
    onToggleAnti: () => void;
    onToggleGluons: () => void;
    onHover: (index: number | null) => void;
    onApply: (index: number) => void;
    onReset: () => void;
};

export const QuarkScene = Component<Props>("QuarkScene", ({ props }) => () => {
    const p = props();
    const shown = describeColorState(p.value);
    return (
        <section class={b("scene")}>
            <QCDPanels torus={<PhaseTorus probabilities={shown.probabilities}
                    deltaGreen={shown.deltaGreen} deltaBlue={shown.deltaBlue}
                    commonPhase={shown.commonPhase} anti={p.anti}
                    hoveredGluon={p.hovered} selectedGluon={p.selectedField} showGluons={p.showGluons}
                    getTransition={p.getTransition} onPhaseChange={p.onPhaseChange}
                    onHoverGluon={p.onHover} onApplyGluon={p.onApply} />}
                state={<QCDControls probabilities={shown.probabilities}
                    anti={p.anti} commonPhase={shown.commonPhase}
                    showGluons={p.showGluons} preview={p.preview}
                    onToggleAnti={p.onToggleAnti}
                    onProbabilitiesChange={p.onColorChange}
                    onCommonPhaseChange={p.onCommonPhaseChange}
                    onToggleGluons={p.onToggleGluons} onReset={p.onReset} />} />
            <QCDLegend />
        </section>
    );
});
