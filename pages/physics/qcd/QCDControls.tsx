import { Component } from "parvis";

import { Button } from "../../../blocks";
import { block } from "../../../utils";
import { ColorComposition } from "./ColorComposition";
import { ColorProbabilities, TAU } from "./model";
import { GluonTransition } from "./transition";

const b = block("qcd");

type Props = {
    probabilities: ColorProbabilities;
    anti: boolean;
    commonPhase: number;
    showGluons: boolean;
    preview: GluonTransition | null;
    onToggleAnti: () => void;
    onProbabilitiesChange: (probabilities: ColorProbabilities) => void;
    onCommonPhaseChange: (value: number) => void;
    onToggleGluons: () => void;
    onReset: () => void;
};

export const QCDControls = Component<Props>("QCDControls", ({ props }) => {
    return () => {
        const {
            probabilities,
            anti,
            commonPhase,
            showGluons,
            preview,
            onToggleAnti,
            onProbabilitiesChange,
            onCommonPhaseChange,
            onToggleGluons,
            onReset,
        } = props();

        return (
            <aside class={b("state-content")}>
                <div class={b("panel-heading")}>
                    <h3>Состояние</h3>
                    <Button on:click={onReset}>Сбросить состояние</Button>
                </div>

                <p class={b("state-description")}>
                    RGB показывает вероятности цветовых компонент, квадрат — две относительные фазы.
                </p>

                <Button on:click={onToggleAnti}>
                    {anti ? "Показать кварк" : "Показать антикварк"}
                </Button>

                <ColorComposition probabilities={probabilities}
                    futureProbabilities={preview?.next.probabilities ?? null}
                    anti={anti} onChange={onProbabilitiesChange} />

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

                <div class={b("gluon-head")}>
                    <h3>Стрелки поля на торе</h3>
                    <Button on:click={onToggleGluons}>
                        {showGluons ? "Скрыть" : "Показать"}
                    </Button>
                </div>
            </aside>
        );
    };
});
