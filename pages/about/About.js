import './About.less';

import {
    E,
    block,
} from '../../utils';

const b = block('about');

const about = E.div.class(b())(
    E.p('Программирую'),
    E.p(E`Работаю в ${E.a.href('https://yandex.ru')('Яндексе')}`),
    E.p('Люблю математику'),
    E.p(E`Мой ${E.a.href('https://github.com/nikalexxx')('Github')}`)
);

export default about;
