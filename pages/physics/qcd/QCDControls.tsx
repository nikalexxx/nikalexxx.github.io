import { Component } from "parvis";

import { Button } from "../../../blocks";
import { block } from "../../../utils";
import { ColorTriangle } from "./ColorTriangle";
import {
    ColorProbabilities,
    GLUON_MATRICES,
    GLUON_NAMES,
    TAU,
} from "./model";
import { GluonTransition } from "./transition";

const b = block("qcd");

type Props = {
    weights: ColorProbabilities;
    probabilities: ColorProbabilities;
    anti: boolean;
    commonPhase: number;
    gluonAngle: number;
    hoveredGluon: number | null;
    showGluons: boolean;
    preview: GluonTransition | null;
    onToggleAnti: () => void;
    onWeightChange: (index: number, value: number) => void;
    onProbabilitiesChange: (probabilities: ColorProbabilities) => void;
    onCommonPhaseChange: (value: number) => void;
    onGluonAngleChange: (value: number) => void;
    onToggleGluons: () => void;
    onHoverGluon: (index: number | null) => void;
    onApplyGluon: (index: number) => void;
    onReset: () => void;
};

export const QCDControls = Component<Props>("QCDControls", ({ props }) => {
    return () => {
        const {
            weights,
            probabilities,
            anti,
            commonPhase,
            gluonAngle,
            hoveredGluon,
            showGluons,
            preview,
            onToggleAnti,
            onWeightChange,
            onProbabilitiesChange,
            onCommonPhaseChange,
            onGluonAngleChange,
            onToggleGluons,
            onHoverGluon,
            onApplyGluon,
            onReset,
        } = props();

        return (
            <aside class={b("controls")}>
                <div class={b("control-head")}>
                    <h3>Состояние</h3>
                    <Button on:click={onToggleAnti}>
                        {anti ? "Показать кварк" : "Показать антикварк"}
                    </Button>
                </div>

                <div class={b("color-composition")}>
                    <ColorTriangle
                        probabilities={probabilities}
                        futureProbabilities={preview?.next.probabilities ?? null}
                        anti={anti}
                        onChange={onProbabilitiesChange}
                    />
                    <div class={b("color-ranges")}>
                        {[
                            ["R", 0, "red"],
                            ["G", 1, "green"],
                            ["B", 2, "blue"],
                        ].map(([label, index, name]) => (
                            <label class={b("range", { color: String(name) })}>
                                <span>{label}</span>
                                <input
                                    type="range"
                                    min={0 as any}
                                    max={100 as any}
                                    step={1 as any}
                                    value={String(weights[Number(index)])}
                                    on:input={(event) =>
                                        onWeightChange(
                                            Number(index),
                                            Number((event.target as HTMLInputElement).value)
                                        )
                                    }
                                />
                                <output>{Math.round(probabilities[Number(index)] * 100)}%</output>
                            </label>
                        ))}
                    </div>
                </div>

                <label class={b("range")}>
                    <span title="Глобальная U(1)-фаза; преобразования SU(3) её не изменяют">
                        Общая фаза
                    </span>
                    <input
                        type="range"
                        min={0 as any}
                        max={TAU as any}
                        step={0.01 as any}
                        value={String(commonPhase)}
                        on:input={(event) =>
                            onCommonPhaseChange(
                                Number((event.target as HTMLInputElement).value)
                            )
                        }
                    />
                    <output>{(commonPhase / Math.PI).toFixed(2)}π</output>
                </label>

                <label class={b("range")}>
                    <span title="ε в U = exp(−iεTₐ): насколько далеко применить выбранный генератор SU(3)">
                        Угол действия ε
                    </span>
                    <input
                        type="range"
                        min={0.12 as any}
                        max={1.2 as any}
                        step={0.02 as any}
                        value={String(gluonAngle)}
                        on:input={(event) =>
                            onGluonAngleChange(
                                Number((event.target as HTMLInputElement).value)
                            )
                        }
                    />
                    <output>{gluonAngle.toFixed(2)}</output>
                </label>

                <div class={b("gluon-head")}>
                    <h3>Глюоны</h3>
                    <Button on:click={onToggleGluons}>
                        {showGluons ? "Скрыть" : "Показать"}
                    </Button>
                </div>
                <div class={b("gluons")}>
                    {GLUON_NAMES.map((name, index) => (
                        <button
                            class={b("gluon", { active: hoveredGluon === index })}
                            on:mouseover={() => onHoverGluon(index)}
                            on:mouseleave={() => onHoverGluon(null)}
                            on:focus={() => onHoverGluon(index)}
                            on:blur={() => onHoverGluon(null)}
                            on:click={() => onApplyGluon(index)}
                            title="Навести для предпросмотра, нажать для применения"
                        >
                            <b>g{index + 1}</b>
                            <span>{name}</span>
                        </button>
                    ))}
                </div>
                <div class={b("matrix-preview", { empty: hoveredGluon === null })}>
                    {hoveredGluon === null ? (
                        <span>
                            Наведите на глюон: здесь появятся его матрица и будущее
                            состояние.
                        </span>
                    ) : (
                        <div>
                            <div class={b("matrix-title")}>
                                <strong>g{hoveredGluon + 1}</strong>
                                <span>
                                    T{hoveredGluon + 1} = {GLUON_MATRICES[hoveredGluon].factor}
                                </span>
                            </div>
                            <div class={b("matrix")}>
                                {GLUON_MATRICES[hoveredGluon].cells.map((row) =>
                                    row.map((cell) => <span>{cell}</span>)
                                )}
                            </div>
                            {preview && (
                                <div class={b("future-values")}>
                                    {preview.next.probabilities.map((value, index) => (
                                        <span>
                                            {["R", "G", "B"][index]} {Math.round(value * 100)}%
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <Button on:click={onReset}>Сбросить состояние</Button>
            </aside>
        );
    };
});
