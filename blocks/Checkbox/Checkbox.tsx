import "./Checkbox.less";

import { block } from "../../utils";
import { Component } from "parvis";

const b = block("checkbox");

const Checkbox = Component<
    Omit<JSX.IntrinsicElements["input"], "checked"> & { checked?: boolean }
>("Checkbox", ({ props }) => {
    return () => (
        <label class={b()}>
            <input type={`checkbox`} class={b("input")} _attributes={props() as any} />
            <div class={b("box")}>
                <div>✓</div>
            </div>
            {props().children}
        </label>
    );
});

export default Checkbox;
