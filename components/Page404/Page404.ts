import './Page404.less';

import { Component, E, RouteLink, block } from '../../utils';

const b = block('page-404');

export const Page404 = Component.Page404(() => () =>
    E.div.class(b())(
        E.div(
            E.div.class(b('header'))('404'),
            E.p(E`Страница ${E.i(document.location.href)} не найдена`),
            E.br,
            E.p(RouteLink.href('/')('На главную страницу'))
        )
    )
);
