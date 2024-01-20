import "./PageGrid.less";

import { block } from "../../utils";
import { Component } from "parvis";

const b = block("page-grid");

export const PageGrid = Component<{ itemWidth?: number }>(
    "PageGrid",
    ({ props }) => {
        return () => {
            const { children, itemWidth = 210 } = props();
            return (
                <div
                    class={b()}
                    style={`grid-template-columns: repeat(auto-fill, minmax(${itemWidth}px, 1fr));`}
                >
                    {children}
                </div>
            );
        };
    }
);
