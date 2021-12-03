import './book.less';

import { renderToString } from 'katex';
import Prism from 'prismjs';

import { Component, block } from '../../utils/index.js';
import { DOM, E } from '../../utils/element.js';
import { _b, _h, _i, _pre, consoleStyle } from '../../utils/consoleStyle.js';

import { Tooltip } from '../../blocks';
import { isPrimitive } from '../../utils/diff';
import { strToArray } from '../../utils/element.js';

const b = block('book');
const css = block('book');

const langGrammar = {
    javascript: Prism.languages.javascript,
    typescript: Prism.languages.typescript,
    css: Prism.languages.css,
};


function renderColorCode(text, lang) {
    const getStr = (s) =>
        Array.isArray(s)
            ? s
                  .map((e) => (Array.isArray(e) ? getStr(e) : e))
                  .map((e) => (typeof e !== 'string' ? '\n' : e))
                  .map(String)
                  .join('')
            : s;
    const str = getStr(text);
    if (typeof str !== 'string') {
        return 'Bad code';
    }
    return Prism.highlight(str, langGrammar[lang], lang);
}

function renderFormula(text, isBlock = false) {
    const str = Array.isArray(text) ? text.map(String).join('') : text;
    if (typeof str !== 'string') {
        return 'Bad formula';
    }
    return renderToString(str, {
        displayMode: isBlock,
        throwOnError: false,
        output: 'html',
    });
}

function parseNewLines(text, newLine) {
    const result = [];
    const brs = text.match(/\n\n+/g);
    if (!brs) {
        return text;
    }
    let tail = text;
    let i;
    for (const br of brs) {
        i = tail.indexOf(br);
        const subbrs = [];
        if (br.length === 2) {
            subbrs.push(newLine);
        } else {
            for (let j = 0; j < 2 * br.length - 4; j++) {
                subbrs.push(newLine);
            }
        }
        result.push(tail.slice(0, i), ...subbrs);
        tail = tail.slice(i + br.length);
    }
    if (tail) {
        result.push(tail);
    }

    return result;
}

const BadExternalComponent = Component.BadExternalComponent(
    ({ props }) =>
        () =>
            E.div.class(b('bad-external-component'))(
                E.h3('Bad external component'),
                E.details(E.summary('error'), E.p(`${props().error}`))
            )
);

const markerSymbol = Symbol('marker');
const markerStart = Symbol('start');
const markerEnd = Symbol('end');
const keySymbol = Symbol('key');
const sizeSymbol = Symbol('size');
// ?
const markerLine = Symbol('line');
const markerBlock = Symbol('block');

function prepareText(text) {
    return text.replace(/´/g, '\u0301');
}

function getMarker(name, f) {
    const getFunc = (props) => {
        const func = function (...args) {
            if (
                args.length > 0 &&
                Array.isArray(args[0]) &&
                args[0].hasOwnProperty('raw')
            ) {
                // теговый шаблон
                return f(props)(
                    strToArray(
                        args[0].map((e) => prepareText(e)),
                        ...args.slice(1)
                    ).map((e) =>
                        typeof e === 'string' ? parseNewLines(e, E.br) : e
                    )
                );
            } else {
                // обычный вызов
                const elem = f(props)(...args);
                if (!isPrimitive(elem)) {
                    elem[sizeSymbol] = args.reduce(
                        (sum, arg) =>
                            sum + (typeof arg === 'string' ? arg.length : 0),
                        0
                    );
                }
                return elem;
            }
        };
        func[markerSymbol] = name;
        return func;
    };
    const getFuncProxy = (props) =>
        new Proxy(getFunc(props), {
            get(target, name) {
                return (value) => getFuncProxy({ ...props, [name]: value });
            },
        });
    // func[markerSymbol] = name;
    // func.key = (key) => ({ [keySymbol]: key, builder: func });
    // func.start = ({ [markerStart]: func[markerSymbol], builder: func });
    // func.end = ({ [markerEnd]: func[markerSymbol], builder: func });
    return getFuncProxy({});
}

