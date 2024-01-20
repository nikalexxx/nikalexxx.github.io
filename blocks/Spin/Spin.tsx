import "./Spin.less";

import { block } from "../../utils";
import { Component } from "parvis";

const b = block("spin");

const Spin = Component<{ size: "s" | "m" | "l" | "xl" }>(
    "Spin",
    ({ props, state, hooks }) => {
        const [active, setActive] = state(false);

        hooks.mount(() => {
            setTimeout(() => {
                setActive(true);
            }, 0);
        });

        return () => {
            const { size = "l" } = props();
            return (
                <div class={b("", { size, active: active() })}>
                    <div class={b("hex-part")} />
                    <div
                        class={b("hex-part")}
                        style={"transform: rotate(60deg)"}
                    />
                    <div
                        class={b("hex-part")}
                        style={"transform: rotate(-60deg)"}
                    />
                </div>
            );
        };
    }
);

export default Spin;
