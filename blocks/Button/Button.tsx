import "./Button.less";

import { block } from "../../utils";
import { Component } from "parvis";

const b = block("button");

type Props = {
    'on:click'?: JSX.IntrinsicElements["button"]["on:click"];
    class?: string;
    disabled?: boolean;
    view?: "normal" | "flat";
};

const Button = Component<Props>("Button", ({ props }) => {
    return () => {
        const {
            children,
            'on:click': onClick,
            class: c,
            disabled = false,
            view = "normal",
        } = props();

        return (
            <button
                disabled={disabled}
                on:click={onClick || (() => {})}
                class={b(null, { view }) + (c ? ` ${c}` : "")}
            >
                {children}
            </button>
        );
    };
});

export default Button;
