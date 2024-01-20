import "./Collapse.less";

import { block } from "../../utils";
import { Component } from "parvis";
import { TemplateTree } from "parvis/dist/model";

const b = block("collapse");

export const Collapse = Component<{ open?: boolean; title?: TemplateTree }>(
    "Collapse",
    ({ state, props }) => {
        const [getOpen, setOpen] = state(props().open ?? false);

        function toogle() {
            setOpen((prev) => !prev);
        }

        return () => {
            const { title, children } = props();
            const open = getOpen();
            return (
                <div>
                    <div
                        class={b("title", {
                            state: open ? "opened" : "closed",
                        })}
                        on:click={toogle}
                    >
                        <div
                            class={b("sign", {
                                state: !open ? "open" : "close",
                            })}
                        >
                            {open ? "–" : "+"}
                        </div>
                        <div>{title}</div>
                    </div>
                    {open && children}
                </div>
            );
        };
    }
);
