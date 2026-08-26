import { Component } from "parvis";

import { block } from "../../../utils";
import { ColorProbabilities, TAU, wrapPhase } from "./model";
import { GluonTransition } from "./transition";
import { clamp, displayColor, rgbCss, Rgb } from "./visual";

const b = block("qcd");

const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 500;
const FIELD_X = 2;
const FIELD_Y = 2;
const FIELD_SIZE = 496;
const QUARK_RADIUS = 12;
const ARROW_START_GAP = 3;
const MIN_ARROW_TIP_DISTANCE = 48;

type GluonHitRegion = {
    index: number;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
};

type Props = {
    probabilities: ColorProbabilities;
    deltaGreen: number;
    deltaBlue: number;
    commonPhase: number;
    anti: boolean;
    hoveredGluon: number | null;
    showGluons: boolean;
    getTransition: (index: number) => GluonTransition;
    onPhaseChange: (deltaGreen: number, deltaBlue: number) => void;
    onHoverGluon: (index: number | null) => void;
    onApplyGluon: (index: number) => void;
};

const drawArrow = (
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    dx: number,
    dy: number,
    loss: Rgb,
    gain: Rgb,
    label: string,
    active: boolean
) => {
    const x2 = x + dx;
    const y2 = y + dy;
    if (Math.hypot(dx, dy) < 2) return;

    const gradient = context.createLinearGradient(x, y, x2, y2);
    gradient.addColorStop(0, rgbCss(loss));
    gradient.addColorStop(1, rgbCss(gain));

    context.save();
    context.lineCap = "round";
    context.lineWidth = active ? 9 : 5;
    context.strokeStyle = gradient;
    context.shadowColor = active ? rgbCss(gain, 0.55) : "transparent";
    context.shadowBlur = active ? 12 : 0;
    const angle = Math.atan2(dy, dx);
    const head = active ? 18 : 13;
    const shaftX = x2 - Math.cos(angle) * head * 0.82;
    const shaftY = y2 - Math.sin(angle) * head * 0.82;
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(shaftX, shaftY);
    context.stroke();

    context.fillStyle = rgbCss(gain);
    context.beginPath();
    context.moveTo(x2, y2);
    context.lineTo(
        x2 - Math.cos(angle - Math.PI / 6) * head,
        y2 - Math.sin(angle - Math.PI / 6) * head
    );
    context.lineTo(
        x2 - Math.cos(angle + Math.PI / 6) * head,
        y2 - Math.sin(angle + Math.PI / 6) * head
    );
    context.closePath();
    context.fill();
    context.shadowBlur = 0;
    context.font = active ? "bold 13px Arial" : "11px Arial";
    context.fillStyle = "rgba(255, 255, 255, 0.92)";
    context.strokeStyle = "rgba(0, 0, 0, 0.72)";
    context.lineWidth = 3;
    context.strokeText(label, x2 + Math.cos(angle) * 7, y2 + Math.sin(angle) * 7);
    context.fillText(label, x2 + Math.cos(angle) * 7, y2 + Math.sin(angle) * 7);
    context.restore();
};

const drawClockHand = (
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    angle: number,
    color: string
) => {
    const length = QUARK_RADIUS - 3;
    const x2 = x + Math.cos(angle) * length;
    const y2 = y - Math.sin(angle) * length;
    const direction = Math.atan2(y2 - y, x2 - x);
    const head = 3.5;

    context.save();
    context.strokeStyle = color;
    context.fillStyle = color;
    context.lineWidth = 1.8;
    context.lineCap = "round";
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x2, y2);
    context.stroke();
    context.beginPath();
    context.moveTo(x2, y2);
    context.lineTo(
        x2 - Math.cos(direction - Math.PI / 5) * head,
        y2 - Math.sin(direction - Math.PI / 5) * head
    );
    context.lineTo(
        x2 - Math.cos(direction + Math.PI / 5) * head,
        y2 - Math.sin(direction + Math.PI / 5) * head
    );
    context.closePath();
    context.fill();
    context.restore();
};

