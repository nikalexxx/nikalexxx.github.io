import { Component } from "parvis";

import { block } from "../../../utils";
import { ColorProbabilities, normalizeWeights } from "./model";
import { displayColor, rgbCss, toByte } from "./visual";

import "./ColorTriangle.less";

const b = block("color-triangle");

const VERTICES = {
    red: { x: 0.5, y: 0.06 },
    green: { x: 0.08, y: 0.94 },
    blue: { x: 0.92, y: 0.94 },
};

type Props = {
    probabilities?: ColorProbabilities;
    futureProbabilities?: ColorProbabilities | null;
    anti?: boolean;
    labels?: boolean;
    showMarker?: boolean;
    variant?: "control" | "logo";
    onChange?: (probabilities: ColorProbabilities) => void;
};

const pointFromProbabilities = (probabilities: ColorProbabilities) => {
    const [red, green, blue] = probabilities;
    return {
        x: red * VERTICES.red.x + green * VERTICES.green.x + blue * VERTICES.blue.x,
        y: red * VERTICES.red.y + green * VERTICES.green.y + blue * VERTICES.blue.y,
    };
};

const weightsFromPoint = (x: number, y: number): ColorProbabilities => {
    const { red, green, blue } = VERTICES;
    const denominator =
        (green.y - blue.y) * (red.x - blue.x) +
        (blue.x - green.x) * (red.y - blue.y);
    const redWeight =
        ((green.y - blue.y) * (x - blue.x) +
            (blue.x - green.x) * (y - blue.y)) /
        denominator;
    const greenWeight =
        ((blue.y - red.y) * (x - blue.x) +
            (red.x - blue.x) * (y - blue.y)) /
        denominator;
    return [redWeight, greenWeight, 1 - redWeight - greenWeight];
};

const drawSpectrum = (canvas: HTMLCanvasElement) => {
    const context = canvas.getContext("2d");
    if (!context) return;
    const { width, height } = canvas;
    const image = context.createImageData(width, height);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const weights = weightsFromPoint((x + 0.5) / width, (y + 0.5) / height);
            if (weights.some((value) => value < 0)) continue;
            const offset = (y * width + x) * 4;
            image.data[offset] = toByte(weights[0]);
            image.data[offset + 1] = toByte(weights[1]);
            image.data[offset + 2] = toByte(weights[2]);
            image.data[offset + 3] = 255;
        }
    }

    context.putImageData(image, 0, 0);
};

export const ColorTriangle = Component<Props>(
    "ColorTriangle",
    ({ props, hooks }) => {
        let root: HTMLDivElement | undefined;
        let spectrum: HTMLCanvasElement | undefined;
        let dragging = false;
        let onPointerDown: ((event: PointerEvent) => void) | undefined;
        let onPointerMove: ((event: PointerEvent) => void) | undefined;
        let onPointerUp: ((event: PointerEvent) => void) | undefined;

        const updateFromPointer = (event: PointerEvent) => {
            const { onChange } = props();
            if (!root || !onChange) return;
            const bounds = root.getBoundingClientRect();
            const raw = weightsFromPoint(
                (event.clientX - bounds.left) / bounds.width,
                (event.clientY - bounds.top) / bounds.height
            ).map((value) => Math.max(0, value)) as ColorProbabilities;
            onChange(normalizeWeights(raw));
        };

        hooks.mount(() => {
            if (!root || !spectrum) return;
            drawSpectrum(spectrum);
            onPointerDown = (event: PointerEvent) => {
                if (!props().onChange) return;
                dragging = true;
                root?.setPointerCapture(event.pointerId);
                updateFromPointer(event);
            };
            onPointerMove = (event: PointerEvent) => {
                if (dragging) updateFromPointer(event);
            };
            onPointerUp = (event: PointerEvent) => {
                dragging = false;
                if (root?.hasPointerCapture(event.pointerId)) {
                    root.releasePointerCapture(event.pointerId);
                }
            };
            root.addEventListener("pointerdown", onPointerDown);
            root.addEventListener("pointermove", onPointerMove);
            root.addEventListener("pointerup", onPointerUp);
            root.addEventListener("pointercancel", onPointerUp);
        });

        hooks.destroy(() => {
            if (onPointerDown) root?.removeEventListener("pointerdown", onPointerDown);
            if (onPointerMove) root?.removeEventListener("pointermove", onPointerMove);
            if (onPointerUp) {
                root?.removeEventListener("pointerup", onPointerUp);
                root?.removeEventListener("pointercancel", onPointerUp);
            }
        });

        return () => {
            const {
                probabilities = [1 / 3, 1 / 3, 1 / 3],
                futureProbabilities = null,
                anti = false,
                labels = true,
                showMarker = true,
                variant = "control",
                onChange,
            } = props();
            const point = pointFromProbabilities(probabilities);
            const futurePoint = futureProbabilities
                ? pointFromProbabilities(futureProbabilities)
                : null;

            return (
                <div
                    class={b(null, { logo: variant === "logo" })}
                    _ref={(element) => (root = element)}
                    aria-label={variant === "logo" ? "Цветовой треугольник QCD" : "RGB-треугольник цветовых вероятностей"}
                    title={onChange ? "Перетащите точку, чтобы изменить цветовой состав" : undefined}
                >
                    <canvas
                        width={320}
                        height={248}
                        class={b("spectrum")}
                        _ref={(element) => (spectrum = element)}
                        aria-hidden="true"
                    />
                    {labels && (
                        <>
                            <span class={b("label", { red: true })}>R</span>
                            <span class={b("label", { green: true })}>G</span>
                            <span class={b("label", { blue: true })}>B</span>
                        </>
                    )}
                    {showMarker && (
                        <i
                            class={b("point")}
                            style={`--tx: ${point.x * 100}%; --ty: ${point.y * 100}%; --color: ${rgbCss(displayColor(probabilities, anti))}`}
                        />
                    )}
                    {futureProbabilities && futurePoint && (
                        <i
                            class={b("point", { future: true })}
                            style={`--tx: ${futurePoint.x * 100}%; --ty: ${futurePoint.y * 100}%; --color: ${rgbCss(displayColor(futureProbabilities, anti))}`}
                            title="Состояние после применения глюона"
                        />
                    )}
                </div>
            );
        };
    }
);
