import "./Design.less";

import { RouteLink, block } from "../../utils";
import { PageGrid, Tile } from "../../components";

import { Lang } from "../../blocks/LangToken/LangToken";
import { Component } from "parvis";

const b = block("design");

const colorList = [
    "var(--color-red)",
    "var(--color-green-light)",
    "var(--color-blue-sky)",
    "var(--color-violet-light)",
    "var(--color-orange-light)",
];

const Design = Component("Design", () => {
    return () => {
        return (
            <div class={b()}>
                <h2>
                    <Lang token={`menu/design`} />
                </h2>
                <PageGrid>
                    <RouteLink href={"design/colors"}>
                        <Tile>
                            <div class={b("huge")}>
                                <Lang
                                    token={`tile/colors`}
                                    view={(e = "") => (
                                        <span>
                                            {e.split("").map((char, i) => (
                                                <span
                                                    style={`color: ${
                                                        colorList[
                                                            i % colorList.length
                                                        ]
                                                    }`}
                                                >
                                                    {char}
                                                </span>
                                            ))}
                                        </span>
                                    )}
                                />
                            </div>
                        </Tile>
                    </RouteLink>
                    <RouteLink href={"design/themes"}>
                        <Tile>
                            <div class={b("huge")}>
                                <Lang
                                    token={`tile/themes`}
                                    view={(e = "") => {
                                        const middle = Math.floor(e.length / 2);
                                        const firstPart = (
                                            <span
                                                style={
                                                    "color: var(--color-black)"
                                                }
                                            >
                                                {e.slice(0, middle)}
                                            </span>
                                        );
                                        const secondPart = (
                                            <span
                                                style={
                                                    "color: var(--color-gray-light)"
                                                }
                                            >
                                                {e.slice(middle, e.length)}
                                            </span>
                                        );
                                        return (
                                            <span
                                                style={`font-size: ${
                                                    (4 / e.length) * 100
                                                }%`}
                                            >
                                                {firstPart}
                                                {secondPart}
                                            </span>
                                        );
                                    }}
                                />
                            </div>
                        </Tile>
                    </RouteLink>
                    <RouteLink href={"design/components"}>
                        <Tile>
                            <div
                                style={`color: var(--color-background); text-align: center;`}
                                class={b("border")}
                            >
                                <Lang
                                    token={`tile/blocks`}
                                    view={(e = "") => {
                                        const words = e.split(" ");
                                        return (
                                            <div>
                                                <div class={b("huge")}>
                                                    {words[0].replace(
                                                        /o|о/,
                                                        "\u2699"
                                                    )}
                                                </div>
                                                <div style={`font-size: 32px;`}>
                                                    {words.slice(1).join(" ")}
                                                </div>
                                            </div>
                                        );
                                    }}
                                />
                            </div>
                        </Tile>
                    </RouteLink>
                </PageGrid>
            </div>
        );
    };
});

export default Design;
