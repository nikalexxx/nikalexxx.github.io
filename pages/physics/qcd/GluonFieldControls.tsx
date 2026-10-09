import { Component } from "parvis";
import { Button } from "../../../blocks";
import { AdjointState } from "./gluonField";
import { ColorProbabilities, GLUON_NAMES } from "./model";
import { absSquared, adjointToMatrix, COLUMN_COLORS, COLUMN_NAMES, describeTriad, formatComplex } from "./triad";
import { ColorComposition } from "./ColorComposition";

type Props = {
    value: AdjointState;
    future: AdjointState | null;
    selected: number;
    onSelect: (index: number) => void;
    onColorChange: (index: number, probabilities: ColorProbabilities) => void;
    onReset: () => void;
    onBasis: (index: number) => void;
    onEdit: (index: number, magnitude: number, phase: number) => void;
};

export const GluonFieldControls = Component<Props>("GluonFieldControls", ({ props }) => () => {
    const p = props();
    const matrix = adjointToMatrix(p.value);
    const columns = describeTriad(p.value);
    const selected = columns[p.selected];
    const next = p.future ? describeTriad(p.future) : null;
    const norm = p.value.reduce((sum, z) => sum + absSquared(z), 0);
    const trace = matrix.reduce((sum, row, i) => ({
        re: sum.re + row[i].re, im: sum.im + row[i].im,
    }), { re: 0, im: 0 });
    return (
        <aside class="gluon-field__state-content">
            <div class="qcd__panel-heading">
                <h3>Состояние глюона</h3>
                <Button on:click={p.onReset}>Сбросить состояние</Button>
            </div>
            <p class="gluon-field__hint">Три стрелки — столбцы матрицы G. Квадрат показывает их относительные фазы, поворот — фазу столбца, а основание — его RGB-состав.</p>
            <p class="gluon-field__hint">Треугольник и ползунки меняют выбранный столбец; изменение диагонали компенсируется в других столбцах, сохраняя Tr G = 0.</p>
            <div class="gluon-field__columns" role="group" aria-label="Столбцы глюона">
                {columns.map(c => (
                    <button type="button" aria-pressed={c.index === p.selected ? "true" : "false"}
                        class={c.index === p.selected ? "is-selected" : ""}
                        title={c.active ? `|v| = ${c.amplitude.toFixed(3)} · вес ${(c.weight * 100).toFixed(1)}%` : "Нулевой столбец"}
                        on:click={() => p.onSelect(c.index)}>
                        <strong style={"color: " + COLUMN_COLORS[c.index]}>v{COLUMN_NAMES[c.index]}</strong>
                        <span>{c.active ? (c.weight * 100).toFixed(0) + "%" : "0%"}{c.singular ? " *" : ""}</span>
                    </button>
                ))}
            </div>
            <div class="gluon-field__column-detail">
                <ColorComposition probabilities={selected.active ? selected.probabilities : [1 / 3, 1 / 3, 1 / 3]}
                    futureProbabilities={next?.[p.selected].active ? next[p.selected].probabilities : null}
                    onChange={probabilities => p.onColorChange(p.selected, probabilities)} />
                <div>
                    <strong>Состав v{COLUMN_NAMES[p.selected]}</strong>
                    {selected.active ? <>
                        <p>{selected.probabilities.map((v, i) => ["R", "G", "B"][i] + " " + (v * 100).toFixed(1) + "%").join(" · ")}</p>
                        <p>Фаза столбца: {(selected.phase / Math.PI).toFixed(2)}π</p>
                        <p>Насыщенность: |v| = {selected.amplitude.toFixed(3)}</p>
                    </> : <p>Нулевой столбец. Выберите состав в треугольнике, чтобы создать его.</p>}
                </div>
            </div>
            <details>
                <summary>Произвольное состояние: 8 амплитуд</summary>
                <p class="gluon-field__hint">G = Σ cₐ λₐ/√2. После изменения состояние нормируется.</p>
                <div class="gluon-field__presets" role="group" aria-label="Базисные состояния">
                    {GLUON_NAMES.map((_, i) => (
                        <button type="button" on:click={() => p.onBasis(i)}>g{i + 1}</button>
                    ))}
                </div>
                <div class="gluon-field__coefficients">
                    {p.value.map((z, i) => {
                        const magnitude = Math.sqrt(absSquared(z));
                        const phase = magnitude > 1e-10 ? Math.atan2(z.im, z.re) : 0;
                        return (
                            <div>
                                <strong>c{i + 1}</strong>
                                <label>
                                    <span>|c| <output>{magnitude.toFixed(3)}</output></span>
                                    <input aria-label={"Модуль c" + (i + 1)} type="range"
                                        min={0 as any} max={1 as any} step={.01 as any} value={String(magnitude)}
                                        on:input={event => p.onEdit(i, Number((event.target as HTMLInputElement).value), phase)} />
                                </label>
                                <label>
                                    <span>φ <output>{magnitude > 1e-10 ? (phase / Math.PI).toFixed(2) + "π" : "—"}</output></span>
                                    <input aria-label={"Фаза c" + (i + 1)} type="range" disabled={magnitude < 1e-10}
                                        min={-Math.PI as any} max={Math.PI as any} step={"any" as any} value={String(phase)}
                                        on:input={event => p.onEdit(i, magnitude, Number((event.target as HTMLInputElement).value))} />
                                </label>
                            </div>
                        );
                    })}
                </div>
            </details>
            <details>
                <summary>Комплексная матрица G</summary>
                <table class="gluon-field__matrix" aria-label="Матрица глюона">
                    <thead><tr><th></th><th>r̄</th><th>ḡ</th><th>b̄</th></tr></thead>
                    <tbody>{matrix.map((row, i) => <tr><th>{["R", "G", "B"][i]}</th>
                        {row.map(z => <td>{formatComplex(z)}</td>)}</tr>)}</tbody>
                </table>
                <p class="gluon-field__hint">Tr G = {formatComplex(trace)} · Σ|cₐ|² = {norm.toFixed(6)}</p>
            </details>
        </aside>
    );
});
