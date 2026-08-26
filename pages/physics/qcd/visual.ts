import { ColorProbabilities } from "./model";

export type Rgb = [number, number, number];

export const clamp = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(min, value));

export const toByte = (value: number) => Math.round(clamp(value, 0, 1) * 255);

export const rgbCss = (rgb: Rgb, alpha = 1) =>
    `rgba(${toByte(rgb[0])}, ${toByte(rgb[1])}, ${toByte(rgb[2])}, ${alpha})`;

const brightDirection = (values: Rgb): Rgb => {
    const max = Math.max(...values);
    if (max < 1e-7) return [0.72, 0.72, 0.72];
    return values.map((value) => value / max) as Rgb;
};

export const displayColor = (
    probabilities: ColorProbabilities,
    anti: boolean
): Rgb =>
    anti
        ? (probabilities.map((value) => 1 - value) as Rgb)
        : ([...probabilities] as Rgb);

export const arrowColors = (from: Rgb, to: Rgb) => {
    const difference = to.map((value, index) => value - from[index]) as Rgb;
    const loss = difference.map((value) => Math.max(0, -value)) as Rgb;
    const gain = difference.map((value) => Math.max(0, value)) as Rgb;
    return {
        loss: brightDirection(loss),
        gain: brightDirection(gain),
    };
};
