import "./RadioGroup.less";

import { Component } from "parvis";
import { block } from "../../utils";

const b = block("radio-group");

type Option = { value: string; title: string };

type Props = {
    className?: string;
    label: string;
    name: string;
    value: string;
    options: Option[];
    onChange: (value: string) => void;
};

export const RadioGroup = Component<Props>("RadioGroup", ({ props }) => () => {
    const { className, label, name, value, options, onChange } = props();
    return (
        <fieldset class={`${b()} ${className || ""}`}>
            <legend class={b("legend")}>{label}</legend>
            <div class={b("options")}>
                {options.map(option => (
                    <label class={b("option", { active: value === option.value })}>
                        <input type="radio" name={name} value={option.value}
                            checked={(value === option.value) as any}
                            on:change={() => onChange(option.value)} />
                        <span>{option.title}</span>
                    </label>
                ))}
            </div>
        </fieldset>
    );
});
