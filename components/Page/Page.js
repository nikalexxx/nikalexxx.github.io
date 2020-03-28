import {
    E,
    M,
    Component,
    RouteLink,
    getRouterState,
    Switch,
    css,
    block,
    style
} from '../../utils/index.js';
import {
    Colors,
    GameOfLife,
    Design,
    Blog,
    Post,
    About
} from '../index.js';
import {Button} from '../../blocks/index.js'
import MyComponent from '../../MyComponent.js';
import map from '../../map.js';
import {book} from '../../utils/book.js';

import './Page.less';

const b = block('page');

const routes = params => ({
    '/': Blog,
    'about': About,
    'book': E.div(book),
    'design': Design,
    'design/colors': Colors,
    'my/:state': E.div(
        MyComponent.state(params.state),
        MyComponent.state('ok'),
        MyComponent.state('error'),
    ),
    'gameOfLife': GameOfLife,
    'blog': Blog,
    'blog/:id': Post.id(params.id)
})

const Menu = Component.Menu(({setState, initState}) => {
    const path = () => getRouterState(routes).path;
    initState({i: 0});
    window.addEventListener('historyUpdate', () => setState(prev => ({i: prev.i++})));
    function renderLink(href, title) {
        const current = href === path();
        // console.log(href, path());
        return RouteLink.href(href)(
            E.div.class(b('menu-link', {current}))(
                title
            )
        );
    }
    return () => E.div(
        renderLink('blog', 'Блог'),
        renderLink('about', 'Кто я?'),
        // renderLink('book', 'Книга'),
        renderLink('design', 'Дизайн'),
        // renderLink('gameOfLife', 'Игра Жизнь'),
        // renderLink('my/ok', 'тест')
    )
});

const Page = E.div.class(b())(
    E.div.class(b('header-menu'))(
        E.div('Alexandr Nikolaichev'),
        E.div.class(b('scroll-top')).onClick(() => window.scrollTo({top: 0}))('▲ ▲ ▲')
    ),
    E.header.class(b('header'))(
        RouteLink.href('/')(
            E.h1.style(style({textAlign: 'center'}))('Александр Николаичев')
        )
    ),
    E.nav.class(b('menu'))(Menu),
    E.main.class(b('content'))(Switch.routes(routes)),
    E.footer.class(b('footer'))('© 2019-2020 Alexandr Nikolaichev')
);

export default Page;
