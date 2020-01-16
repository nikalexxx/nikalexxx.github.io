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

css(import.meta.url, 'Design.less');

const b = block('design');

const Design = Component.Design(() => {
    return () => {
        return E.div.class(b())(
            E.h2('Дизайн'),
            RouteLink.href('design/colors')(
                Button(
                    E.div.style(style({padding: '64px'}))('Цвета')
                )
            )
        );
    }
});

export default Design;