const markerTypes = {
    item: 0,
    start: 1,
    end: 2,
};

const j = (t) =>
    isPrimitive(t)
        ? t
        : Array.isArray(t)
        ? t.map((e) => j(e))
        : typeof t === 'function'
        ? t
        : Object.keys(t).reduce((o, e) => ({ [e]: j(t[e]) }), {});

const createHtmlBook = (meta, strings, ...elements) => {
    const newLine = E.br;
    const stringElements = strings
        .map((s) => parseNewLines(prepareText(s), newLine))
        .filter((e) => e);

    const head = stringElements[0];
    const list = Array.isArray(head) ? head : [head];
    const scopes = [];
    const values = [];
    for (let i = 1; i < strings.length; i++) {
        const stringElem = stringElements[i];
        const elem = elements[i - 1];
        let resultElem = null;
        const isMarker =
            markerSymbol in elem || markerStart in elem || markerEnd in elem;

        if (isMarker) {
            const scopeName =
                elem[markerSymbol] || elem[markerStart] || elem[markerEnd];

            if (
                markerEnd in elem ||
                (scopes.length > 0 &&
                    // scopes.some(
                    //     (scope) => scope.name === scopeName
                    // ))
                    scopes[scopes.length - 1].name === scopeName)
            ) {
                // закрываем одну или несколько вложенных областей
                let lastScopeIndex = 0;
                for (let i = scopes.length - 1; i >= 0; i--) {
                    if (scopes[i].name === scopeName) {
                        lastScopeIndex = scopes.length - 1 - i;
                        break;
                    }
                }
                let currentElem;
                for (let i = 0; i <= lastScopeIndex; i++) {
                    const { builder } = scopes.pop();
                    const currentValues = values.pop();
                    currentElem = builder([
                        ...currentValues,
                        ...(currentElem ? [currentElem] : []),
                    ]);
                }

                // итоговый элемент — закрытая область
                resultElem = currentElem;
            }
        }

        if (scopes.length === 0) {
            // корневой уровень
            if (isMarker && resultElem) {
                list.push(resultElem);
            } else if (!isMarker) {
                list.push(elem);
            }
        } else {
            // уровень области
            const value = values[values.length - 1];
            if (isMarker && resultElem) {
                value.push(resultElem);
            } else if (!isMarker) {
                value.push(elem);
            }
        }

        if (isMarker) {
            const scopeName =
                elem[markerSymbol] || elem[markerStart] || elem[markerEnd];
            if (
                (markerStart in elem ||
                    scopes.length === 0 ||
                    scopes.every((scope) => scope.name !== scopeName)) &&
                !(markerEnd in elem)
            ) {
                // открываем новую область
                scopes.push({
                    name: scopeName,
                    type: markerTypes.item,
                    builder: markerSymbol in elem ? elem : elem.builder,
                });
                values.push([]); // children
            }
        }

        if (scopes.length === 0) {
            // корневой уровень
            list.push(
                ...(Array.isArray(stringElem) ? stringElem : [stringElem])
            );
        } else {
            // уровень области
            const value = values[values.length - 1];
            value.push(
                ...(Array.isArray(stringElem) ? stringElem : [stringElem])
            );
        }
    }
    if (scopes.length > 0) {
        // закрываем незакрытые области
        let currentElem;
        for (let i = 0; i < scopes.length; i++) {
            const { builder } = scopes.pop();
            const currentValues = values.pop();
            currentElem = builder(
                ...[...currentValues, ...(currentElem ? [currentElem] : [])]
            );
        }
        list.push(currentElem);
    }

    const filteredList = list.filter((e) => e);
    if (meta.root) {
        for (const key of Object.keys(meta)) {
            filteredList[key] = meta[key];
        }
        // filteredList[sizeSymbol] = filteredList.reduce((sum, elem) => {
        //     if (typeof elem === 'string') {
        //         sum += elem.length;
        //     } else if (Reflect.has(elem, sizeSymbol)) {
        //         sum += elem[sizeSymbol];
        //     }
        //     return sum;
        // }, 0);
        for (const key of meta.setRefs.keys()) {
            if (!meta.refs.has(key)) {
                console.error(`ref for ${key} does not exist`);
            }
            for (const setFunc of meta.setRefs.get(key)) {
                setFunc(() => meta.refs.get(key));
            }
        }
        for (const key of meta.setMetadata.keys()) {
            if (!meta.metadata.has(key)) {
                console.error(`metadata for ${key} does not exist`);
            }
            for (const setFunc of meta.setMetadata.get(key)) {
                setFunc(meta.metadata.get(key) || {});
            }
        }
    }
    return filteredList;
};

