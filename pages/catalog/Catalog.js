import './Catalog.less';

import { Component, E, block } from '../../utils';

import { Collapse } from '../../blocks';

const b = block('catalog');

const meta = Symbol('meta');
const heap = Symbol('heap');
const link = Symbol('link');

const links = {
    programming: {
        frontend: {
            rendering: {
                libs: {
                    [meta]: {
                        title: 'Фрейворки и библиотеки',
                    },
                    react: {
                        [link]: 'https://reactjs.org',
                        title: 'React',
                        image: 'https://reactjs.org/favicon.ico',
                    },
                    vue: {
                        [link]: 'https://vuejs.org',
                        title: 'Vue',
                        image:
                            'https://vuejs.org/images/icons/favicon-32x32.png',
                    },
                    angular: {
                        [link]: 'https://angular.io',
                        title: 'Angular',
                        image:
                            'https://angular.io/assets/images/favicons/favicon.ico',
                    },
                    svelte: {
                        [link]: 'https://svelte.dev',
                        title: 'Svelte',
                        image: 'https://svelte.dev/favicon.png',
                    },
                    marko: {
                        [link]: 'https://markojs.com',
                        title: 'Marko',
                        image:
                            'https://raw.githubusercontent.com/marko-js/branding/master/marko.svg',
                    },
                    inferno: {
                        [link]: 'https://infernojs.org',
                        title: 'Inferno',
                        image: 'https://infernojs.org/favicon.ico',
                    },
                    'lit-element': {
                        [link]: 'https://lit-element.polymer-project.org',
                        title: 'Lit element',
                        image:
                            'https://lit-element.polymer-project.org/images/favicon.png',
                    },
                },
            },
            stateManagers: {
                [meta]: {
                    title: 'Менеджеры состояния',
                },
                libs: {
                    [meta]: {
                        title: 'Библиотеки',
                    },
                    redux: {
                        [link]: 'https://redux.js.org',
                        title: 'Redux',
                        image: 'https://redux.js.org/img/favicon/favicon.ico',
                    },
                    mobx: {
                        [link]: 'https://mobx.js.org',
                        title: 'MobX',
                        image: 'https://mobx.js.org/img/favicon.png',
                    },
                    effector: {
                        [link]: 'https://effector.dev',
                        title: 'Effector',
                        image: 'https://effector.dev/img/favicon.ico',
                    },
                    reatom: {
                        [link]: 'https://reatom.js.org',
                        title: 'Reatom',
                        image: 'https://reatom.js.org/logos/logo-icon.png',
                    },
                },
            },
            languages: {
                [meta]: {
                    title: 'Языки, транслируемые в javascript',
                },
                typescript: {
                    [link]: 'https://www.typescriptlang.org',
                    title: 'TypeScript',
                    image: 'https://www.typescriptlang.org/favicon.ico',
                },
                elm: {
                    [link]: 'https://elm-lang.org',
                    title: 'Elm',
                    image: 'https://elm-lang.org/favicon.ico',
                },
                reasonML: {
                    [link]: 'https://reasonml.github.io/ru',
                    title: 'ReasonML',
                    image: 'https://reasonml.github.io/img/icon_50.png',
                },
            },
            browsers: {
                [meta]: {
                    title: 'Браузеры',
                },
                firefox: {
                    [link]: 'https://www.mozilla.org/ru/firefox/new/',
                    title: 'Firefox',
                    image: '//assets/images/logo/firefox.svg',
                },
                chrome: {
                    [link]: 'https://www.google.ru/chrome',
                    title: 'Google Chrome',
                    image:
                        'https://www.google.ru/chrome/static/images/favicons/favicon-32x32.png',
                },
                safari: {
                    [link]: 'https://www.apple.com/ru/safari',
                    title: 'Safari',
                    image:
                        'https://upload.wikimedia.org/wikipedia/commons/5/52/Safari_browser_logo.svg',
                },
                yandex: {
                    [link]: 'https://browser.yandex.ru',
                    title: 'Yandex Browser',
                    image: 'https://browser.yandex.ru/favicon.ico',
                },
                vivaldi: {
                    [link]: 'https://vivaldi.com/ru',
                    title: 'Vivaldi',
                    image:
                        'https://vivaldi.com/wp-content/uploads/cropped-favicon-32x32.png',
                },
                brave: {
                    [link]: 'https://brave.com',
                    title: 'Brave',
                    image:
                        'https://brave.com/static-assets/images/brave-favicon.png',
                },
                servo: {
                    [link]: 'https://servo.org',
                    title: 'Servo',
                    image:
                        'https://servo.org/img/servo-symbol-color-no-container.png',
                },
            },
            [heap]: {
                mdn: {
                    [link]: 'https://developer.mozilla.org',
                    title: 'MDN',
                    image: 'https://developer.mozilla.org/favicon.ico',
                },
            },
        },
        'blog-platform': {
            [meta]: {
                title: 'Статьи и блоги',
            },
            habr: {
                [link]: 'https://habr.com',
                title: 'Хабр',
                image: 'https://company.habr.com/images/favicon-32x32.png',
            },
            'smashing-magazine': {
                [link]: 'https://www.smashingmagazine.com',
                title: 'Smashing magazine',
                image:
                    'https://www.smashingmagazine.com/images/favicon/favicon.png',
            },
            webdebblog: {
                [link]: 'https://webdevblog.ru',
                title: 'Ещё один блог веб-разработчика',
                image:
                    'https://webdevblog.ru/wp-content/uploads/2019/01/cropped-faviconka_ru_964-32x32.png',
            },
            'css-tricks': {
                [link]: 'https://css-tricks.com',
                title: 'CSS-Tricks',
                image: 'https://css-tricks.com/favicon.svg',
            },
        },
        'book-format': {
            [meta]: {
                title: 'Форматы книг и документации',
            },
            pollen: {
                [link]: 'https://docs.racket-lang.org/pollen',
                title: 'Pollen',
                image: 'https://docs.racket-lang.org/favicon.ico',
            },
            docsify: {
                [link]: 'https://docsify.js.org',
                title: 'Docsify',
                image: 'https://docsify.js.org/_media/favicon.ico',
            },
            bureau: {
                [link]: 'https://bureau.ru/books/manifesto/',
                title: 'Книги бюро Горбунова',
                image:
                    'https://bureau.ru/assets/images/icons/favicon-32x32.png',
            },
        },
        [heap]: {
            git: {
                [link]: 'https://git-scm.com',
                title: 'Git',
                image: 'https://git-scm.com/favicon.ico',
            },
            github: {
                [link]: 'https://github.com',
                title: 'Github',
                image: 'https://github.com/favicon.ico',
            },
        },
    },
    [heap]: {
        arxiv: {
            [link]: 'https://arxiv.org',
            title: 'Arxiv',
            image: 'https://arxiv.org/favicon.ico',
        },
        ium: {
            [link]: 'https://ium.mccme.ru',
            title: 'Независимый московский университет',
            image: 'https://ium.mccme.ru/favicon.ico',
        },
    },
};


