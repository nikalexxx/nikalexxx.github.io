import {
    E,
    M,
    Component,
    block
} from '../../utils/index.js';

import './Checkbox.less';

const b = block('checkbox');

const Checkbox = Component.Checkbox(({props}) => {
    return () => E.label.class(b())(
        E.input.type`checkbox`.class(b('input'))._props(props),
        E.div.class(b('box'))(
            E.div(
                '✓'
            )
        ),
        props.children
    )
})

export default Checkbox;
