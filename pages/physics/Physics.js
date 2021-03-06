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
                        Lang.token`tile/standart-model`.view(e => E.div.style`text-align: center`(e)),
                        E.div.class(b('particles'))(
                            'e',
                            E.sup('–'),
                            ', γ, H'
                        )
                    )
                )
            )
        );
    };
});

export default Physics;
