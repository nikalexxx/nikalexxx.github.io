import { Component } from "parvis";
import { AdjointState, evolveAdjointState } from "./gluonField";
import { describeTriad } from "./triad";
import { drawTriad, fieldArrows, hitColumn, hitFieldArrow, phasesAtPoint, PLOT_SIZE } from "./triadCanvas";
import { phaseTorusFrame } from "./PhaseTorusFrame";

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
    onPhaseChange: (index: number, green: number, blue: number) => void;
};

export const GluonFieldDiagram = Component<Props>("GluonFieldDiagram", ({ props, hooks }) => {
    let canvas: HTMLCanvasElement | undefined;
    let request = 0;
    let dragging: number | null = null;
    let geometry: {
        value: AdjointState;
        angle: number;
        columns: ReturnType<typeof describeTriad>;
        fields: ReturnType<typeof describeTriad>[];
        arrows: ReturnType<typeof fieldArrows>;
    } | null = null;
    const getGeometry = () => {
        const p = props();
        if (!geometry || geometry.value !== p.value || geometry.angle !== p.angle) {
            const columns = describeTriad(p.value);
            const fields = Array.from({ length: 8 }, (_, i) =>
                describeTriad(evolveAdjointState(p.value, i, p.angle)));
            geometry = { value: p.value, angle: p.angle, columns, fields,
                arrows: fieldArrows(columns, fields) };
        }
        return geometry;
    };
    const pointerPoint = (event: PointerEvent) => {
        const box = canvas!.getBoundingClientRect();
        return {
            x: (event.clientX - box.left) / box.width * PLOT_SIZE,
            y: (event.clientY - box.top) / box.height * PLOT_SIZE,
        };
    };
    const updatePhase = (event: PointerEvent) => {
        if (dragging === null) return;
        const { x, y } = pointerPoint(event);
        const phases = phasesAtPoint(x, y);
        props().onPhaseChange(dragging, phases.green, phases.blue);
    };
    const draw = () => {
        if (!canvas) return;
        const p = props();
        const { columns, arrows } = getGeometry();
        drawTriad(canvas, columns, p.future ? describeTriad(p.future) : null, p.selected, arrows,
            p.field, p.hoveredField);
    };
    const hitField = (x: number, y: number) => {
        return hitFieldArrow(getGeometry().arrows, x, y);
    };
    const schedule = () => {
        if (!request) request = requestAnimationFrame(() => { request = 0; draw(); });
    };
    hooks.mount(() => { window.addEventListener("theme", schedule); schedule(); });
    hooks.destroy(() => {
        cancelAnimationFrame(request);
        window.removeEventListener("theme", schedule);
    });
    return () => {
        schedule();
        const p = props();
        return (
            <div class="gluon-field__visual">
                {phaseTorusFrame(
                    <canvas width={PLOT_SIZE} height={PLOT_SIZE}
                        class="qcd__canvas"
                        _ref={el => (canvas = el)}
                        aria-label="Один глюон: три цветофазовые стрелки на торе"
                        on:pointerdown={event => {
                            if (!canvas) return;
                            const { x, y } = pointerPoint(event);
                            const fieldHit = hitField(x, y);
                            if (fieldHit) {
                                p.onSelect(fieldHit.column);
                                p.onSelectField(fieldHit.field);
                                return;
                            }
                            const index = hitColumn(getGeometry().columns, x, y);
                            dragging = index ?? props().selected;
                            if (index !== null) props().onSelect(index);
                            canvas.setPointerCapture(event.pointerId);
                            if (index === null) updatePhase(event);
                        }}
                        on:pointermove={event => {
                            if (dragging !== null) updatePhase(event);
                            else {
                                const { x, y } = pointerPoint(event);
                                p.onHoverField(hitField(x, y)?.field ?? null);
                            }
                        }}
                        on:pointerleave={() => { if (dragging === null) p.onHoverField(null); }}
                        on:pointerup={event => {
                            dragging = null;
                            if (canvas?.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
                        }}
                        on:pointercancel={event => {
                            dragging = null;
                            if (canvas?.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
                        }} />
                )}
                <p class="gluon-field__hint">Перетащите толстую стрелку, чтобы изменить её фазы. Стрелки g₁…g₈ выбирают поле; пунктир — предпросмотр.</p>
            </div>
        );
    };
});
