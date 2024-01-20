import "./Tile.less";

import { block } from "../../utils";
import { Component } from "parvis";

const b = block("tile");

export const Tile = Component<{ className?: string }>("Tile", ({ props }) => {
    return () => {
        const { children, className } = props();
        return (
            <div class={`${b()}${className ? ` ${className}` : ""}`}>
                {children}
            </div>
        );
    };
});
