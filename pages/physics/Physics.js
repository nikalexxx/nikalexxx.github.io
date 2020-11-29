import './Physics.less';

import { Component, E, RouteLink, block, style } from '../../utils';
import { PageGrid, Tile } from '../../components';

import { Button } from '../../blocks';

const b = block('physics');

const Physics = Component.Physics(() => {
    return () => {
        return E.div.class(b())(
            E.h2('Физика'),
            PageGrid(
                RouteLink.href('physics/standard-model')(
                    Tile(
                        'Стандартная модель',
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
