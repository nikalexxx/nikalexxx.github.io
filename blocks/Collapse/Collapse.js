import './Collapse.less';

import { Component, E, block } from '../../utils';

const b = block('collapse');

export const Collapse = Component.Collapse(({ state, props }) => {
    state.init({ open: true });

    function toogle() {
        state.set((prev) => ({ open: !prev.open }));
    }

    return () => {
        const { title, children } = props();
        const { open } = state();
        return E.div(
            E.div.class(b('title', {state: open ? 'opened' : 'closed'})).onClick(toogle)(
                E.div.class(b('sign', {state: !open ? 'open' : 'close'}))(open ? '–' : '+'),
                E.div(title)
            ),
            open && children
        );
    };
});
