import { TemplateTree } from "parvis/dist/model";
import "./Breadcrumbs.less";

import { RouteLink, block } from "../../utils";
import { Component } from "parvis";

const b = block("breadcrumbs");

interface Props {
    items: [...[TemplateTree, string][], [TemplateTree, string] | [TemplateTree]];
}

export const Breadcrumbs = Component<Props>("Breadcrumbs", ({ props }) => {
    return () => (
        <div class={b()}>
            {props().items.map(([name, href], i) => {
                const last = i === props().items.length - 1;
                return (
                    <span>
                        <div style={"display: inline-block"}>
                            {last ? (
                                name
                            ) : (
                                <RouteLink href={href ?? ''}>{name}</RouteLink>
                            )}
                        </div>
                        {last ? "" : " / "}
                    </span>
                );
            })}
        </div>
    );
});
