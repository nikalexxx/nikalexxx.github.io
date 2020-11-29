import './Catalog.less';

import { Component, E, block } from '../../utils';

const b = block('catalog');

const meta = Symbol('meta');
const heap = Symbol('heap');

const links = {
    programming: {
        frontend: {
            rendering: {
                libs: {
                    react: 'https://reactjs.org',
                    vue: 'https://vuejs.org',
                    angular: 'https://angular.io',
                    svelte: 'https://svelte.dev',
                    marko: 'https://markojs.com',
                    inferno: 'https://infernojs.org',
                    'lit-element': 'https://lit-element.polymer-project.org',
                },
            },
            browsers: {
                firefox: 'https://www.mozilla.org/ru/firefox/new/',
                chrome: 'https://www.google.ru/chrome/',
                safari: 'https://www.apple.com/ru/safari/',
                yandex: 'https://browser.yandex.ru',
            },
            [heap]: {
                mdn: 'https://developer.mozilla.org',
            },
        },
        [heap]: {
            git: 'https://git-scm.com',
            github: 'https://github.com',
            habr: 'https://habr.com',
        },
    },
    [heap]: {
        arxiv: 'https://arxiv.org',
        ium: 'https://ium.mccme.ru',
    },
};

function renderTree(tree) {
    const items = Object.keys(tree).map((key) => {
        const value = tree[key];
        return E.li(
            typeof value === 'string'
                ? E.a.href(value)(key)
                : [key, E.ul(renderTree(value))]
        );
    });
    if (heap in tree) {
        items.push(E.li('...', E.ul(renderTree(tree[heap]))));
    }
    return items;
}

export const Catalog = Component.Catalog(() => () => {
    return E.div.class(b())(
        E.h2('Каталог'),
        E.p('Полезные ссылки. При доступной локализации выбран русский язык.'),
        E.ul.style`border: none`(renderTree(links))
    );
});
