import './Tile.less';

import { Component, block } from '../../utils';

import { Button } from '../../blocks';

const b = block('tile');

export const Tile = Component.Tile(({props}) => {
    return () => {
        const {children} = props();
        return Button.class(b())(children)
    }
})
