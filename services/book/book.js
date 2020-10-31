import './book.less';

import { Component, block } from '../../utils/index.js';
import { _b, _h, _i, _pre, consoleStyle } from '../../utils/consoleStyle.js';

import { E } from '../../utils/element.js';
import { isPrimitive } from '../../utils/diff';
import { strToArray } from '../../utils/element.js';

const b = block('book');

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

const BadExternalComponent = Component.BadExternalComponent(({ props }) => () =>
    E.div.class(b('bad-external-component'))(
        E.h3('Bad external component'),
        E.details(E.summary('error'), E.p(`${props().error}`))
    )
);

const markerSymbol = Symbol('marker');
const markerStart = Symbol('start');
const markerEnd = Symbol('end');
// ?
const markerLine = Symbol('line');
const markerBlock = Symbol('block');

function getMarker(name, f) {
    const func = function (...args) {
        if (
            args.length > 0 &&
            Array.isArray(args[0]) &&
            args[0].hasOwnProperty('raw')
        ) {
            // теговый шаблон
            return f(
                strToArray(args[0], ...args.slice(1))
                    .map((e) => `${e}`)
                    .join('')
            );
        } else {
            // обычный вызов
            return f(...args);
        }
    };
    func[markerSymbol] = name;
    func.start = { [markerStart]: name, builder: func };
    func.end = { [markerEnd]: name, builder: func };
    return func;
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

const createHtmlBook = (strings, ...elements) => {
    const newLine = E.br;
    const stringElements = strings
        .map((s) => parseNewLines(s, newLine))
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
    return list.filter((e) => e);
};

export function createBook(f) {
    return {
        to: (type) => {
            const types = {
                html: () => ({
                    V: createHtmlBook,
                    book: createHtmlBook,
                    b: getMarker('b', (t) => E.b(t)),
                    i: getMarker('i', (t) => E.i(t)),
                    sub: getMarker('sub', (t) => E.sub(t)),
                    sup: getMarker('sup', (t) => E.sup(t)),
                    code: getMarker('code', (t) => E.code(t)),
                    pre: getMarker('pre', (t) => E.pre(t)),
                    h: (l) => getMarker(`h${l}`, (t) => E[`h${l}`](t)),
                    n: E.br,
                    p: getMarker('p', (t) => E.p(t)),
                    ul: getMarker('ul', (t) => E.ul(t)),
                    li: getMarker('li', (t) => E.li(t)),
                    img: (src, alt) => E.img.src(src).alt(alt),
                    a: (href) => (text) => E.a.href(href)(text),
                    external: (f) => {
                        try {
                            return f({ E, Component });
                        } catch (e) {
                            console.error(e);
                            return BadExternalComponent.error(e);
                        }
                    },
                }),
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
