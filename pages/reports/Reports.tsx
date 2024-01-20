import "./Reports.less";

import { block, RouteLink } from "../../utils";
import { Lang } from "../../blocks";
import { Component } from "parvis";

const b = block("reports");

export const Reports = Component("Reports", () => {
    return () => {
        return (
            <div class={b()}>
                <h2>
                    <Lang token={`menu/reports`} />
                </h2>
                <p>Видео доклады перемещены в раздел </p>
                <RouteLink href={"video"}>Видео</RouteLink>
            </div>
        );
    };
});
