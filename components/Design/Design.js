import {
    block,
    E,
    cssImport,
    style,
    Component,
    RouteLink
} from '../../utils/index.js';

cssImport('components/Colors/Colors.less');

const b = block('design');

const Design = Component.Design(() => {
    return () => {
        return [
            E.h2('Дизайн'),
            RouteLink.href('design/colors')('Colors')
        ];
    }
});

export default Design;
