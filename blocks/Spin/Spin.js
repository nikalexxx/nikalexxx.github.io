import './Spin.less';

import { Component, E, M, block } from '../../utils/index.js';

const b = block('spin');

const Spin = Component.Spin(({ props, state, hooks }) => {
    state.init({active: false});

    hooks.didMount(() => {
        setTimeout(() => {
            state.set({active: true});
        }, 0);
    });

    return () => {
        const { size = 'l' } = props();
        const {active} = state();
        return E.div.class(b('', { size, active }))(
            E.div.class(b('hex-part')),
            E.div.class(b('hex-part')).style('transform: rotate(60deg)'),
            E.div.class(b('hex-part')).style('transform: rotate(-60deg)'),
        );
    };
});

export default Spin;
