import { Component } from "parvis";
import { render, browserInit, css, RenderOptions } from "@bookbox/preset-web";
import { block } from "../../utils";

import "./BookBox.less";

browserInit();

css.all();

const b = block("bookbox-element");

function getBookboxNodes(options: {
    element?: HTMLElement;
    selector?: string;
}) {
    const { element, selector = ".book-box" } = options ?? {};
    if (element) return [element];
    return Array.from(document.querySelectorAll(selector));
}
const darkClassName = "book-box_theme-dark";
const sepiaClassName = "book-box_theme-sepia";
export function setTheme(
    options: { theme: string } & { element?: HTMLElement; selector?: string }
) {
    const { theme } = options;
    for (const node of getBookboxNodes(options)) {
        node.classList.remove(darkClassName);
        node.classList.remove(sepiaClassName);
        if (theme === "dark") node.classList.add(darkClassName);
        if (theme === "sepia") node.classList.add(sepiaClassName);
    }
}

window.addEventListener("theme", (e: any) => {
    const { theme } = e.detail;
    localStorage.setItem("book-box-theme", theme);
    setTheme({ theme });
});

const getId = (name: string) => `bookbox-${name}`;

type Props = {
    name: string;
    bookData: RenderOptions["bookData"];
    options?: Partial<RenderOptions>;
};

export const BookBox = Component<Props>("BookBox", ({ props, hooks }) => {
    let element: HTMLElement;
    hooks.mount(() => {
        const { bookData, options = {} } = props();
        render({
            element,
            bookData,
            settingsOptions: {
                custom: {
                    theorems: {
                        icon: "🎓",
                        getItems: ({ bookData }) => {
                            const store = bookData.store;
                            const theorems = Object.entries(
                                store.elementsByKeys
                            ).filter(
                                ([key, element]) =>
                                    element.props.kind === "theorem"
                            );

                            return theorems.map(([key]) => ({
                                key,
                                value: store.dataByKeys[key],
                            }));
                        },
                    },
                },
            },
            ...options,
        });
        if (localStorage.getItem("book-box-theme") !== "sepia") {
            if (!document.body.classList.contains("theme_light")) {
                element
                    ?.querySelector(".book-box")
                    ?.classList.add("book-box_theme-dark");
            }
        }
    });

    return () => {
        const { name } = props();
        return (
            <div class={b()} id={getId(name)} _ref={(el) => (element = el)} />
        );
    };
});
