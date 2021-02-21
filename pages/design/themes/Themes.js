import './Themes.less';

import {
    Component,
    E,
    block,
} from '../../../utils';

import { Breadcrumbs } from '../../../components';

const b = block('themes');

const example = [
    ['основной текст', b('text')],
    ['текст активного действия, например для ссылок', b('text-active')],
    ['текст, который акцентирует внимание, например для ссылок при наведении', b('text-accent')],
    ['основной фон', b('background')],
    ['дополнительный фон', b('background-second')],
    ['фон активных элементов', b('background-prime')],
    ['фон элементов, выделенных среди других, например текущая страница в меню', b('background-accent')],
    ['граница', b('border')],
    ['контрастная граница', b('border-contrast')],
];

const Themes = Component.Themes(() => {
    return () => E.div(
        Breadcrumbs.items([['Дизайн', 'design'], ['Темы']]),
        E.div.class(b())(
            E.div.class(`theme_dark ${b('header')}`)(
                E.div(E.h3('Тёмная тема'))
            ),
            E.div.class(`theme_light ${b('header')}`)(
                E.div(E.h3('Светлая тема'))
            ),
            example.map(([text, className]) => [
                E.div.class('theme_dark')(E.div.class(className)(text)),
                E.div.class('theme_light')(E.div.class(className)(text)),
            ]),
        )
    );
});


export default Themes;