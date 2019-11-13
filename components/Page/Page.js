import {
    E,
    M,
    Component,
    RouteLink,
    getRouterState,
    Switch,
    cssImport,
    block,
    style
} from '../../utils/index.js';
import {
    Colors,
    GameOfLife,
    Design
} from '../index.js';
import MyComponent from '../../MyComponent.js';
import map from '../../map.js';

cssImport('components/Page/Page.less');

const b = block('page');

const routes = (params) => ({
    '/': about,
    'design': Design,
    'design/colors': Colors,
    'my/:state': E.div(
        MyComponent.state(params.state),
        MyComponent.state('ok'),
        MyComponent.state('error'),
    ),
    'gameOfLife': GameOfLife
})

const Menu = Component.Menu(() => {
    const path = getRouterState(routes).path;
    function renderLink(href, title) {
        const current = href === path && false;;
        return E.div.class(current ? b('current') : '')(
            RouteLink.href(href)(
                title
            )
        );
    }
    return () => E.div(
        renderLink('/', 'Кто я?'),
        renderLink('design', 'Дизайн')
    )
});

const about = E.div.style(style({textAlign: 'center'}))(
    E.p('Программирую'),
    E.p(
        'Работаю в ',
        E.a.href('https://yandex.ru')(
            'Яндексе'
        )
    ),
    E.p(
        'Люблю математику',
    ),
    E.p(
        'Мой ',
        E.a.href('https://github.com/nikalexxx')('Github')
    )
);

const Content = Switch.routes(routes);

const Page = E.div.class(b())(
    E.header.class(b('header'))(
        E.div.class(b('header-content'))(
            RouteLink.href('/')(
                E.h1.style(style({textAlign: 'center'}))('Александр Николаичев')
            )
        ),
        E.div.class(b('header-shadow'))
    ),
    E.nav.class(b('menu'))(
        Menu
    ),
    E.main.class(b('content'))(
        Content
    ),
    E.footer.class(b('footer'))(
        'Copyright 2019 Alexandr Nikolaichev'
    )
);

export default Page;
