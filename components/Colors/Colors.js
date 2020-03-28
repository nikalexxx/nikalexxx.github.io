import {
    block,
    E,
    css,
    style,
    Component
} from '../../utils/index.js';

import {Breadcrumbs} from '../index.js';

import './Colors.less';

const colors = [
    'area',
    'menu',
    'menu-active',
    'menu-hover',
    'menu-folder',
    'element-active',
    'string-number',
    'syntax-variable',
    'syntax-number',
    'syntax-operator',
    'syntax-gray',
    'syntax-dark-gray',
    'syntax-keyword',
    'syntax-class',
    'syntax-function',
    'syntax-string',
    'syntax-inline',
    'input-text',
    'input-area',
    'md-link',
    'atom-link',
    'atom-button',
    'atom-button-hover',
    'atom-black-line'
];

const b = block('colors');

const Colors = Component.Colors(() => {
    return () => E.div(
        Breadcrumbs.items([['Дизайн', 'design'], ['Цвета']]),
        E.div.class(b())(
            colors.map(color => {
                const code = getComputedStyle(document.documentElement).getPropertyValue(`--color-${color}`).trim();
                const rgb = (s => [s.slice(0,2), s.slice(2,4),s.slice(4)].map(hex => parseInt(hex, 16)))(code.slice(1))
                const v = Math.max(...rgb);
                const contrast = v > 162 ? 'black' : 'white';
                const border = v > 38 && v < 78 ? 'solid 1px #abb2de' : '';
                const colorNode = E.div(
                    E.div
                        .class(b('area', {color}))
                        .style(style({
                            border,
                            color: contrast
                        }))
                    (
                        E.div.class(b('name'))(code)
                    ),
                    E.div(color)
                );
                return colorNode;
            })
        )
    );
});


export default Colors;
