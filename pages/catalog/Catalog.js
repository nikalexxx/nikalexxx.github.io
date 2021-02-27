import './Catalog.less';

import { Component, E, block } from '../../utils';

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
                        image: '/favicon.ico',
                    },
                    vue: {
                        [link]: 'https://vuejs.org',
                        title: 'Vue',
                        image: '/images/icons/favicon-32x32.png',
                    },
                    angular: {
                        [link]: 'https://angular.io',
                        title: 'Angular',
                        image: '/assets/images/favicons/favicon.ico',
                    },
                    svelte: {
                        [link]: 'https://svelte.dev',
                        title: 'Svelte',
                        image: '/favicon.png',
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
                        image: '/favicon.ico',
                    },
                    'lit-element': {
                        [link]: 'https://lit-element.polymer-project.org',
                        title: 'Lit element',
                        image: '/images/favicon.png',
                    },
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
                    image: '/static/images/favicons/favicon-32x32.png',
                },
                safari: {
                    [link]: 'https://www.apple.com/ru/safari',
                    title: 'Safari',
                    image: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Safari_browser_logo.svg',
                },
                yandex: {
                    [link]: 'https://browser.yandex.ru',
                    title: 'Yandex Browser',
                    image: '/favicon.ico',
                },
                vivaldi: {
                    [link]: 'https://vivaldi.com/ru',
                    title: 'Vivaldi',
                    image: 'https://vivaldi.com/wp-content/uploads/cropped-favicon-32x32.png',
                },
                brave: {
                    [link]: 'https://brave.com',
                    title: 'Brave',
                    image: 'https://brave.com/static-assets/images/brave-favicon.png',
                },
                servo: {
                    [link]: 'https://servo.org',
                    title: 'Servo',
                    image: '/img/servo-symbol-color-no-container.png',
                }
            },
            [heap]: {
                mdn: {
                    [link]: 'https://developer.mozilla.org',
                    title: 'MDN',
                    image: '/favicon.ico',
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
                image: 'https://company.habr.com/images/favicon-32x32.png'
            },
            'smashing-magazine': {
                [link]: 'https://www.smashingmagazine.com/',
                title: 'Smashing magazine',
                image: '/images/favicon/favicon.png',
            },
            webdebblog: {
                [link]: 'https://webdevblog.ru/',
                title: 'Ещё один блог веб-разработчика',
                image: '/wp-content/uploads/2019/01/cropped-faviconka_ru_964-32x32.png',
            },
            'css-tricks': {
                [link]: 'https://css-tricks.com',
                title: 'CSS-Tricks',
                image: '/favicon.svg',
            }
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
                image: 'https://bureau.ru/assets/images/icons/favicon-32x32.png',
            },
        },
        [heap]: {
            git: {
                [link]: 'https://git-scm.com',
                title: 'Git',
                image: '/favicon.ico',
            },
            github: {
                [link]: 'https://github.com',
                title: 'Github',
            },
        },
    },
    [heap]: {
        arxiv: {
            [link]: 'https://arxiv.org',
            title: 'Arxiv',
            image: '/favicon.ico',
        },
        ium: {
            [link]: 'https://ium.mccme.ru',
            title: 'Независимый московский университет',
            image: '/favicon.ico',
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
                image = E.img.class(b('image')).src(src);
            }
            content = E.div.class(b('site'))(
                image,
                E.a.href(value[link]).title(key)(value.title || key)
            );
        } else {
            content = [
                E.div.title(key)(meta in value ? value[meta].title : key),
                renderTree(value),
            ];
        }
        return E.li(content);
    });
    if (heap in tree) {
        items.push(E.li('...', renderTree(tree[heap])));
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
