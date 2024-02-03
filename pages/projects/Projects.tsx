import "./Projects.less";

import { RouteLink, block } from "../../utils";
import { PageGrid, Tile } from "../../components";
import { Lang } from "../../blocks";
import { Component } from "parvis";
import { ColorFnField } from "./color-function";

const b = block("projects");

const Projects = Component("Projects", () => {
    return () => {
        return (
            <div class={b()}>
                <h2>
                    <Lang token={`menu/projects`} />
                </h2>
                <PageGrid>
                    <RouteLink href={"projects/unicode"}>
                        <Tile>
                            <div class={b("tile")}>
                                Юникод <span style={`font-size: 4em`}>✍</span>
                            </div>
                        </Tile>
                    </RouteLink>
                    <RouteLink href={"projects/game-of-life"}>
                        <Tile>
                            <div class={b("tile")}>
                                Игра «Жизнь»{" "}
                                <div class={b("glider")}>
                                    <div />
                                    <div class={b("fill")} />
                                    <div />
                                    <div />
                                    <div />
                                    <div class={b("fill")} />
                                    <div class={b("fill")} />
                                    <div class={b("fill")} />
                                    <div class={b("fill")} />
                                </div>
                            </div>
                        </Tile>
                    </RouteLink>
                    <RouteLink href={"projects/blood-types"}>
                        <Tile>
                            <div class={b("tile")}>
                                Группы крови
                                <span
                                    style={`font-size: 4em; text-align: center;`}
                                >
                                    💉
                                </span>
                            </div>
                        </Tile>
                    </RouteLink>
                    <RouteLink href={"projects/color-function"}>
                        <Tile>
                            <div class={b("tile")}>
                                Цветная функция
                                <div style="display: flex;align-items: center;justify-content: center;">
                                    <ColorFnField
                                        size={{ x: 100, y: 100 }}
                                        resolution={{ x: 20, y: 20 }}
                                        x={{ min: 0, max: 100 }}
                                        y={{ min: 0, max: 100 }}
                                        value={{ min: -20, max: 20 }}
                                        fn={(x, y) =>
                                            Math.sin(x / 17) * 20 - (y - 50)
                                        }
                                    />
                                </div>
                            </div>
                        </Tile>
                    </RouteLink>
                </PageGrid>
            </div>
        );
    };
});

export default Projects;
