import {
    E,
    Component,
    block,
    style
} from './utils/index.js';

const b = block('my-component');

const MyComponent = Component.MyComponent(({setState, initState}) => {
    initState({show: true});

    return ({state}, {show}) => {
        const elem = show ? E.span('elem') : null;
        return E.div.class(b())(
            elem,
            E.span
                .style(style({color: {ok: 'green', error: 'red'}[state]}))
                .class(b('state'))(
                    state
                ),
            E.span.onClick((e) => {
                // console.log({show});
                setState(prevState => ({show: !prevState.show}));
            })(show ? 'hide' : 'show')
        )
    }
});

export default MyComponent;
