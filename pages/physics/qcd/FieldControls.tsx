import { Component } from "parvis";
import { Button } from "../../../blocks";
import { Icon } from "../../../icons/index.js";
import { fieldStepAngle } from "./fieldEvolution";
import { GLUON_MATRICES, GLUON_NAMES, TAU } from "./model";

type Props = {
    field: number;
    hovered: number | null;
    angle: number;
    playing: boolean;
    onHover: (index: number | null) => void;
    onApply: (index: number) => void;
    onStart: () => void;
    onAngleChange: (angle: number) => void;
    onStop: () => void;
};

export const FieldControls = Component<Props>("FieldControls", ({ props, state }) => {
    const [matrixOpen, setMatrixOpen] = state(false);
    return () => {
        const p = props();
        const inspected = p.hovered ?? p.field;
        const basis = GLUON_MATRICES[inspected];
        return (
        <aside class="gluon-field__controls qcd__field-controls">
            <div class="gluon-field__field-toolbar">
                <h3>Глюонное поле</h3>
                <label class="gluon-field__angle">
                    <span>θ/с <output>{(p.angle / Math.PI).toFixed(2)}π</output></span>
                    <input aria-label="Угол действия поля за секунду" type="range" min={-TAU as any}
                        max={TAU as any} step={"any" as any} value={String(p.angle)}
                        on:input={event => p.onAngleChange(Number((event.target as HTMLInputElement).value))} />
                </label>
                <div class="gluon-field__actions">
                    <Button on:click={() => {
                        const current = props();
                        if (current.playing) current.onStop();
                        else current.onStart();
                    }}>
                        {p.playing ? <><Icon.Pause />Пауза</> : <><Icon.Play />Старт g{p.field + 1}</>}
                    </Button>
                </div>
                <button type="button" class="gluon-field__matrix-toggle"
                    aria-expanded={matrixOpen() ? "true" : "false"}
                    on:click={() => setMatrixOpen(value => !value)}>Матрица g{inspected + 1}</button>
            </div>
            <div class="gluon-field__generators" role="group" aria-label="Применение глюонного поля">
                {GLUON_NAMES.map((name, index) => (
                    <button type="button" class={p.field === index ? "is-selected" : ""}
                        aria-label={"Применить g" + (index + 1)}
                        title={`${name.split(" · ")[1]} · шаг ${fieldStepAngle(p.angle).toFixed(2)} рад`}
                        aria-pressed={p.field === index ? "true" : "false"}
                        on:mouseover={() => p.onHover(index)}
                        on:mouseleave={() => p.onHover(null)}
                        on:focus={() => p.onHover(index)}
                        on:blur={() => p.onHover(null)}
                        on:click={() => p.onApply(index)}>
                        <strong>g{index + 1}</strong><span>{name.split(" · ")[1]}</span>
                    </button>
                ))}
            </div>
            {(p.hovered !== null || matrixOpen()) && <div class="gluon-field__operator">
                <div><strong>M(g{inspected + 1}) = {basis.factor}</strong>
                    <div class="qcd__matrix">{basis.cells.map(row => row.map(cell => <span>{cell}</span>))}</div>
                </div>
                <div><span>U = exp(−iθM(g))</span><strong>q′ = Uq</strong><strong>G′ = U G U†</strong></div>
            </div>}
        </aside>
        );
    };
});
