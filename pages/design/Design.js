import './Design.less';

import { Component, E, RouteLink, block, style } from '../../utils';
import { PageGrid, Tile } from '../../components';

import { Button } from '../../blocks';

const b = block('design');

const Design = Component.Design(() => {
    return () => {
        return E.div.class(b())(
            E.h2('Дизайн'),
            PageGrid(
                RouteLink.href('design/colors')(
                    Tile(
                        E.div.class(b('huge'))(
                            E.span.style('color: var(--color-red)')('Ц'),
                            E.span.style('color: var(--color-green-light)')('в'),
                            E.span.style('color: var(--color-blue-sky)')('е'),
                            E.span.style('color: var(--color-violet-light)')('т'),
                            E.span.style('color: var(--color-orange-light)')('а')
                        )
                    )
                ),
                RouteLink.href('design/themes')(
                    Tile(
                        E.div.class(b('huge'))(
                            E.span.style('color: var(--color-black)')('Те'),
                            E.span.style('color: var(--color-gray-light)')('мы'),
                        ),
                    )
                )
            )
        );
    };
});

export default Design;