const distanceToSegment = (
    x: number,
    y: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number
) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const lengthSquared = dx * dx + dy * dy;
    if (lengthSquared < 1e-6) return Math.hypot(x - x1, y - y1);
    const t = clamp(((x - x1) * dx + (y - y1) * dy) / lengthSquared, 0, 1);
    return Math.hypot(x - (x1 + t * dx), y - (y1 + t * dy));
};

export const PhaseTorus = Component<Props>("PhaseTorus", ({ props, hooks }) => {
    let canvas: HTMLCanvasElement | undefined;
    let drawingPhase = false;
    let drawRequest = 0;
    let gluonHitRegions: GluonHitRegion[] = [];
    let onPointerDown: ((event: PointerEvent) => void) | undefined;
    let onPointerMove: ((event: PointerEvent) => void) | undefined;
    let onPointerUp: ((event: PointerEvent) => void) | undefined;
    let onPointerLeave: (() => void) | undefined;
    let onTheme: (() => void) | undefined;

    const scheduleDraw = () => {
        if (drawRequest) window.cancelAnimationFrame(drawRequest);
        drawRequest = window.requestAnimationFrame(draw);
    };

    const pointerCoordinates = (event: PointerEvent) => {
        if (!canvas) return null;
        const bounds = canvas.getBoundingClientRect();
        return {
            x: ((event.clientX - bounds.left) / bounds.width) * CANVAS_WIDTH,
            y: ((event.clientY - bounds.top) / bounds.height) * CANVAS_HEIGHT,
        };
    };

    const setPhaseFromPointer = (event: PointerEvent) => {
        const point = pointerCoordinates(event);
        if (!point) return;
        if (
            point.x < FIELD_X ||
            point.x > FIELD_X + FIELD_SIZE ||
            point.y < FIELD_Y ||
            point.y > FIELD_Y + FIELD_SIZE
        ) {
            return;
        }

        const { anti, onPhaseChange } = props();
        const shownGreen = ((point.x - FIELD_X) / FIELD_SIZE) * TAU;
        const shownBlue = (1 - (point.y - FIELD_Y) / FIELD_SIZE) * TAU;
        onPhaseChange(
            wrapPhase(anti ? -shownGreen : shownGreen),
            wrapPhase(anti ? -shownBlue : shownBlue)
        );
    };

    const gluonAtPointer = (event: PointerEvent) => {
        const point = pointerCoordinates(event);
        const state = props();
        if (!point || !state.showGluons) return null;
        const shownGreen = wrapPhase(state.anti ? -state.deltaGreen : state.deltaGreen);
        const shownBlue = wrapPhase(state.anti ? -state.deltaBlue : state.deltaBlue);
        const markerX = FIELD_X + (shownGreen / TAU) * FIELD_SIZE;
        const markerY = FIELD_Y + (1 - shownBlue / TAU) * FIELD_SIZE;

        for (let shiftX = -1; shiftX <= 1; shiftX++) {
            for (let shiftY = -1; shiftY <= 1; shiftY++) {
                if (
                    Math.hypot(
                        point.x - (markerX + shiftX * FIELD_SIZE),
                        point.y - (markerY + shiftY * FIELD_SIZE)
                    ) <= QUARK_RADIUS + 2
                ) {
                    return null;
                }
            }
        }

        for (let index = gluonHitRegions.length - 1; index >= 0; index--) {
            const region = gluonHitRegions[index];
            if (
                distanceToSegment(
                    point.x,
                    point.y,
                    region.x1,
                    region.y1,
                    region.x2,
                    region.y2
                ) <= 14
            ) {
                return region.index;
            }
        }
        return null;
    };

    hooks.mount(() => {
        if (!canvas) return;
        onPointerDown = (event: PointerEvent) => {
            const gluonIndex = gluonAtPointer(event);
            if (gluonIndex !== null) {
                props().onApplyGluon(gluonIndex);
                props().onHoverGluon(gluonIndex);
                return;
            }
            drawingPhase = true;
            canvas?.setPointerCapture(event.pointerId);
            setPhaseFromPointer(event);
        };
        onPointerMove = (event: PointerEvent) => {
            if (drawingPhase) {
                setPhaseFromPointer(event);
                return;
            }
            const gluonIndex = gluonAtPointer(event);
            canvas!.style.cursor = gluonIndex === null ? "crosshair" : "pointer";
            if (props().hoveredGluon !== gluonIndex) {
                props().onHoverGluon(gluonIndex);
            }
        };
        onPointerUp = (event: PointerEvent) => {
            drawingPhase = false;
            if (canvas?.hasPointerCapture(event.pointerId)) {
                canvas.releasePointerCapture(event.pointerId);
            }
        };
        onPointerLeave = () => {
            if (!drawingPhase) props().onHoverGluon(null);
        };
        onTheme = scheduleDraw;

        canvas.addEventListener("pointerdown", onPointerDown);
        canvas.addEventListener("pointermove", onPointerMove);
        canvas.addEventListener("pointerup", onPointerUp);
        canvas.addEventListener("pointercancel", onPointerUp);
        canvas.addEventListener("pointerleave", onPointerLeave);
        window.addEventListener("theme", onTheme);
        scheduleDraw();
    });

    hooks.destroy(() => {
        if (onPointerDown) canvas?.removeEventListener("pointerdown", onPointerDown);
        if (onPointerMove) canvas?.removeEventListener("pointermove", onPointerMove);
        if (onPointerUp) {
            canvas?.removeEventListener("pointerup", onPointerUp);
            canvas?.removeEventListener("pointercancel", onPointerUp);
        }
        if (onPointerLeave) canvas?.removeEventListener("pointerleave", onPointerLeave);
        if (onTheme) window.removeEventListener("theme", onTheme);
        if (drawRequest) window.cancelAnimationFrame(drawRequest);
    });

    function draw() {
        if (!canvas) return;
        const context = canvas.getContext("2d");
        if (!context) return;

        const state = props();
        const styles = getComputedStyle(document.body);
        const background =
            styles.getPropertyValue("--color-background-second").trim() || "#20232a";
        const border =
            styles.getPropertyValue("--color-border-contrast").trim() || "#78808d";
        const text = styles.getPropertyValue("--color-text").trim() || "#d8dce4";
        const color = displayColor(state.probabilities, state.anti);
        const shownGreen = wrapPhase(
            state.anti ? -state.deltaGreen : state.deltaGreen
        );
        const shownBlue = wrapPhase(state.anti ? -state.deltaBlue : state.deltaBlue);
        const shownCommon = wrapPhase(
            state.anti ? -state.commonPhase : state.commonPhase
        );

        context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        context.fillStyle = background;
        context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        context.save();
        context.beginPath();
        context.rect(FIELD_X, FIELD_Y, FIELD_SIZE, FIELD_SIZE);
        context.clip();

        const markerX = FIELD_X + (shownGreen / TAU) * FIELD_SIZE;
        const markerY = FIELD_Y + (1 - shownBlue / TAU) * FIELD_SIZE;
        const coherence =
            Math.sqrt(state.probabilities[0] * state.probabilities[1]) +
            Math.sqrt(state.probabilities[0] * state.probabilities[2]) +
            Math.sqrt(state.probabilities[1] * state.probabilities[2]);
        const preview =
            state.hoveredGluon === null
                ? null
                : state.getTransition(state.hoveredGluon);

        for (let shiftX = -1; shiftX <= 1; shiftX++) {
            for (let shiftY = -1; shiftY <= 1; shiftY++) {
                const x = markerX + shiftX * FIELD_SIZE;
                const y = markerY + shiftY * FIELD_SIZE;
                context.lineWidth = state.anti ? 5 : 3;
                context.strokeStyle = rgbCss(color);
                context.fillStyle = state.anti ? background : rgbCss(color);
                context.beginPath();
                if (state.anti) {
                    context.moveTo(x, y - 13);
                    context.lineTo(x + 12, y);
                    context.lineTo(x, y + 13);
                    context.lineTo(x - 12, y);
                    context.closePath();
                } else {
                    context.arc(x, y, QUARK_RADIUS, 0, TAU);
                }
                context.fill();
                context.stroke();
                drawClockHand(
                    context,
                    x,
                    y,
                    shownCommon,
                    state.anti ? text : background
                );
            }
        }

        gluonHitRegions = [];
        if (state.showGluons) {
            for (let index = 0; index < 8; index++) {
                const transition = state.getTransition(index);
                const dx = (transition.deltaGreen / TAU) * FIELD_SIZE;
                const dy = (-transition.deltaBlue / TAU) * FIELD_SIZE;
                const actualLength = Math.hypot(dx, dy);
                const fallbackAngle = -Math.PI / 2 + (TAU * index) / 8;
                const ux =
                    actualLength > 0.5 ? dx / actualLength : Math.cos(fallbackAngle);
                const uy =
                    actualLength > 0.5 ? dy / actualLength : Math.sin(fallbackAngle);
                const tipDistance = Math.max(actualLength, MIN_ARROW_TIP_DISTANCE);
                const startDistance = QUARK_RADIUS + ARROW_START_GAP;
                const startDx = ux * startDistance;
                const startDy = uy * startDistance;
                const visualDx = ux * (tipDistance - startDistance);
                const visualDy = uy * (tipDistance - startDistance);

                for (let shiftX = -1; shiftX <= 1; shiftX++) {
                    for (let shiftY = -1; shiftY <= 1; shiftY++) {
                        const x = markerX + shiftX * FIELD_SIZE + startDx;
                        const y = markerY + shiftY * FIELD_SIZE + startDy;
                        drawArrow(
                            context,
                            x,
                            y,
                            visualDx,
                            visualDy,
                            transition.colors.loss,
                            transition.colors.gain,
                            `g${index + 1}`,
                            state.hoveredGluon === index
                        );
                        gluonHitRegions.push({
                            index,
                            x1: x,
                            y1: y,
                            x2: x + visualDx,
                            y2: y + visualDy,
                        });
                    }
                }
            }
        }

        if (preview) {
            const futureColor = displayColor(preview.next.probabilities, state.anti);
            const futureX = FIELD_X + (preview.next.deltaGreen / TAU) * FIELD_SIZE;
            const futureY = FIELD_Y + (1 - preview.next.deltaBlue / TAU) * FIELD_SIZE;
            for (let shiftX = -1; shiftX <= 1; shiftX++) {
                for (let shiftY = -1; shiftY <= 1; shiftY++) {
                    const x = futureX + shiftX * FIELD_SIZE;
                    const y = futureY + shiftY * FIELD_SIZE;
                    context.save();
                    context.setLineDash([5, 4]);
                    context.lineWidth = 3;
                    context.strokeStyle = rgbCss(futureColor, 0.95);
                    context.fillStyle = rgbCss(futureColor, 0.28);
                    context.beginPath();
                    context.arc(x, y, 18, 0, TAU);
                    context.fill();
                    context.stroke();
                    context.restore();
                }
            }
        }

        if (coherence < 0.02) {
            context.fillStyle = text;
            context.globalAlpha = 0.75;
            context.font = "15px Arial";
            context.textAlign = "center";
            context.fillText(
                "Относительные фазы не определены для чистого цвета",
                FIELD_X + FIELD_SIZE / 2,
                FIELD_Y + FIELD_SIZE / 2
            );
            context.textAlign = "left";
            context.globalAlpha = 1;
        }
        context.restore();

        context.strokeStyle = border;
        context.lineWidth = 2;
        context.strokeRect(FIELD_X, FIELD_Y, FIELD_SIZE, FIELD_SIZE);
    }

    return () => {
        scheduleDraw();
        return (
            <div class={b("diagram-card")}>
                <div class={b("phase-plot")}>
                    <div class={b("phase-y-title")}>
                        относительная фаза синего Δφb
                    </div>
                    <div class={b("phase-y-values")}>
                        <span>2π ≡ 0</span>
                        <span>0</span>
                    </div>
                    <canvas
                        width={CANVAS_WIDTH}
                        height={CANVAS_HEIGHT}
                        class={b("canvas")}
                        _ref={(element) => (canvas = element)}
                        aria-label="Фазовый тор цветового состояния кварка"
                    />
                    <div class={b("phase-x-values")}>
                        <span>Δφg = 0</span>
                        <span>2π ≡ 0</span>
                    </div>
                    <div class={b("phase-x-title")}>
                        относительная фаза зелёного Δφg
                    </div>
                </div>
                <div class={b("boundary-note")}>
                    ↔ противоположные стороны квадрата склеены
                </div>
            </div>
        );
    };
});
