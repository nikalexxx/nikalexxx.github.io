import './Travels.less';

import { Component, E, RouteLink, block } from '../../utils';
import { PageGrid, Tile } from '../../components';
import { Lang } from '../../blocks';

const b = block('travels');

export const Travels = Component.Travels(() => {
    return () =>
        E.div.class(b())(
            E.h2(Lang.token`menu/travels`),
            PageGrid(
                RouteLink.href('travels/crimea')(
                    Tile.className(b('crimea'))(E.h3('Крым'))
                ),
                RouteLink.href('travels/krasnodar-krai')(
                    Tile.className(b('krasnodar-krai'))(E.h3('Краснодарский край'))
                ),
                RouteLink.href('travels/altai')(
                    Tile.className(b('altai'))(E.h3('Алтай'))
                )
            ),
            E.br,
            E.br,
            PageGrid.itemWidth(150)(
                RouteLink.href('travels/smolensk')(
                    Tile.className(b('smolensk'))(E.h3('Смоленск'))
                )
            )
        );
});
