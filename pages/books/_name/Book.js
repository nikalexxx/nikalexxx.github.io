import './Book.less';

import { Breadcrumbs, Page404 } from '../../../components';
import { Button, Spin, Tooltip } from '../../../blocks';
import { Component, E, RouteLink, block } from '../../../utils';

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
            const id = DOM(title).textContent;
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
        Tooltip.text(headersContent)(E.div.class(b('control-button'))(Icon.List.width`30px`.height`30px`))
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
        Tooltip.text(imagesContent)(E.div.class(b('control-button'))(Icon.Image.width`30px`.height`30px`))
    );
});

const Book = Component.Book(({ props, state, hooks }) => {
    state.init({
        text: null,
        headersFlag: false,
    });

    hooks.didMount(() => {
        const { name } = props();
        if (!booksList.hasOwnProperty(name)) {
            return;
        }
        const path = `../data/books/${name}/index.js?r=${window.appVersion}`;
        import(path)
            .then((data) => {
                const book = createBook(data.default).to('html');
                state.set({ text: book }, () => {
                    const hash = window.location.hash;
                    if (hash) {
                        const id = decodeURIComponent(hash.slice(1));
                        const header = document.getElementById(id);
                        if (header) {
                            header.scrollIntoView();
                        }
                    }
                });
            })
            .catch((e) => {
                console.error(e);
                state.set({ text: 'Ошибка загрузки контента' });
            });
    });

    function onRenderBook(e) {
        // console.dir('book', e);
    }

    function updateHeaders() {
        state.set((prev) => ({ headersFlag: !prev.headersFlag }));
    }

    return () => {
        const { name, elem } = props();
        if (!booksList.hasOwnProperty(name)) {
            return Page404;
        }
        const { text } = state();
        console.log({text});
        const { title, authors } = booksList[name];

        return E.div.class(b())(
            Breadcrumbs.items([
                ['Книги', 'books'],
                [title, `books/${name}`],
            ]),
            E.div(
                E.div(
                    text?.images && BookImages.images(text.images),
                    text?.headers &&
                        BookHeaders.headers(text?.headers).update(updateHeaders)
                ),
                text === null
                    ? E.div.class(b('loading'))(Spin.size('xl'))
                    : E.div.class(b('container'))(
                          E.div
                              ._ref((e) => onRenderBook(e))
                              .class(b('content'))(text)
                      )
            )
        );
    };
});

export default Book;
