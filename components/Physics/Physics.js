import {
    block,
    E,
    style,
    Component,
    RouteLink
} from '../../utils/index.js';
import {
    Button
} from '../../blocks/index.js';

import './Physics.less';

const b = block('physics');

const Physics = Component.Physics(() => {
    return () => {
        return E.div.class(b())(
            E.h2('Физика'),
            RouteLink.href('physics/standard-model')(
                Button(
                    E.div.style(style({padding: '16px 64px'}))(
                        'Стандартная модель',
                        E.br,
                        E.span.style`font-size: 72px`('e', E.sup('–'))
                    )
                )
            )
        );
    }
});

export default Physics;
