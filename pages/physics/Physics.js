import './Physics.less';

import { Component, E, RouteLink, block, style } from '../../utils';
import { PageGrid, Tile } from '../../components';

import { Lang } from '../../blocks';

const b = block('physics');

const Physics = Component.Physics(() => {
    return () => {
        return E.div.class(b())(
            E.h2(Lang.token`menu/physics`),
            PageGrid(
                RouteLink.href('physics/standard-model')(
                    Tile(
                        E.div(
                            Lang.token`tile/standart-model`.view((e) =>
                                E.div.style`text-align: center`(e)
                            ),
                            E.div.class(b('particles'))(
                                'e',
                                E.sup('–'),
                                ', γ, H'
                            )
                        )
                    )
                ),
                RouteLink.href('physics/gravitation')(
                    Tile(
                        E.div.class(b('tile'))(
                            Lang.token`tile/gravitation`,
                            E.div.class(b('space'))(
                                E.div.class(b('sun')),
                                E.div.class(b('orbit'))(
                                    E.div.class(b('planet'))
                                )
                            )
                        )
                    )
                )
            )
        );
    };
});

export default Physics;
