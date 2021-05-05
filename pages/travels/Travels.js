import './Travels.less';

import { Component, E, RouteLink, block } from '../../utils';
import { PageGrid, Tile } from '../../components';

const b = block('travels');

export const Travels = Component.Travels(() => {
    return () =>
        E.div.class(b())(
            E.h2('Путешествия'),
            PageGrid(RouteLink.href('travels/altai')(Tile.className(b('altai'))(E.h3('Алтай'))))
        );
});
