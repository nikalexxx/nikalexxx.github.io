import "./Projects.less";

import { RouteLink, block } from "../../utils";
import { PageGrid, Tile } from "../../components";
import { Lang } from "../../blocks";
import { Component } from "parvis";

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
                </PageGrid>
            </div>
        );
    };
});

export default Projects;
