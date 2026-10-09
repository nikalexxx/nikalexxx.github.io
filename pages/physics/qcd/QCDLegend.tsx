import { Component } from "parvis";

import { block } from "../../../utils";

const b = block("qcd");

export const QCDLegend = Component("QCDLegend", () => () => (
    <div class={b("legend")}>
        <div>
            <i class={b("legend-mark", { quark: true })} /> кварк
        </div>
        <div>
            <i class={b("legend-mark", { anti: true })} /> антикварк
        </div>
        <div>
            <i class={b("legend-arrow")} /> хвост теряет цвет, наконечник приобретает
        </div>
        <div>
            Стрелки показывают действие U₍g₎(θ) = exp(−iθM(gₐ)); непрерывный запуск
            складывает малые повороты dθ. Длина стрелки растёт с фазовым сдвигом;
            большие сдвиги визуально сжаты, нулевой сдвиг отмечен точкой.
        </div>
    </div>
));
