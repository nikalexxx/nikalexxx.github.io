import "./Themes.less";

import { block } from "../../../utils";

import { Breadcrumbs } from "../../../components";
import { Lang } from "../../../blocks";
import { Component } from "parvis";

const b = block("themes");

const example = [
    ["основной текст", b("text")],
    ["дополнительный текст", b("text-secondary")],
    ["текст активного действия, например для ссылок", b("text-active")],
    [
        "текст, который акцентирует внимание, например для ссылок при наведении",
        b("text-accent"),
    ],
    ["основной фон", b("background")],
    ["дополнительный фон", b("background-second")],
    ["фон активных элементов", b("background-prime")],
    [
        "фон элементов, выделенных среди других, например текущая страница в меню",
        b("background-accent"),
    ],
    ["граница", b("border")],
    ["контрастная граница", b("border-contrast")],
];

const Themes = Component("Themes", () => {
    return () => (
        <div>
            <Breadcrumbs
                items={[
                    [<Lang token={`menu/design`} />, "design"],
                    [<Lang token={`tile/themes`} />],
                ]}
            />
            <div class={b()}>
                <div class={b("header")}>
                    <div>
                        <h3>css variable</h3>
                    </div>
                </div>
                <div class={`theme_dark ${b("header")}`}>
                    <div>
                        <h3>Тёмная тема</h3>
                    </div>
                </div>
                <div class={`theme_light ${b("header")}`}>
                    <div>
                        <h3>Светлая тема</h3>
                    </div>
                </div>
                {example.map(([text, className]) => (
                    <>
                        <div>
                            <div style={`font-size: 0.8em`}>
                                <code>
                                    --color-{className.replace("themes__", "")}
                                </code>
                            </div>
                        </div>
                        <div class={"theme_dark"}>
                            <div class={className}>{text}</div>
                        </div>
                        <div class={"theme_light"}>
                            <div class={className}>{text}</div>
                        </div>
                    </>
                ))}
            </div>
        </div>
    );
});

export default Themes;
