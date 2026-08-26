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
            ε задаёт непрерывное преобразование U = exp(−iεTₐ); короткие проекции
            растянуты для читаемости
        </div>
    </div>
));
