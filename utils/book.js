import {E} from './element.js';
import { consoleStyle, _b, _i, _pre, _h } from './consoleStyle.js';
import {Component} from './index.js';

export function createBook(f) {
    return {
        to: type => {
            const types = {
                html: () => ({
                    V: (strings, ...elements) => {
                        const stringElements = strings.map(s => {
                            const result = [];
                            const brs = s.match(/\n\n+/g);
                            if (!brs) {
                                return s;
                            }
                            let tail = s;
                            let i;
                            for (const br of brs) {
                                i = tail.indexOf(br);
                                const subbrs = [];
                                if (br.length === 2) {
                                    subbrs.push(E.br())
                                } else {
                                    for (let j = 0; j < 2 * br.length - 4; j++) {
                                        subbrs.push(E.br());
                                    }
                                }
                                result.push(tail.slice(0, i), ...subbrs);
                                tail = tail.slice(i + br.length);
                            }
                            result.push(tail);

                            return result;
                        })
                        const list = [...stringElements[0]];
                        for (let i = 1; i < strings.length; i++) {
                            list.push(elements[i-1], ...stringElements[i]);
                        }
                        return list;
                    },
                    b: t => E.b(t),
                    i: t => E.i(t),
                    code: t => E.code(t),
                    pre: t => E.pre(t),
                    h: l => t => E[`h${l}`](t),
                    n: E.br,
                    p: t => E.p(t),
                    img: (src, alt) => E.img.src(src).alt(alt),
                    a: href => text => E.a.href(href)(text),
                    external: f => f(E, Component)
                }),
                markdown: () => ({
                    V: (strings, ...elements) => {
                        const list = [strings[0]];
                        for (let i = 1; i < strings.length; i++) {
                            list.push(elements[i-1], strings[i]);
                        }
                        return list.join('');
                    },
                    b: t => `**${t}**`,
                    i: t => `_${t}_`,
                    code: t => `\`${t}\``,
                    h: l => t => `${'#'.repeat(l)} ${t}`,
                    n: '  \n',
                    p: t => `\n\n${t}\n\n`,
                    img: (src, alt) => `![${alt || ''}](${src})`,
                    a: href => text => `[${text || ''}](${href})`
                }),
                browserConsole: () => ({
                    V: consoleStyle,
                    b: _b,
                    i: _i,
                    code: _pre,
                    h: _h,
                    n: '\n',
                    p: t => t,
                    img: (src, alt) => [`IMG[${src || ''}]: ${alt || ''}`, []],
                    a: href => text => [`${href} (${text})`, []]
                })
            };
            if (type && type in types) {
                return f(types[type]());
            } else {
                throw new Error(`Invalid type. Available types: ${Object.keys(types).join()}`);
            }
        }
    }
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

