import {
    E,
    Component,
    block,
    style
} from './utils/index.js';

import {Button} from './blocks/index.js';

const b = block('my-component');

const MyComponent = Component.MyComponent(({props, state}) => {
    state.init({show: true});

    return () => {
        const {state: visible} = props;
        const {show} = state();
        const elem = show ? E.span('elem') : null;
        return E.div.class(b())(
            elem,
            E.span
                .style(style({color: {ok: 'green', error: 'red'}[visible]}))
                .class(b('state'))(
                    visible
                ),
            E.span.onClick((e) => {
                // console.log({show});
                state.set(prevState => ({show: !prevState.show}));
            })((show ? 'hide' : 'show'))
        )
    }
});

export default MyComponent;