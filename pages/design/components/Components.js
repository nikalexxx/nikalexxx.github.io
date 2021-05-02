import './Components.less';

import {
    Button,
    Checkbox,
    Collapse,
    Select,
    Spin,
    Tooltip,
} from '../../../blocks';
import { Component, E, block } from '../../../utils';

import { Breadcrumbs } from '../../../components';

const b = block('components');

export const Components = Component.Components(() => {
    return () =>
        E.div(
            Breadcrumbs.items([['Дизайн', 'design'], ['Блоки и компоненты']]),
            E.div.class(b())(
                E.h2('Button'),
                E.div(
                    E.div.class(b('example'))(
                        Button.onClick(() => alert('привет'))`нажми меня`
                    ),
                    Collapse.title`code`(
                        E.pre(
                            '\n' +
                                `Button.onClick(() => alert('привет'))\`нажми меня\``
                        )
                    )
                ),
                E.h2('Checkbox'),
                E.div(
                    E.div.class(b('example'))(
                        Checkbox.onChange((e) =>
                            alert(
                                e.target.checked
                                    ? 'отметка поставлена'
                                    : 'отметка снята'
                            )
                        )('поставь галочку')
                    ),
                    Collapse.title`code`.open(false)(
                        E.pre(`
Checkbox.onChange((e) =>
    alert(
        e.target.checked
            ? 'отметка поставлена'
            : 'отметка снята'
    )
)('поставь галочку'),`)
                    )
                ),
                E.h2('Collapse'),
                E.div(
                    E.div.class(b('example'))(
                        Collapse.title('Заголовок')(E.p`Содержимое`)
                    ),
                    Collapse.title`code`(
                        E.pre(
                            '\n' +
                                `Collapse.title('Заголовок')(E.p\`Содержимое\`)`
                        )
                    )
                ),
                E.h2('Select'),
                E.div(
                    E.div.class(b('example'))(
                        Select.onChange((e) =>
                            alert(`Значение ${e.target.value}`)
                        ).values([
                            { value: '1', title: 'вариант 1' },
                            {
                                value: '2',
                                title: 'вариант 2 (заранее выбран)',
                                selected: true,
                            },
                            {
                                value: 'g1',
                                title: 'вариант g1',
                                group: 'группа 1',
                            },
                            {
                                value: 'g2',
                                title: 'вариант g2',
                                group: 'группа 1',
                            },
                        ])
                    ),
                    Collapse.title`code`(
                        E.pre(
                            '\n' +
                                `Select.onChange((e) =>
    alert(\`Значение \${e.target.value}\`)
).values([
    { value: '1', title: 'вариант 1' },
    {
        value: '2',
        title: 'вариант 2 (заранее выбран)',
        selected: true,
    },
    {
        value: 'g1',
        title: 'вариант g1',
        group: 'группа 1',
    },
    {
        value: 'g2',
        title: 'вариант g2',
        group: 'группа 1',
    },
])`
                        )
                    )
                ),
                E.h2('Spin'),
                E.div(
                    E.div.class(b('example'))(
                        E.div.style`display: flex; gap: 1rem`(
                            Spin.size('xl'),
                            Spin.size('l'),
                            Spin.size('m'),
                            Spin.size('s')
                        )
                    ),
                    Collapse.title`code`(
                        E.pre(
                            '\n' +
                                `E.div.style\`display: flex; gap: 1rem\`(
    Spin.size('xl'),
    Spin.size('l'),
    Spin.size('m'),
    Spin.size('s')
)`
                        )
                    )
                ),
                E.h2('Tooltip'),
                E.div(
                    E.div.class(b('example'))(
                        Tooltip.text([
                            'Текст подсказки',
                            E.ul(E.li('и другие'), E.li('элементы')),
                        ])('подсказка')
                    ),
                    Collapse.title`code`(
                        E.pre(
                            '\n' +
                                `Tooltip.text([
    'Текст подсказки',
    E.ul(E.li('и другие'), E.li('элементы')),
])('подсказка')`
                        )
                    )
                )
            )
        );
});
