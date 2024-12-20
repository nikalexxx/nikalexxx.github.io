import "./Catalog.less";

import { block } from "../../utils";

import { Collapse, Lang } from "../../blocks";
import { icons } from "../../services/icons/list";
import { Component } from "parvis";

const b = block("catalog");

const meta = Symbol("meta");
const heap = Symbol("heap");
const link = Symbol("link");

const links = {
    programming: {
        frontend: {
            rendering: {
                libs: {
                    [meta]: {
                        title: "Фрейворки и библиотеки",
                    },
                    react: {
                        [link]: "https://reactjs.org",
                        title: "React",
                    },
                    vue: {
                        [link]: "https://vuejs.org",
                        title: "Vue",
                    },
                    angular: {
                        [link]: "https://angular.io",
                        title: "Angular",
                    },
                    svelte: {
                        [link]: "https://svelte.dev",
                        title: "Svelte",
                    },
                    solid: {
                        [link]: "https://www.solidjs.com",
                        title: "SolidJS",
                    },
                    marko: {
                        [link]: "https://markojs.com",
                        title: "Marko",
                    },
                    inferno: {
                        [link]: "https://infernojs.org",
                        title: "Inferno",
                    },
                    "lit-element": {
                        [link]: "https://lit.dev",
                        title: "Lit element",
                    },
                },
            },
            stateManagers: {
                [meta]: {
                    title: "Менеджеры состояния",
                },
                libs: {
                    [meta]: {
                        title: "Библиотеки",
                    },
                    redux: {
                        [link]: "https://redux.js.org",
                        title: "Redux",
                    },
                    mobx: {
                        [link]: "https://mobx.js.org",
                        title: "MobX",
                    },
                    effector: {
                        [link]: "https://effector.dev",
                        title: "Effector",
                    },
                    reatom: {
                        [link]: "https://www.reatom.dev",
                        title: "Reatom",
                    },
                    xstate: {
                        [link]: "https://xstate.js.org/docs",
                        title: "XState",
                    },
                },
            },
            builders: {
                [meta]: {
                    title: "Инструменты сборки",
                },
                webpack: {
                    title: "Webpack",
                    [link]: "https://webpack.js.org",
                },
                rollup: {
                    title: "Rollup",
                    [link]: "https://rollupjs.org",
                },
                parcel: {
                    title: "Parcel",
                    [link]: "https://parceljs.org",
                },
                esbuild: {
                    title: "Esbuild",
                    [link]: "https://esbuild.github.io",
                },
                rome: {
                    title: "Rome",
                    [link]: "https://rome.tools",
                },
                vite: {
                    title: "Vite",
                    [link]: "https://vitejs.dev",
                },
                snowpack: {
                    title: "Snowpack",
                    [link]: "https://www.snowpack.dev",
                },
            },
            languages: {
                [meta]: {
                    title: "Языки, транслируемые в javascript",
                },
                typescript: {
                    [link]: "https://www.typescriptlang.org",
                    title: "TypeScript",
                },
                elm: {
                    [link]: "https://elm-lang.org",
                    title: "Elm",
                },
                reasonML: {
                    [link]: "https://reasonml.github.io/ru",
                    title: "ReasonML",
                },
                pureScript: {
                    [link]: "https://www.purescript.org",
                    title: "PureScript",
                },
            },
            browsers: {
                [meta]: {
                    title: "Браузеры",
                },
                firefox: {
                    [link]: "https://www.mozilla.org/ru/firefox/new",
                    title: "Firefox",
                },
                chrome: {
                    [link]: "https://www.google.ru/chrome",
                    title: "Google Chrome",
                },
                safari: {
                    [link]: "https://www.apple.com/ru/safari",
                    title: "Safari",
                },
                yandex: {
                    [link]: "https://browser.yandex.ru",
                    title: "Yandex Browser",
                },
                vivaldi: {
                    [link]: "https://vivaldi.com/ru",
                    title: "Vivaldi",
                },
                brave: {
                    [link]: "https://brave.com",
                    title: "Brave",
                },
                servo: {
                    [link]: "https://servo.org",
                    title: "Servo",
                },
            },
            platform: {
                [meta]: { title: "Web платформа" },
                spec: {
                    [meta]: { title: "Спецификации" },
                    html5: {
                        [link]: "https://platform.html5.org",
                        title: "Браузерные технологии",
                    },
                    whatwg: {
                        [link]: "https://spec.whatwg.org",
                        title: "WHATWG",
                    },
                },
                guides: {
                    [meta]: { title: "Обучающие материалы" },
                    mdn: {
                        [link]: "https://developer.mozilla.org/ru",
                        title: "MDN",
                    },
                    learnJS: {
                        [link]: "https://learn.javascript.ru",
                        title: "Learn Javascript",
                    },
                    doka: {
                        [link]: "https://doka.guide",
                        title: "Дока",
                    },
                    devDocs: {
                        [link]: "https://devdocs.io",
                        title: "Dev Docs",
                    },
                },
            },
        },
        "blog-platform": {
            [meta]: {
                title: "Статьи и блоги",
            },
            habr: {
                [link]: "https://habr.com/ru",
                title: "Хабр",
            },
            "smashing-magazine": {
                [link]: "https://www.smashingmagazine.com",
                title: "Smashing magazine",
            },
            "web-standarts": {
                [link]: "https://web-standards.ru",
                title: "Веб стандарты",
            },
            webdebblog: {
                [link]: "https://webdevblog.ru",
                title: "Ещё один блог веб-разработчика",
            },
            "css-tricks": {
                [link]: "https://css-tricks.com",
                title: "CSS-Tricks",
            },
            csssr: {
                [link]: "https://blog.csssr.com/ru",
                title: "CSSSR",
            },
        },
        "book-format": {
            [meta]: {
                title: "Форматы книг и документации",
            },
            pollen: {
                [link]: "https://docs.racket-lang.org/pollen",
                title: "Pollen",
            },
            docsify: {
                [link]: "https://docsify.js.org",
                title: "Docsify",
            },
            bureau: {
                [link]: "https://bureau.ru/books/manifesto",
                title: "Книги бюро Горбунова",
            },
        },
        [heap]: {
            git: {
                [link]: "https://git-scm.com",
                title: "Git",
            },
            github: {
                [link]: "https://github.com",
                title: "Github",
            },
        },
    },
    [heap]: {
        arxiv: {
            [link]: "https://arxiv.org",
            title: "Arxiv",
        },
        ium: {
            [link]: "https://ium.mccme.ru",
            title: "Независимый московский университет",
        },
        "e-maxx": {
            [link]: "https://e-maxx.ru/algo",
            title: "MAXimal::algo",
        },
        manim: {
            [link]: "https://3b1b.github.io/manim",
            title: "Manim",
        },
    },
};

