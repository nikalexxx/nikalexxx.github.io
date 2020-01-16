import {
    E,
    M,
    Component,
    RouteLink,
    css,
    block,
    style
} from '../../utils/index.js';

css(import.meta.url, 'Breadcrumbs.less');

const b = block('breadcrumbs');

const Breadcrumbs = Component.Breadcrumbs(({props}) => {
    return () => E.div.class(b())(
        props.items
        .map(([name, href], i) => {
            const last = i === props.items.length - 1;
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
