import './Breadcrumbs.less';
import { RawContainer } from '../../utils/core/vdom-model';

import {
    Component,
    E,
    RouteLink,
    block,
} from '../../utils';

const b = block('breadcrumbs');

interface Props {
    items: [RawContainer, string][];
}

export const Breadcrumbs = Component.Breadcrumbs<Props>(({ props }) => {
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