function renderTree(tree, topLevel = false) {
    const keys = [...Object.keys(tree), heap];
    const links = new Set(keys.filter((key) => link in (tree[key] || {})));
    const subLevels = keys.filter((key) => !links.has(key) && key in tree);

    const content = [];
    if (links.size > 0) {
        const linksList = [];
        for (const linkKey of links.values()) {
            const linkValue = tree[linkKey];
            const url = new URL(linkValue[link]);
            const image = (
                <img
                    class={b("image")}
                    src={icons[linkValue[link].replace(/^https?:\/\//, "")]}
                    alt={linkValue.title || linkKey}
                    loading={"lazy"}
                />
            );
            const contentImage = (
                <div class={b("site")}>
                    {image}
                    <a
                        href={linkValue[link]}
                        title={String(linkKey)}
                        data-clear-link={true}
                    >
                        {linkValue.title || linkKey}
                    </a>
                </div>
            );

            linksList.push(contentImage);
        }
        content.push(<div class={b("links")}>{linksList}</div>);
    }
    for (const levelKey of subLevels) {
        const value = tree[levelKey];
        const caption =
            meta in value
                ? value[meta].title
                : levelKey === heap
                ? "..."
                : levelKey;
        content.push(
            <li class={b("item")}>
                <Collapse
                    open={true}
                    title={
                        <div class={b("title")} title={String(levelKey)}>
                            {String(caption)}
                        </div>
                    }
                >
                    {renderTree(value)}
                </Collapse>
            </li>
        );
    }
    return (
        <ul style={topLevel || subLevels.length === 0 ? "border: none" : ""}>
            {content}
        </ul>
    );
}

export const Catalog = Component("Catalog", () => {
    return () => {
        return (
            <div class={b()}>
                <h2>
                    <Lang token={`menu/catalog`} />
                </h2>
                <p>
                    Полезные ссылки. При доступной локализации выбран русский
                    язык.
                </p>
                {renderTree(links, true)}
            </div>
        );
    };
});
