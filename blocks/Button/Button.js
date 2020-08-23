import './Button.less';

import {
    Component,
    E,
    M,
    block
} from '../../utils/index.js';

const b = block('button');

const Button = Component.Button(({props}) => {
    return () => {
        const {children, size, onClick, class: c, disabled} = props();
        return E.button.disabled(disabled).onClick(onClick || (() => {})).class(b() + (c ? ` ${c}` : ''))(
            children
        );
    };
})

export default Button;
