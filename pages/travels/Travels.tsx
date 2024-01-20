import "./Travels.less";

import { Component } from "parvis";

import { RouteLink, block } from "../../utils";
import { PageGrid, Tile } from "../../components";
import { Lang } from "../../blocks";

const b = block("travels");

export const Travels = Component("Travels", () => {
    return () => (
        <div class={b()}>
            <h2>
                <Lang token={`menu/travels`} />
            </h2>
            ,
            <PageGrid>
                <RouteLink href={"travels/crimea"}>
                    <Tile className={b("crimea")}>
                        <h3>Крым</h3>
                    </Tile>
                </RouteLink>
                <RouteLink href={"travels/krasnodar-krai"}>
                    <Tile className={b("krasnodar-krai")}>
                        <h3>Краснодарский край</h3>
                    </Tile>
                </RouteLink>
                <RouteLink href={"travels/altai"}>
                    <Tile className={b("altai")}>
                        <h3>Алтай</h3>
                    </Tile>
                </RouteLink>
            </PageGrid>
            <br />
            <br />
            <PageGrid itemWidth={150}>
                <RouteLink href={"travels/smolensk"}>
                    <Tile className={b("smolensk")}>
                        <h3>Смоленск</h3>
                    </Tile>
                </RouteLink>
            </PageGrid>
        </div>
    );
});
