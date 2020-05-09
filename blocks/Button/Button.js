import {
    E,
    M,
    Component,
    block
} from '../../utils/index.js';

import './Button.less';

const b = block('button');

const Button = Component.Button(({props: {children, size, onClick, class: c, disabled}}) => {
    return () => E.button.disabled(disabled).onClick(onClick || (() => {})).class(b() + (c ? ` ${c}` : ''))(
        children
    )
})

export default Button;
