import './App.less';

import {
    Component,
    E,
    RouteLink,
    Switch,
    block,
    getRouterState,
    style,
} from '../../utils/index.js';

import { Button } from '../../blocks/index.js';
import { Icon } from '../../icons/index.js';
import { routes } from '../routes';

const b = block('app');

const Menu = Component.Menu(({ state }) => {
    const path = () => getRouterState(routes).path;
    state.init({ i: 0 });
    window.addEventListener('historyUpdate', () =>
        state.set((prev) => ({ i: prev.i++ }))
    );
    function renderLink(href, title) {
        const current =
            typeof path() === 'string' &&
            (path().startsWith(href) || (path() === '/' && href === 'blog'));
        return RouteLink.href(href)(
            E.div.class(b('menu-link', { current })).onClick(() => {
                if (document.documentElement.clientWidth < 700) {
                    document.documentElement.classList.toggle('mobile-visible');
                }
            })(title)
        );
    }
    return () =>
        E.div(
            renderLink('blog', 'Блог'),
            renderLink('about', 'Кто я?'),
            renderLink('projects', 'Проекты'),
            renderLink('reports', 'Доклады'),
            renderLink('books', 'Книги'),
            renderLink('physics', 'Физика'),
            renderLink('design', 'Дизайн'),
            renderLink('travels', 'Путешествия'),
            renderLink('catalog', 'Каталог'),
            // renderLink('plans', 'Планы'),
            E.div.class(b('collapse-menu'))(
                Button.onClick(() => {
                    document.documentElement.classList.toggle('mobile-visible');
                })('свернуть меню')
            )
        );
});

const Header = Component.Header(({ state, hooks }) => {
    state.init({
        theme: 'dark',
    });

    hooks.didMount(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            state.set({ theme: savedTheme });
        }
        setTheme();
    });

    function setTheme() {
        const { theme } = state();
        localStorage.setItem('theme', theme);
        const classList = document.body.classList;
        if (theme === 'light') {
            classList.add('theme_light');
        } else {
            classList.remove('theme_light');
        }
        window.dispatchEvent(new CustomEvent('theme', { detail: { theme } }));
    }

    function toogleTheme() {
        state.set(
            (prevState) => ({
                theme: prevState.theme === 'dark' ? 'light' : 'dark',
            }),
            () => setTheme()
        );
    }

    function getIcon() {
        const { theme } = state();
        return {
            dark: () => E.div.style('width: 1em; height: 1em;')(Icon.Moon),
            light: () => E.div.style('width: 1em; height: 1em;')(Icon.Sun),
        }[theme]();
    }

    return () =>
        E.header.class(b('header'))(
            E.div.class(b('menu-toggle'))(
                Button.onClick(() => {
                    document.documentElement.classList.toggle('mobile-visible');
                })(E.div.style('width: 1em; height: 1em;')(Icon.Bars))
            ),
            RouteLink.href('/')(
                E.h1.style(style({ textAlign: 'center' }))(
                    'Александр Николаичев'
                )
            ),
            Button.onClick(toogleTheme)(getIcon())
        );
});

const Page = E.div.class(b())(
    // E.div.class(b('header-menu'))(
    //     E.div('Alexandr Nikolaichev'),
    //     E.div.class(b('scroll-top')).onClick(() => window.scrollTo({top: 0}))('▲ ▲ ▲')
    // ),
    Header,
    E.nav.class(b('menu'))(Menu),
    E.div
        .class(b('menu-close-area'))
        .onClick(() =>
            document.documentElement.classList.toggle('mobile-visible')
        ),
    E.main.class(b('content'))(Switch.routes(routes)),
    E.footer.class(b('footer'))(
        E.div('© 2019-2021 Alexandr Nikolaichev'),
        E.a.href('https://github.com/nikalexxx').target('_blank')('Github')
    )
);

export default Page;
