import './Book.less';

import { Breadcrumbs, Page404 } from '../../../components';
import { Component, E, block } from '../../../utils';
import { Lang, Spin, Tooltip } from '../../../blocks';

import { DOM } from '../../../utils/element';
import { Icon } from '../../../icons';
import { booksList } from '../../../data/books';
import { createBook } from '../../../services/book/book.js';

const b = block('book');

function highlightElement(element) {
    const activeClass = b('active');

    element.classList.add(activeClass);
    setTimeout(() => element.classList.remove(activeClass), 2000);
}

const BookHeaders = Component.BookHeaders(({ props }) => () => {
    const { headers, update } = props();
    const headersContent = E.div.class(b('headers'))(
        headers.map(([level, title]) => {
            const id = DOM(title).textContent.trim();
            let current = false;
            const hash = window.location.hash;
            if (hash) {
                const hashId = decodeURIComponent(hash.slice(1));
                if (hashId === id) {
                    current = true;
                }
            }
            return E.div.class(b('header-link', { current }))([
                ...[...Array(Number(level) - 1).keys()].map(() => ' . '),
                E.a.href(`#${encodeURIComponent(id)}`).onClick((e) => {
                    e.preventDefault();
                    document
                        .querySelector(`div.${b('headers-container')}`)
                        .click();

                    history.pushState(
                        {},
                        '',
                        location.search + `#${encodeURIComponent(id)}`
                    );
                    const header = document.getElementById(id);
                    if (header) {
                        header.scrollIntoView();
                        highlightElement(header);
                    }
                    update();
                })(id),
            ]);
        })
    );
    return E.div.class(b('headers-container', {}, b('control-container')))(
        Tooltip.text(headersContent)(
            E.div.class(b('control-button'))(Icon.List.width`30px`.height`30px`)
        )
    );
});

const BookImages = Component.BookImages(({ props }) => () => {
    const { images } = props();
    const imagesContent = E.div.class(b('images'))(
        [...images.keys()].map((key) => {
            return E.div.class(b('image')).onClick(() => {
                document.querySelector(`div.${b('images-container')}`).click();
                const imageElement = Array.from(
                    document.querySelectorAll(`[data-image="${key}"]`)
                ).filter((e) => !e.closest('.tooltip'))[0];
                if (imageElement) {
                    imageElement.scrollIntoView();
                    highlightElement(imageElement);
                }
            })(images.get(key));
        })
    );
    return E.div.class(b('images-container', {}, b('control-container')))(
        Tooltip.text(imagesContent)(
            E.div.class(b('control-button'))(
                Icon.Image.width`30px`.height`30px`
            )
        )
    );
});

const recursiveFlat = (list) =>
    list.map((e) => (Array.isArray(e) ? recursiveFlat(e) : e)).flat();

const bookCache = new Map();

const Book = Component.Book(({ props, state, hooks }) => {
    state.init({
        text: null,
        headersFlag: false,
    });

    function toHeader() {
        const hash = window.location.hash;
        if (hash) {
            const id = decodeURIComponent(hash.slice(1));
            const header = document.getElementById(id);
            if (header) {
                header.scrollIntoView();
            }
        }
    }

    function setBook(book) {
        state.set({ text: book }, toHeader);
    }

    hooks.didMount(() => {
        const { name } = props();
        if (!booksList.hasOwnProperty(name)) {
            return;
        }
        if (bookCache.has(name)) {
            window.setTimeout(() => setBook(bookCache.get(name)), 300);
            return;
        }
        const path = `../data/books/${name}/index.js?r=${window.appVersion}`;
        import(path)
            .then((data) => {
                const book = createBook(data.default).to('html');
                bookCache.set(name, book);
                setBook(book);
            })
            .catch((e) => {
                console.error(e);
                state.set({ text: 'Ошибка загрузки контента' });
            });
    });

    function updateHeaders() {
        state.set((prev) => ({ headersFlag: !prev.headersFlag }));
    }

    return () => {
        const { name } = props();
        if (!booksList.hasOwnProperty(name)) {
            return Page404;
        }
        const { text } = state();
        console.log({ text });
        const { title } = booksList[name];

        return E.div.class(b())(
            Breadcrumbs.items([
                [Lang.token`menu/books`, 'books'],
                [title, `books/${name}`],
            ]),
            E.div(
                BookImages.images(text?.images ?? new Map()),
                BookHeaders.headers(text?.headers ?? []).update(updateHeaders)
            ),
            E.div(text === null && E.div.class(b('loading'))(Spin.size('xl'))),
            E.div.class(b('container'))(E.div.class(b('content'))(text))
        );
    };
});

export default Book;
