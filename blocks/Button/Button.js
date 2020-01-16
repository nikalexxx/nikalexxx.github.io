import {
    E,
    M,
    Component,
    RouteLink,
    getRouterState,
    Switch,
    css,
    block,
    style
} from '../../utils/index.js';

css(import.meta.url, 'Button.less');

const b = block('button');

const Button = Component.Button(({props: {children, size}}) => {
    return () => E.button.class(b())(
        children
    )
})

export default Button;
