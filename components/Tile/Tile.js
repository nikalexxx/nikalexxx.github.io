import './Tile.less';

import { Component, E, block } from '../../utils';

const b = block('tile');

export const Tile = Component.Tile(({props}) => {
    return () => {
        const {children} = props();
        return E.div.class(b())(E.div(children))
    }
})
