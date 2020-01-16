import {
    E,
    Component,
    RouteLink,
    css,
    block,
    style
} from '../../utils/index.js';
import {Button} from '../../blocks/index.js';

css(import.meta.url, 'About.less');

const b = block('about');

const about = E.div.class(b())(
    E.p('Программирую'),
    E.p(E`Работаю в ${E.a.href('https://yandex.ru')('Яндексе')}`),
    E.p('Люблю математику'),
    E.p(E`Мой ${E.a.href('https://github.com/nikalexxx')('Github')}`)
);

export default about;
