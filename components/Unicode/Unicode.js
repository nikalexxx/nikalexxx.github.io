import {
    block,
    E,
    style,
    Component,
    RouteLink,
    css
} from '../../utils/index.js';
import {
    Button
} from '../../blocks/index.js';

import {Breadcrumbs} from '../index.js';

css(import.meta.url, 'Unicode.less');

const b = block('unicode');

const limit = 1000;

function getUnicodeList(start, end) {
    const table = [];
    for (let i = start; i < end; i++) {
        table.push(E.div.title(i)(String.fromCharCode(i)));
    }
    return table;
}

const Unicode = Component.Unicode(({state}) => {
    state.init({i: 0});

    return () => {
        const start = state().i;
        return E.div(
            Breadcrumbs.items([['Проекты', 'projects'], ['Юникод']]),
            E.div._update(start < 50).style`margin: 16px 0`([...(new Array(100)).keys()].map(i =>
                E.div.onClick(() => state.set({i})).style(`display: inline-block;margin: 1px;`)(
                    Button(E.span.style(`color: ${i === start ? 'red' : 'black'};`)(`${i}`))
                )
            )),
            E.div.class(b())(
                E.h2('Юникод'),
                E.p(`Cимволы ${start * limit} - ${start * limit + limit}`),
                E.br,
                E.div._forceUpdate(true).class(b('table'))(getUnicodeList(start * limit, start * limit + limit))
            )
        );
    }
});

export default Unicode;
