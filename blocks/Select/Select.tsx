import "./Select.less";

import { block } from "../../utils";
import { TemplateTree } from "parvis/dist/model";
import { Component } from "parvis";

const b = block("select");

interface Value {
    value: string;
    title?: TemplateTree;
    selected?: boolean;
    group?: string;
}

interface Props {
    className?: string;
    onUpdate(value: string): void;
    values: Value[];
}

export const Select = Component<Props>("Select", ({ props }) => {
    const heap = Symbol("heap");

    function getPreparedValues() {
        const groups: Record<string | typeof heap, Value[]> = { [heap]: [] };
        for (const option of props().values) {
            if (option.group) {
                if (!groups[option.group]) {
                    groups[option.group] = [];
                }
                groups[option.group].push(option);
            } else {
                groups[heap].push(option);
            }
        }
        return groups;
    }

    return () => {
        const groups = getPreparedValues();
        const {onUpdate} = props();
        return (
            <div class={b()}>
                <select
                    class={`${b("native")} ${props().className || ""}`}
                    on:change={event => {
                        // @ts-ignore
                        onUpdate(event.target.value);
                    }}
                >
                    {Object.keys(groups).map((name) => {
                        const options = groups[name];
                        return (
                            <optgroup label={name}>
                                {options.map((e) => (
                                    <option
                                        value={e.value}
                                        selected={e.selected}
                                    >
                                        {e.title}
                                    </option>
                                ))}
                            </optgroup>
                        );
                    })}
                    {groups[heap].map((e) => {
                        return (
                            <option value={e.value} selected={e.selected}>
                                {e.title ?? e.value}
                            </option>
                        );
                    })}
                </select>
                <div class={b("expand")}>▾</div>
            </div>
        );
    };
});

export default Select;
