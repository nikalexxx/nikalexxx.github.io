import "./Colors.less";

import { block, style } from "../../../utils";

import { Breadcrumbs } from "../../../components";
import { Lang } from "../../../blocks";
import { Component } from "parvis";
import { allColors } from "../../../utils/color";

type RGB = [number, number, number];

const colors = [
    "black",
    "dark-black",
    "dark",
    "dark-gray",
    "gray-dark",
    "gray",
    "gray-light-medium",
    "gray-light",
    "light-gray-medium",
    "light-gray",
    "light",
    "light-white",
    "white",
    "blue",
    "blue-light",
    "blue-dark",
    "blue-sky",
    "cyan",
    "red",
    "red-light",
    "green-light",
    "orange-light",
    "yellow-light",
    "violet-light",
];

const b = block("colors");

function getContrastCondition(rgb: RGB) {
    if (document.body.classList.contains("theme_light")) {
        const v = Math.min(...rgb);
        return v > 230;
    } else {
        const v = Math.max(...rgb);
        return v > 38 && v < 78;
    }
}

let currentListener: EventListener | null;

const Colors = Component("Colors", ({ state, hooks }) => {
    const [theme, setTheme] = state("");

    hooks.mount(() => {
        if (currentListener) {
            window.removeEventListener("theme", currentListener);
            currentListener = null;
        }
        currentListener = (e) => {
            setTheme(e.detail.theme);
        };

        window.addEventListener("theme", currentListener);
    });

    return () => (
        <div>
            <Breadcrumbs
                items={[
                    [<Lang token={`menu/design`} />, "design"],
                    [<Lang token={`tile/colors`} />],
                ]}
            />
            <div class={b()}>
                {colors.map((color) => {
                    const code = getComputedStyle(document.documentElement)
                        .getPropertyValue(`--color-${color}`)
                        .trim();
                    const rgb: RGB = ((s) =>
                        [s.slice(0, 2), s.slice(2, 4), s.slice(4)].map((hex) =>
                            parseInt(hex, 16)
                        ))(code.slice(1)) as RGB;
                    const v = Math.max(...rgb);
                    const contrast = v > 162 ? "black" : "white";
                    const border = getContrastCondition(rgb)
                        ? "solid 1px var(--color-border-contrast)"
                        : undefined;
                    const colorNode = (
                        <div>
                            <div
                                class={b("area", { color })}
                                style={style({
                                    ...(border ? { border } : {}),
                                    color: contrast,
                                    backgroundColor: `var(--color-${color})`,
                                })}
                            >
                                <div class={b("code")}>{code}</div>
                            </div>
                            <div class={b("name")}>{color}</div>
                        </div>
                    );
                    return colorNode;
                })}
            </div>

            <br />
            <h3>Generated colors</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(2rem, 1fr)); padding: 1rem; margin: 1rem; gap: 0.5rem">
                {allColors.map((color) => (
                    <div
                        style={`background-color: ${color}; height: 2rem; border-radius: 0.5rem`}
                    ></div>
                ))}
            </div>
        </div>
    );
});

export default Colors;
