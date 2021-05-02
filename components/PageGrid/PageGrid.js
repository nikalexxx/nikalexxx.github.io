import './PageGrid.less';

import { Component, E, block } from '../../utils';

const b = block('page-grid');

export const PageGrid = Component.PageGrid(({ props }) => {
    return () => {
        const { children, itemWidth = 210 } = props();
        return E.div.class(b()).style`grid-template-columns: repeat(auto-fill, minmax(${itemWidth}px, 1fr));`(children);
    };
});

