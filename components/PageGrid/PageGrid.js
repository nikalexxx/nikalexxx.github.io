import './PageGrid.less';

import { Component, E, block } from '../../utils';

const b = block('page-grid');

export const PageGrid = Component.PageGrid(({ props }) => {
    return () => {
        const { children } = props();
        return E.div.class(b())(children);
    };
});