function renderTree(tree, topLevel = false) {
    const items = Object.keys(tree).map((key) => {
        const value = tree[key];
        let content;
        if (link in value) {
            let image = null;
            if ('image' in value) {
                let src;
                if (value.image.startsWith('//')) {
                    src = value.image.slice(1);
                } else if (value.image.startsWith('/')) {
                    src = `${value[link]}${value.image}`;
                } else {
                    src = value.image;
                }
                image = E.img
                    .class(b('image'))
                    .src(src)
                    .alt(value.title || key)
                    .loading('lazy');
            }
            content = E.div.class(b('site'))(
                image,
                E.a.href(value[link]).title(key)['data-clear-link'](true)(
                    value.title || key
                )
            );
        } else {
            content = Collapse.title(
                E.div.title(key)(meta in value ? value[meta].title : key)
            )(renderTree(value));
        }
        return E.li(content);
    });
    if (heap in tree) {
        items.push(E.li(Collapse.title('...')(renderTree(tree[heap]))));
    }
    return E.ul.style(topLevel ? 'border: none' : '')(items);
}

export const Catalog = Component.Catalog(() => {
    return () => {
        return E.div.class(b())(
            E.h2('Каталог'),
            E.p(
                'Полезные ссылки. При доступной локализации выбран русский язык.'
            ),
            renderTree(links, true)
        );
    };
});
