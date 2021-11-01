import './App.less';
import '../../services/langs/map';

import { Button, Select } from '../../blocks/index.js';
import {
    Component,
    E,
    RouteLink,
    Switch,
    block,
    getRouterState,
    style,
} from '../../utils';
import { defaultLang, setLang } from '../../services/langs/model';

import { Icon } from '../../icons/index.js';
import { Lang } from '../../blocks/LangToken/LangToken';
import { routes } from '../routes';

const b = block('app');

setLang(localStorage.getItem('lang') || defaultLang);

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
            renderLink('blog', Lang.token`menu/blog`),
            renderLink('about', Lang.token`menu/about`),
            renderLink('projects', Lang.token`menu/projects`),
            renderLink('reports', Lang.token`menu/reports`),
            renderLink('books', Lang.token`menu/books`),
            renderLink('physics', Lang.token`menu/physics`),
            renderLink('design', Lang.token`menu/design`),
            renderLink('travels', Lang.token`menu/travels`),
            renderLink('catalog', Lang.token`menu/catalog`),
            // renderLink('plans', 'Планы'),
            E.div.class(b('collapse-menu'))(
                Button.onClick(() => {
                    document.documentElement.classList.toggle('mobile-visible');
                })(Lang.token`control/collapse-menu`)
            )
        );
});

const Header = Component.Header(({ state, hooks }) => {
    state.init({
        theme: localStorage.getItem('theme') || 'dark',
        lang: localStorage.getItem('lang') || defaultLang,
    });

    hooks.didMount(() => {
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

    function setLanguage() {
        const { lang } = state();
        localStorage.setItem('lang', lang);
        setLang(lang);
        window.dispatchEvent(new CustomEvent('update-lang'));
    }

    function toogleTheme() {
        state.set(
            (prevState) => ({
                theme: prevState.theme === 'dark' ? 'light' : 'dark',
            }),
            () => setTheme()
        );
    }

    function toogleLanguage(lang) {
        state.set({ lang }, () => setLanguage());
    }

    function getIcon() {
        const { theme } = state();
        return {
            dark: () => E.div.style('width: 1em; height: 1em;')(Icon.Moon),
            light: () => E.div.style('width: 1em; height: 1em;')(Icon.Sun),
        }[theme]();
    }

    return () => {
        const { lang } = state();
        return E.header.class(b('header'))(
            E.div.class(b('menu-toggle'))(
                Button.onClick(() => {
                    document.documentElement.classList.toggle('mobile-visible');
                })(E.div.style('width: 1em; height: 1em;')(Icon.Bars))
            ),
            RouteLink.href('/')(
                E.h1.style(style({ textAlign: 'center' }))(Lang.token`title`)
            ),
            Button.onClick(toogleTheme)(getIcon()),
            Select.className(b('lang')).values(
                [
                    { value: 'ru', title: E.span('🇷🇺RU') },
                    { value: 'en', title: E.span('🇬🇧EN') },
                ].map((e) => {
                    if (e.value === lang) {
                        e.selected = true;
                    }
                    return e;
                })
            ).onChange((e) => toogleLanguage(e.target.value))
        );
    };
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
