import './Breadcrumbs.less';

import {
    Component,
    E,
    M,
    RouteLink,
    block,
    css,
    style
} from '../../utils/index.js';

const b = block('breadcrumbs');

const Breadcrumbs = Component.Breadcrumbs(({props}) => {
    return () => E.div.class(b())(
        props().items
        .map(([name, href], i) => {
            const last = i === props().items.length - 1;
            return E.span(
                E.div.style('display: inline-block')(
                    last ? name : RouteLink.href(href)(name)
                ),
                last ? '' : ' / '
            );
        })
    );
});

export default Breadcrumbs;
