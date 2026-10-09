import { Component } from "parvis";
import { block } from "../../../utils";
import { AdjointState } from "./gluonField";
import { ColorProbabilities } from "./model";
import { GluonFieldDiagram } from "./GluonFieldDiagram";
import { GluonFieldControls } from "./GluonFieldControls";
import { GluonFieldLegend } from "./GluonFieldLegend";
import { QCDPanels } from "./QCDPanels";
import "./GluonField.less";

const b = block("qcd");

type Props = {
    value: AdjointState;
    future: AdjointState | null;
    selected: number;
    field: number;
    hoveredField: number | null;
    angle: number;
    onSelect: (index: number) => void;
    onHoverField: (index: number | null) => void;
    onSelectField: (index: number) => void;
    onColorChange: (index: number, probabilities: ColorProbabilities) => void;
    onPhaseChange: (index: number, green: number, blue: number) => void;
    onReset: () => void;
    onBasis: (index: number) => void;
    onEdit: (index: number, magnitude: number, phase: number) => void;
};

export const GluonFieldScene = Component<Props>("GluonFieldScene", ({ props }) => () => {
    const p = props();
    return (
        <section class="gluon-field">
            <QCDPanels torus={<GluonFieldDiagram value={p.value} future={p.future}
                    selected={p.selected} field={p.field} hoveredField={p.hoveredField} angle={p.angle}
                    onSelect={p.onSelect} onHoverField={p.onHoverField} onSelectField={p.onSelectField}
                    onPhaseChange={p.onPhaseChange} />}
                state={<GluonFieldControls value={p.value} future={p.future} selected={p.selected}
                    onSelect={p.onSelect} onColorChange={p.onColorChange} onReset={p.onReset}
                    onBasis={p.onBasis} onEdit={p.onEdit} />} />
            <GluonFieldLegend />
        </section>
    );
});
