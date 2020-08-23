import './Unicode.less';

import {
    Component,
    E,
    block
} from '../../utils/index.js';

import {Breadcrumbs} from '../index.js';
import {
    Button
} from '../../blocks/index.js';

const b = block('unicode');

const limit = 5000;
const max = 65535;
const count = (max - (max % limit)) / limit + 1;

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
        const startI = start * limit;
        const end = start * limit + limit;
        const endI = end > max ? max : end;
        return E.div(
            Breadcrumbs.items([['Проекты', 'projects'], ['Юникод']]),
            E.div.class(b())._forceUpdate(true)
            (
                E.div.class(b('menu'))([...(new Array(count)).keys()].map(i =>
                    E.div
                        .class(b('button-container'))
                        .onClick(() => state.set({i}))
                    (
                        Button(E.span.class(b('button', {active: i === start}))(`${i}`))
                    )
                )),
                E.div(
                    E.h2('Юникод'),
                    E.p(E`Пока представлена только ${E.a.href('https://en.wikipedia.org/wiki/Plane_(Unicode)#Basic_Multilingual_Plane')('основная многоязычная плоскость')}`),
                    E.br,
                    E.p(`Cимволы ${startI} - ${endI}`),
                    E.br,
                    E.div._forceUpdate(true).class(b('table'))(getUnicodeList(startI, endI))
                )
            )
        );
    }
});

export default Unicode;
