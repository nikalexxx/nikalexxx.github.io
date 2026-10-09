import { Component } from "parvis";
import { ColorTriangle } from "./ColorTriangle";
import { ColorProbabilities, setColorProbability } from "./model";

type Props = {
    probabilities: ColorProbabilities;
    futureProbabilities?: ColorProbabilities | null;
    anti?: boolean;
    onChange: (probabilities: ColorProbabilities) => void;
};

export const ColorComposition = Component<Props>("ColorComposition", ({ props }) => () => {
    const p = props();
    return (
        <div class="qcd__color-composition">
            <ColorTriangle probabilities={p.probabilities}
                futureProbabilities={p.futureProbabilities ?? null}
                anti={p.anti} onChange={p.onChange} />
            <div class="qcd__color-ranges">
                {(["red", "green", "blue"] as const).map((name, index) => (
                    <label class={"qcd__range qcd__range_color_" + name}>
                        <span>{["R", "G", "B"][index]}</span>
                        <input type="range" min={0 as any} max={100 as any} step={1 as any}
                            aria-label={"Цвет " + ["R", "G", "B"][index]}
                            value={String(Math.round(p.probabilities[index] * 100))}
                            on:input={event => {
                                const value = Number((event.target as HTMLInputElement).value) / 100;
                                p.onChange(setColorProbability(p.probabilities, index, value));
                            }} />
                        <output>{Math.round(p.probabilities[index] * 100)}%</output>
                    </label>
                ))}
            </div>
        </div>
    );
});