export function createBook(f) {
    return {
        to: (type) => {
            const types = {
                html: () => {
                    const refs = new Map(); // части книги
                    const metadata = new Map(); // данные
                    const setMetadata = new Map();

                    const b = getMarker('b', () => (t) => E.b(t));
                    const i = getMarker(
                        'i',
                        () => (t) => E.i.class(css('i'))(t)
                    );
                    const a = getMarker(
                        'a',
                        ({ href }) =>
                            (t) =>
                                E.a.href(href)(t)
                    );
                    const sub = getMarker('sub', () => (t) => E.sub(t));
                    const sup = getMarker('sup', () => (t) => E.sup(t));
                    const code = getMarker(
                        'code',
                        () => (t) => E.code(t),
                        refs
                    );

                    const small = getMarker('small', ({ inline }) => (t) => {
                        return E.div.class(css('small', { inline }))(t);
                    });

                    const area = getMarker(
                        'area',
                        ({ key, inline, meta }) =>
                            (t) => {
                                const elem = E.div.class(css('area'))
                                    .style`display: ${
                                    inline ? 'inline-' : ''
                                }block;`
                                    ['data-key'](key)
                                    .id(key)(t);
                                refs.set(key, elem);
                                if (meta) {
                                    metadata.set(key, meta);
                                }
                                return elem;
                            }
                    );

                    const use = (...args) => {
                        let key;
                        if (
                            args.length > 0 &&
                            Array.isArray(args[0]) &&
                            args[0].hasOwnProperty('raw')
                        ) {
                            // теговый шаблон
                            key = strToArray(args[0], ...args.slice(1))
                                .map(String)
                                .join('');
                        } else {
                            // обычный вызов
                            key = args[0];
                        }
                        if (!setMetadata.has(key)) {
                            setMetadata.set(key, []);
                        }
                        return (func) => {
                            let value = null;
                            setMetadata.get(key).push((meta) => {
                                value = func(meta);
                            });

                            return Component.Use(({ state, hooks }) => {
                                state.init({ value: null });
                                hooks.didMount(() => {
                                    state.set({ value });
                                });
                                return () => {
                                    const { value } = state();
                                    return E.span(value);
                                };
                            });
                        };
                    };

                    const tooltip = getMarker('tooltip', ({ text }) => (t) => {
                        return Tooltip.text(
                            E.div.class(css('ref-content'))(text)
                        )(E.span.class(css('label'))(t));
                    });

                    const draft = getMarker('draft', () => (t) => {
                        return E.div.class(css('draft'))(t);
                    });

                    const author = getMarker('author', () => (t) => {
                        return E.span(t);
                    });

                    const Link = Component.Link(({ props }) => {
                        function onLinkClick(e) {
                            e.preventDefault();
                            const { callbacks, ref } = props();
                            if (callbacks && callbacks.hasOwnProperty('pre')) {
                                callbacks.pre(e);
                            }
                            const refElement = Array.from(
                                document.querySelectorAll(`[data-key="${ref}"]`)
                            ).filter((e) => !e.closest('.tooltip'))[0];
                            if (refElement) {
                                refElement.scrollIntoView();
                                const activeClass = css('active');
                                refElement.classList.add(activeClass);
                                setTimeout(
                                    () =>
                                        refElement.classList.remove(
                                            activeClass
                                        ),
                                    2000
                                );
                            }
                        }
                        return () => {
                            const { children } = props();
                            return E.a
                                .class(css('ref-link'))
                                .onClick(onLinkClick)(children);
                        };
                    });

                    const link = getMarker(
                        'link',
                        ({ ref }) =>
                            (t) =>
                                Link.ref(ref)(t)
                    );

                    const setRefs = new Map();
                    const label = getMarker('label', ({ ref }) => (t) => {
                        let text = null;
                        if (!setRefs.has(ref)) {
                            setRefs.set(ref, []);
                        }
                        const setList = setRefs.get(ref);
                        function setLabelClick(p) {
                            text = p();
                        }

                        setList.push(setLabelClick);
                        return Component.BookLabel(({ state, hooks }) => {
                            state.init({ text: null });

                            hooks.didMount(() => {
                                state.set({ text });
                            });

                            function hideTooltip() {
                                const labelElement = document.querySelector(
                                    `span[data-ref="${ref}"]`
                                );
                                labelElement.click();
                            }

                            return () => {
                                const { text } = state();
                                const textContent = E.div.class(
                                    css('ref-content')
                                )(
                                    text,
                                    Link.ref(ref).callbacks({
                                        pre: hideTooltip,
                                    })(E.span.style`font-size: 2rem`('→'))
                                );
                                return Tooltip.text(textContent)(
                                    E.span.class(css('label'))['data-ref'](ref)(
                                        t
                                    )
                                );
                            };
                        })();
                    });

                    const headers = [];
                    const h = (l) =>
                        getMarker(`h${l}`, ({ key }) => (t) => {
                            headers.push([l, E.div(t)]);
                            return E[`h${l}`]
                                ['data-key'](key)
                                .id(key || DOM(E.div(t)).textContent.trim())(t);
                        });

                    const ul = getMarker('ul', () => (t) => E.ul(t));
                    const li = getMarker('li', () => (t) => E.li(t));
                    const images = new Map();
                    let imageIndex = 0;
                    const img = getMarker(
                        'img',
                        ({ src, alt, position = 'center', height, width }) =>
                            (t) => {
                                const isSvg = src.endsWith('.svg');
                                const sizeStyle = `${
                                    height
                                        ? `max-height: ${Math.floor(
                                              height * 100
                                          )}vh;`
                                        : ''
                                }${
                                    width
                                        ? `max-width: ${Math.floor(
                                              width * 100
                                          )}vw;`
                                        : ''
                                }`;
                                const image = E.picture.style(sizeStyle)(
                                    isSvg &&
                                        E.source.type`image/svg+xml`.srcSet(
                                            src
                                        ),
                                    E.img.style(sizeStyle).src(src).alt(alt)
                                );
                                const content = t
                                    ? E.figure.class(
                                          css('img-figure', { position })
                                      )(image, E.figcaption(t))
                                    : image;

                                const imageKey = String(imageIndex++);
                                const img = E.div
                                    .class(css('img', { position }))
                                    ['data-image'](imageKey)(content);
                                images.set(imageKey, img);
                                return img;
                            }
                    );
                    const pre = getMarker(
                        'pre',
                        ({ lang }) =>
                            (t) =>
                                lang
                                    ? E.pre._html(renderColorCode(t, lang))
                                    : E.pre(t)
                    );
                    const createBook = (...args) => {
                        return createHtmlBook(
                            {
                                root: false,
                                headers,
                                refs,
                                setRefs,
                                images,
                                metadata,
                                setMetadata,
                            },
                            ...args
                        );
                    };
                    createBook.root = (...args) => {
                        return createHtmlBook(
                            {
                                root: true,
                                headers,
                                refs,
                                setRefs,
                                images,
                                metadata,
                                setMetadata,
                            },
                            ...args
                        );
                    };

                    return {
                        V: createBook,
                        book: createBook,
                        _: createBook,
                        b,
                        i,
                        sub,
                        sup,
                        code,
                        h,
                        n: E.br,
                        p: getMarker('p', (t) => E.p(t)),
                        ul,
                        li,
                        img: (src, alt) => E.img.src(src).alt(alt),
                        a: (href) => (text) => E.a.href(href)(text),
                        meta: { draft, author },
                        block: { area, ul, li, img, pre, small },
                        text: {
                            b,
                            i,
                            sub,
                            sup,
                            code,
                            h,
                            label,
                            tooltip,
                            a,
                            link,
                        },
                        math: {
                            $: getMarker(
                                '$',
                                () => (t) =>
                                    E.div.style`display: inline-block`._html(
                                        renderFormula(t)
                                    )
                            ),
                            $$: getMarker(
                                '$$',
                                () => (t) =>
                                    E.div
                                        .style`display: block; text-align: center; overflow: scroll;`._html(
                                        renderFormula(t, true)
                                    )
                            ),
                        },
                        control: {
                            start: (func) => ({
                                [markerStart]: func[markerSymbol],
                                builder: func,
                            }),
                            end: (func) => ({
                                [markerEnd]: func[markerSymbol],
                                builder: func,
                            }),
                        },
                        external: (f) => {
                            try {
                                return f({ E, Component });
                            } catch (e) {
                                console.error(e);
                                return BadExternalComponent.error(e);
                            }
                        },
                        use,
                    };
                },
                markdown: () => ({
                    V: (strings, ...elements) => {
                        const list = [strings[0]];
                        for (let i = 1; i < strings.length; i++) {
                            list.push(elements[i - 1], strings[i]);
                        }
                        return list.join('');
                    },
                    b: (t) => `**${t}**`,
                    i: (t) => `_${t}_`,
                    code: (t) => `\`${t}\``,
                    h: (l) => (t) => `${'#'.repeat(l)} ${t}`,
                    n: '  \n',
                    p: (t) => `\n\n${t}\n\n`,
                    img: (src, alt) => `![${alt || ''}](${src})`,
                    a: (href) => (text) => `[${text || ''}](${href})`,
                    external: (f) => {
                        try {
                            return `${f()}`;
                        } catch (e) {
                            console.error(e);
                            return 'Bad external component';
                        }
                    },
                }),
                browserConsole: () => ({
                    V: consoleStyle,
                    b: _b,
                    i: _i,
                    code: _pre,
                    h: _h,
                    n: '\n',
                    p: (t) => t,
                    img: (src, alt) => [`IMG[${src || ''}]: ${alt || ''}`, []],
                    a: (href) => (text) => [`${href} (${text})`, []],
                }),
            };
            if (type && type in types) {
                return f(types[type]());
            } else {
                throw new Error(
                    `Invalid type. Available types: ${Object.keys(
                        types
                    ).join()}`
                );
            }
        },
    };
}

// const bookTemplate = createBook(({b, i, h, code, n, p, img, a, V}) =>
// V`
// ${h(1)('Header')}
// ${p(V`
// ${b('жирный')} текст ${n}
// ${i('курсивный')} текст
// ${img('../assets/images/favicon/favicon-32x32.png', 'favicon')}
// `)}
// блок ${code('программного кода')} ${n}
// ${a('https://github.com')('Гитхаб')} - ссылка
// `);

// export const book = bookTemplate.to('html');

// console.log(bookTemplate.to('markdown'));

// const [text, styles] = bookTemplate.to('browserConsole');
// console.log(text, ...styles);
