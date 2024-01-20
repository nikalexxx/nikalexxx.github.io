import { Component } from "parvis";
import { render, browserInit, css, RenderOptions } from "@bookbox/preset-web";
import { block } from "../../utils";

import "./BookBox.less";

browserInit();

css.all();

const b = block("bookbox-element");

window.addEventListener("theme", (e: any) => {
    const { theme } = e.detail;
    window.setTimeout(() => {
        const list = document.querySelectorAll(".book-box");
        for (const node of list) {
            if (theme === "dark") {
                node.classList.add("book-box_theme-dark");
            } else {
                node.classList.remove("book-box_theme-dark");
            }
        }
    }, 10);
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
            settingsOptions: { design: false },
            ...options,
        });
        if (!document.body.classList.contains("theme_light")) {
            element
                ?.querySelector(".book-box")
                ?.classList.add("book-box_theme-dark");
        }
    });

    return () => {
        const { name } = props();
        return <div class={b()} id={getId(name)} _ref={el => element = el}/>;
    };
});
