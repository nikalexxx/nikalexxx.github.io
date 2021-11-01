import './Select.less';

import {
    Component,
    E,
    M,
    block
} from '../../utils';

const b = block('select');

const Select = Component.Select(({props}) => {

    const heap = Symbol('heap');

    function getPreparedValues() {
        const groups = {[heap]: []};
        for (const option of props().values) {
            if (option.group) {
                if (!groups[option.group]) {
                    groups[option.group] = [];
                }
                groups[option.group].push(option)
            } else {
                groups[heap].push(option);
            }
        }
        return groups;
    }

    return () => {
        const groups = getPreparedValues(props().values);
        return E.div.class(b())(
            E.select.class(`${b('native')} ${props().className || ''}`).onChange(props().onChange)(
                Object.keys(groups).map(name => {
                    const options = groups[name];
                    return E.optgroup.label(name)(
                        options.map(e => E.option.value(e.value).selected(e.selected)(e.title))
                    )
                }),
                groups[heap].map((e) => {
                    return E.option.value(e.value).selected(e.selected)(e.title)
                })
            ),
            E.div.class(b('expand'))('▾')
        );
    }
})

export default Select;
