import './Design.less';

import { Component, E, RouteLink, block, style } from '../../utils';
import { PageGrid, Tile } from '../../components';

import { Lang } from '../../blocks/LangToken/LangToken';

const b = block('design');

const colorList = [
    'var(--color-red)',
    'var(--color-green-light)',
    'var(--color-blue-sky)',
    'var(--color-violet-light)',
    'var(--color-orange-light)',
];

const Design = Component.Design(() => {
    return () => {
        return E.div.class(b())(
            E.h2(Lang.token`menu/design`),
            PageGrid(
                RouteLink.href('design/colors')(
                    Tile(
                        E.div.class(b('huge'))(
                            Lang.token`tile/colors`.view((e) =>
                                E.span(
                                    e
                                        .split('')
                                        .map((char, i) =>
                                            E.span.style(
                                                `color: ${
                                                    colorList[
                                                        i % colorList.length
                                                    ]
                                                }`
                                            )(char)
                                        )
                                )
                            )
                        )
                    )
                ),
                RouteLink.href('design/themes')(
                    Tile(
                        E.div.class(b('huge'))(
                            Lang.token`tile/themes`.view((e) => {
                                const middle = Math.floor(e.length / 2);
                                const firstPart = E.span.style(
                                    'color: var(--color-black)'
                                )(e.slice(0, middle));
                                const secondPart = E.span.style(
                                    'color: var(--color-gray-light)'
                                )(e.slice(middle, e.length));
                                return E.span.style(`font-size: ${4 / e.length * 100}%`)(firstPart, secondPart);
                            })
                        )
                    )
                ),
                RouteLink.href('design/components')(
                    Tile(
                        E.div
                            .style`color: var(--color-background); text-align: center;`.class(
                            b('border')
                        )(
                            Lang.token`tile/blocks`.view(e => {
                                const words = e.split(' ');
                                return E.div(
                                    E.div.class(b('huge'))(words[0].replace(/o|о/, '\u2699')),
                                    E.div.style`font-size: 32px;`(words.slice(1).join(' '))
                                );
                            }),
                        )
                    )
                )
            )
        );
    };
});

export default Design;
