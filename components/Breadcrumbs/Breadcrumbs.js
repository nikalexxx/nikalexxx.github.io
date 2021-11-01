import './Breadcrumbs.less';

import {
    Component,
    E,
    M,
    RouteLink,
    block,
    style,
} from '../../utils';

const b = block('breadcrumbs');

export const Breadcrumbs = Component.Breadcrumbs(({ props }) => {
    return () =>
        E.div.class(b())(
            props().items.map(([name, href], i) => {
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
