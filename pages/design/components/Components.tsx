import "./Components.less";

import {
    Button,
    Checkbox,
    Collapse,
    Lang,
    Modal,
    Select,
    Spin,
    Tooltip,
} from "../../../blocks";
import { block } from "../../../utils";

import { Breadcrumbs } from "../../../components";
import { Component, printTree } from "parvis";

const b = block("components");

const examples = {
    Button: <Button on:click={() => alert("привет")}>нажми меня</Button>,
    Checkbox: (
        <Checkbox
            on:change={(e) =>
                alert(e.target.checked ? "отметка поставлена" : "отметка снята")
            }
        >
            поставь галочку
        </Checkbox>
    ),
    Collapse: (
        <Collapse title={"Заголовок"}>
            <p>Содержимое</p>
        </Collapse>
    ),
    Select: (
        <Select
            onUpdate={(e) => alert(`Значение ${e}`)}
            values={[
                { value: "1", title: "вариант 1" },
                {
                    value: "2",
                    title: "вариант 2 (заранее выбран)",
                    selected: true,
                },
                {
                    value: "g1",
                    title: "вариант g1",
                    group: "группа 1",
                },
                {
                    value: "g2",
                    title: "вариант g2",
                    group: "группа 1",
                },
            ]}
        />
    ),
    Spin: (
        <div style={"display: flex; gap: 1rem"}>
            <Spin size={"xl"} />
            <Spin size={"l"} />
            <Spin size={"m"} />
            <Spin size={"s"} />
        </div>
    ),
    Tooltip: (
        <Tooltip
            text={[
                "Текст подсказки",
                <ul>
                    <li>и другие</li>
                    <li>элементы</li>
                </ul>,
            ]}
        >
            подсказка
        </Tooltip>
    ),
    Modal: (
        <Button
            on:click={() =>
                Modal.open((close) => (
                    <div
                        style={
                            "width: 300px; background: var(--color-background); padding: 8px"
                        }
                    >
                        Здесь размещается контент, закрыть можно при клике вне
                        контента, либо по действиям внутри
                        <Button on:click={close}>кнопка закрытия</Button>
                    </div>
                ))
            }
        >
            открыть модальное окно
        </Button>
    ),
};

export const Components = Component("Components", () => {
    return () => (
        <div>
            <Breadcrumbs
                items={[
                    [<Lang token={`menu/design`} />, "design"],
                    [<Lang token={`tile/blocks`} />],
                ]}
            />
            <div class={b()}>
                {(Object.keys(examples) as (keyof typeof examples)[]).map(
                    (name) => (
                        <>
                            <h2>{name}</h2>
                            <div>
                                <div class={b("example")}>{examples[name]}</div>
                                <Collapse title={`code`} open={true}>
                                    <pre>{printTree(examples[name])}</pre>
                                </Collapse>
                            </div>
                        </>
                    )
                )}
            </div>
        </div>
    );
});
