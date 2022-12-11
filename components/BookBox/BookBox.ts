import { render, browserInit, css } from '@bookbox/preset-web';
import { block, Component, E } from '../../utils';

import './BookBox.less';

browserInit();

css.all();

const b = block('bookbox-element');

window.addEventListener('theme', (e: any) => {
    const { theme } = e.detail;
    window.setTimeout(() => {
        const list = document.querySelectorAll('.book-box');
        console.log({ list, theme });
        for (const node of list) {
            if (theme === 'dark') {
                node.classList.add('book-box_theme-dark');
            } else {
                node.classList.remove('book-box_theme-dark');
            }
        }
    }, 10);
});

const getId = (name: string) => `bookbox-${name}`;

export const BookBox = Component.BookBox(({ props, hooks }) => {
    hooks.didMount(() => {
        const { name, bookData, options = {} } = props();
        const element = document.getElementById(getId(name));
        console.log({element});
        render({
            element,
            bookData,
            settingsOptions: { design: false },
            ...options,
        });
        if (!document.body.classList.contains('theme_light')) {
            element?.querySelector('.book-box')?.classList.add('book-box_theme-dark')
        }
    });

    return () => {
        const { name } = props();
        return E.div.class(b()).id(getId(name))();
    };
});
