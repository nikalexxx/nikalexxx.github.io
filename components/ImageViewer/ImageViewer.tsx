import "./ImageViewer.less";

import { block } from "../../utils";

import { Icon } from "../../icons";
import { Spin } from "../../blocks";
import { Component } from "parvis";

const b = block("image-viewer");

const closeIcon = <Icon.Times width={`20px`} height={`20px`} />;
const moveIcon = <Icon.Play width={`20px`} height={`20px`} />;

let controlListener: any = null;

type Props = {
    toLeft: () => void;
    toRight: () => void;
    close: () => void;
    path: string;
    height: number;
    width: number;
};

export const ImageViewer = Component<Props>(
    "ImageViewer",
    ({ props, state }) => {
        const [loading, setLoading] = state(true);

        if (controlListener) {
            window.removeEventListener("keyup", controlListener);
            controlListener = null;
        }

        controlListener = (e) => {
            const { toLeft, toRight, close } = props();
            if (toRight && e.code === "ArrowRight") {
                toRight();
            }
            if (toLeft && e.code === "ArrowLeft") {
                toLeft();
            }
            if (e.code === "Escape") {
                close();
            }
        };
        window.addEventListener("keyup", controlListener);

        return () => {
            const { path, height, width, close, toRight, toLeft } = props();

            const isVertical = height > width;
            const short = isVertical ? width : height;
            const long = isVertical ? height : width;

            const ratio = long / short;

            const imgStyle = `${isVertical ? "height" : "width"}: 100v${
                isVertical ? "h" : "w"
            }; ${isVertical ? "width" : "height"}: ${100 / ratio}v${
                isVertical ? "h" : "w"
            }`;

            const moveMap = new Map([
                ["left", toLeft && (() => toLeft())],
                ["right", toRight && (() => toRight())],
            ]);

            return (
                <div
                    class={b("image")}
                    on:click={() => {
                        close();
                    }}
                    style={imgStyle}
                >
                    {loading() && (
                        <div class={b("loading")}>
                            <Spin size={`xl`} />
                        </div>
                    )}
                    <img
                        src={path}
                        alt={path}
                        style={`${!isVertical ? "height" : "width"}: 100%`}
                        on:click={(e) => e.stopPropagation()}
                        on:load={() => setLoading(false)}
                    />
                    <div class={`${b("control")} ${b("close")}`}>
                        {closeIcon}
                    </div>
                    <div>
                        {Array.from(moveMap.entries()).map(([name, action]) =>
                            action ? (
                                <div
                                    on:click={(e) => {
                                        //   e.preventDefault();
                                        e.stopPropagation();
                                        action();
                                    }}
                                    class={`${b("control")} ${b(name)}`}
                                >
                                    {moveIcon}
                                </div>
                            ) : (
                                <div />
                            )
                        )}
                    </div>
                </div>
            );
        };
    }
);
