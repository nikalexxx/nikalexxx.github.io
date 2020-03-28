import {
    block,
    E,
    style,
    Component,
    RouteLink,
    css
} from '../../utils/index.js';
import {
    Button
} from '../../blocks/index.js';

import './Design.less';

const b = block('design');

const Design = Component.Design(() => {
    return () => {
        return E.div.class(b())(
            E.h2('Дизайн'),
            RouteLink.href('design/colors')(
                Button(
                    E.div.style(style({padding: '24px', fontSize: '64px', fontWeight: '500'}))(
                        E.span.style('color: #bc514a')('Ц'),
                        E.span.style('color: #99c27c')('в'),
                        E.span.style('color: #65b0ed')('е'),
                        E.span.style('color: #c57bdb')('т'),
                        E.span.style('color: #d0996a')('а'),
                    )
                )
            )
        );
    }
});

export default Design;
