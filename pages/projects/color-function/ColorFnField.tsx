import { Component } from "parvis";
import "./ColorFnField.less";
import { block } from "../../../utils";

const b = block("color-fn-field");

export type TimeFn = (x: number, y: number) => number;
type ValueRange = { min: number; max: number };
type Sizes = { x: number; y: number };

interface Props {
    fn: TimeFn;
    x: ValueRange;
    y: ValueRange;
    value: ValueRange;
    resolution: Sizes;
    size: Sizes;
}

export const ColorFnField = Component<Props>("ColorFnField", ({ props }) => {
    const getBlocks = () => {
        const { fn, resolution, x, y, value } = props();
        const { x: xres, y: yres } = resolution;
        const { max: xmax, min: xmin } = x;
        const { max: ymax, min: ymin } = y;
        const { max, min } = value;
        const xPart = (x.max - x.min) / xres;
        const yPart = (y.max - y.min) / yres;
        const blocks: number[] = new Array(xres * yres).fill(null);
        let i = 0;
        for (let currentY = ymax, iy = 0; iy < yres; currentY -= yPart, iy++) {
            for (
                let currentX = xmin, ix = 0;
                ix < xres;
                currentX += xPart, ix++
            ) {
                const value = fn(currentX, currentY);
                const v = Math.max(Math.min(value, max), min);
                const deg = Math.trunc(((v - min) / (max - min)) * 90);
                blocks[i] = deg;
                i++;
            }
        }
        return blocks;
    };
    return ({ size, resolution }) => {
        const blocks = getBlocks();
        const { x } = resolution;
        return (
            <div
                style={`--width: ${size.x}px; --height: ${size.y}px; --n: ${resolution.x}; overflow: hidden; width: var(--width); height: var(--height);`}
            >
                <div class={b()}>
                    {blocks.map((deg, i) => (
                        <div
                            style={`--deg: ${deg}; --left: ${
                                i > 0 ? blocks[i - 1] : deg
                            }; --top: ${i <= x ? deg : blocks[i - x]}`}
                        />
                    ))}
                </div>
            </div>
        );
    };
});
