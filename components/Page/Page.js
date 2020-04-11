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
    About,
    Projects,
    Unicode,
    Physics,
    StandardModel
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
    // 'my/:state': E.div(
    //     MyComponent.state(params.state),
    //     MyComponent.state('ok'),
    //     MyComponent.state('error'),
    //     E.ul(
    //         E.li`Поправить движок`,
    //         E.li`Меню для мобильной версии`,
    //         E.li`Таблица стандартной модели`,
    //         E.li`Игра Жизнь`,
    //         E.li`Светлая тема`,
    //         E.li`Формат электронной книги`,
    //         E.li`Калькулятор`,
    //         E.li`Построитель графиков`,
    //         E.li`Схема метро(позже интерактивная)`
    //     )
    // ),
    'gameOfLife': GameOfLife,
    'blog': Blog,
    'blog/:id': Post.id(params.id),
    'projects': Projects,
    'projects/unicode': Unicode,
    'physics': Physics,
    'physics/standard-model': StandardModel
})

const Menu = Component.Menu(({state}) => {
    const path = () => getRouterState(routes).path;
    state.init({i: 0});
    window.addEventListener('historyUpdate', () => state.set(prev => ({i: prev.i++})));
    function renderLink(href, title) {
        const current = path().startsWith(href) || path() === '/' && href === 'blog';
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
        renderLink('projects', 'Проекты'),
        renderLink('physics', 'Физика'),
        renderLink('design', 'Дизайн')
        // renderLink('gameOfLife', 'Игра Жизнь'),
        // renderLink('my/ok', 'тест')
    )
});

const Page = E.div.class(b())(
    // E.div.class(b('header-menu'))(
    //     E.div('Alexandr Nikolaichev'),
    //     E.div.class(b('scroll-top')).onClick(() => window.scrollTo({top: 0}))('▲ ▲ ▲')
    // ),
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
