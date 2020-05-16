import {
    E,
    M,
    Component,
    RouteLink,
    getRouterState,
    Switch,
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
import {Button} from '../../blocks/index.js';
import {Icon} from '../../icons/index.js';
import MyComponent from '../../MyComponent.js';
import map from '../../map.js';
import {book} from '../../utils/book.js';

import './App.less';

const b = block('app');

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
    //         E.li`Формат электронной книги`,
    //         E.li`Калькулятор`,
    //         E.li`Построитель графиков`,
    //         E.li`Схема метро(позже интерактивная)`
    //     )
    // ),
    'blog': Blog,
    'blog/:id': Post.id(params.id),
    'projects': Projects,
    'projects/unicode': Unicode,
    'projects/game-of-life': GameOfLife,
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
            E.div.class(b('menu-link', {current})).onClick(() => {
                if (document.documentElement.clientWidth < 700) {
                    document.documentElement.classList.toggle('mobile-visible');
                }
            })(
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
        renderLink('design', 'Дизайн'),
        // renderLink('gameOfLife', 'Игра Жизнь'),
        // renderLink('my/ok', 'тест'),
        E.div.class(b('collapse-menu'))(Button.onClick(() => {
            document.documentElement.classList.toggle('mobile-visible');
        })('свернуть меню')),
    )
});

const Header = Component.Header(({state, hooks}) => {
    state.init({
        theme: 'dark'
    });

    hooks.didMount(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            state.set({theme: savedTheme});
        }
        setTheme();
    });

    function setTheme() {
        const {theme} = state();
        localStorage.setItem('theme', theme);
        const classList = document.body.classList;
        if (theme === 'light') {
            classList.add('theme_light');
        } else {
            classList.remove('theme_light');
        }
        window.dispatchEvent(new CustomEvent('theme', {detail: {theme}}));
    }

    function toogleTheme() {
        state.set(prevState => ({
            theme: prevState.theme === 'dark' ? 'light' : 'dark'
        }), () => setTheme());
    }

    function getIcon() {
        const {theme} = state();
        return {
            dark: () => E.div.style('width: 1em; height: 1em;')(Icon.Moon),
            light: () => E.div.style('width: 1em; height: 1em;')(Icon.Sun)
        }[theme]();
    }

    return () => E.header.class(b('header'))(
        E.div.class(b('menu-toggle'))(
            Button.onClick(() => {
                document.documentElement.classList.toggle('mobile-visible');
            })(E.div.style('width: 1em; height: 1em;')(Icon.Bars))
        ),
        RouteLink.href('/')(
            E.h1.style(style({textAlign: 'center'}))('Александр Николаичев')
        ),
        Button.onClick(toogleTheme)(getIcon())
    );
})

const Page = E.div.class(b())(
    // E.div.class(b('header-menu'))(
    //     E.div('Alexandr Nikolaichev'),
    //     E.div.class(b('scroll-top')).onClick(() => window.scrollTo({top: 0}))('▲ ▲ ▲')
    // ),
    Header,
    E.nav.class(b('menu'))(Menu),
    E.div.class(b('menu-close-area')).onClick(() => document.documentElement.classList.toggle('mobile-visible')),
    E.main.class(b('content'))(Switch.routes(routes)),
    E.footer.class(b('footer'))('© 2019-2020 Alexandr Nikolaichev')
);

export default Page;
