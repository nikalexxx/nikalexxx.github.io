import { Component, StateClass } from "parvis";
import { RadioGroup } from "../../../blocks";
import { block } from "../../../utils";
import { FieldControls } from "./FieldControls";
import { evolveBoth, fieldStepAngle } from "./fieldEvolution";
import { GluonFieldScene } from "./GluonFieldScene";
import { AdjointState, createAdjointBasisState, evolveAdjointState } from "./gluonField";
import { ColorState, createColorState, describeColorState, normalizeWeights } from "./model";
import { QuarkScene } from "./QuarkScene";
import { createGluonTransition } from "./transition";
import { editTriadColumn, exampleGluon, normalizeAdjoint } from "./triad";

const b = block("qcd");
const INITIAL_QUARK = () => createColorState(normalizeWeights([58, 29, 13]), .82, 4.72, .42);
const FIELD_KEY = "qcd:selected-field";
const initialField = () => {
    try {
        const stored = window.localStorage.getItem(FIELD_KEY);
        if (stored === null) return 2;
        const saved = Number(stored);
        return Number.isInteger(saved) && saved >= 0 && saved < 8 ? saved : 2;
    } catch { return 2; }
};

export const QCDExperience = Component("QCDExperience", ({ state, hooks }) => {
    const [mode, setMode] = state("quark");
    const [quark, setQuark] = state<ColorState>(INITIAL_QUARK());
    const [gluon, setGluon] = state<AdjointState>(exampleGluon());
    const [anti, setAnti] = state(false);
    const [showGluons, setShowGluons] = state(true);
    const [selectedColumn, setSelectedColumn] = state(0);
    const [field, setField] = state(initialField());
    const [angle, setAngle] = state(.8);
    const [hover, setHover] = state<number | null>(null) as StateClass<number | null>;
    const [playing, setPlaying] = state(false);
    let request = 0;

    const stop = () => {
        cancelAnimationFrame(request);
        request = 0;
        setPlaying(false);
    };
    const applyFieldStep = (index: number) => {
        stop();
        setField(index);
        const next = evolveBoth(quark(), gluon(), index, fieldStepAngle(angle()), anti());
        setQuark(next.quark);
        setGluon(next.gluon);
        try { window.localStorage.setItem(FIELD_KEY, String(index)); } catch { /* Storage may be disabled. */ }
    };
    hooks.destroy(() => cancelAnimationFrame(request));

    const changeQuark = (values: Partial<ReturnType<typeof describeColorState>>) => {
        stop();
        const current = describeColorState(quark());
        setQuark(createColorState(
            values.probabilities ?? current.probabilities,
            values.deltaGreen ?? current.deltaGreen,
            values.deltaBlue ?? current.deltaBlue,
            values.commonPhase ?? current.commonPhase,
        ));
    };
    const changeGluon = (value: AdjointState) => {
        stop();
        setGluon(normalizeAdjoint(value));
    };
    const getTransition = (index: number) => {
        const current = describeColorState(quark());
        return createGluonTransition({
            probabilities: current.probabilities,
            deltaGreen: current.deltaGreen,
            deltaBlue: current.deltaBlue,
            commonPhase: current.commonPhase,
            anti: anti(),
            gluonAngle: fieldStepAngle(angle()),
            gluonIndex: index,
        });
    };
    const start = () => {
        stop();
        setHover(null);
        setPlaying(true);
        let previous: number | null = null;
        const tick = (time: number) => {
            if (previous !== null) {
                const step = angle() * Math.min(time - previous, 50) / 1000;
                const count = Math.max(1, Math.ceil(Math.abs(step) / .04));
                let next = { quark: quark(), gluon: gluon() };
                for (let i = 0; i < count; i++) {
                    next = evolveBoth(next.quark, next.gluon, field(), step / count, anti());
                }
                setQuark(next.quark);
                setGluon(next.gluon);
            }
            previous = time;
            request = requestAnimationFrame(tick);
        };
        request = requestAnimationFrame(tick);
    };

    return () => {
        const hovering = hover();
        const futureGluon = hovering === null ? null : evolveAdjointState(gluon(), hovering, fieldStepAngle(angle()));
        return (
            <div class={b("experience")}>
                <FieldControls field={field()} hovered={hovering} angle={angle()} playing={playing()}
                    onHover={setHover} onApply={applyFieldStep} onStart={start} onStop={stop}
                    onAngleChange={setAngle} />
                <RadioGroup className={b("mode-radio")} label="Объект визуализации"
                    name="qcd-object" value={mode()}
                    options={[{ value: "quark", title: "Кварк" }, { value: "gluon", title: "Глюон" }]}
                    onChange={setMode} />
                <div class={b("experience-workspace")}>
                    <div class={b("object-pane")}>
                        {mode() === "quark" ? (
                            <QuarkScene value={quark()} anti={anti()} showGluons={showGluons()}
                                hovered={hovering} selectedField={field()}
                                preview={hovering === null ? null : getTransition(hovering)}
                                getTransition={getTransition} onHover={setHover} onApply={applyFieldStep}
                                onPhaseChange={(green, blue) => changeQuark({ deltaGreen: green, deltaBlue: blue })}
                                onColorChange={probabilities => changeQuark({ probabilities })}
                                onCommonPhaseChange={commonPhase => changeQuark({ commonPhase })}
                                onToggleAnti={() => { stop(); setAnti(value => !value); }}
                                onToggleGluons={() => setShowGluons(value => !value)}
                                onReset={() => { stop(); setQuark(INITIAL_QUARK()); setHover(null); }} />
                        ) : (
                            <GluonFieldScene value={gluon()} future={futureGluon}
                                field={field()} hoveredField={hovering} angle={fieldStepAngle(angle())}
                                onHoverField={setHover} onSelectField={applyFieldStep}
                                selected={selectedColumn()} onSelect={setSelectedColumn}
                                onColorChange={(index, probabilities) =>
                                    changeGluon(editTriadColumn(gluon(), index, { probabilities }))}
                                onPhaseChange={(index, deltaGreen, deltaBlue) =>
                                    changeGluon(editTriadColumn(gluon(), index, { deltaGreen, deltaBlue }))}
                                onReset={() => { changeGluon(exampleGluon()); setSelectedColumn(0); setHover(null); }}
                                onBasis={index => { changeGluon(createAdjointBasisState(index)); setHover(null); }}
                                onEdit={(index, magnitude, phase) => {
                                    const next = gluon().map(z => ({ ...z })) as AdjointState;
                                    next[index] = { re: magnitude * Math.cos(phase), im: magnitude * Math.sin(phase) };
                                    changeGluon(next);
                                }} />
                        )}
                    </div>
                </div>
            </div>
        );
    };
});
