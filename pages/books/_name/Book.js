import './Book.less';

import { Breadcrumbs, Page404, BookBox } from '../../../components';
import { Component, E, block } from '../../../utils';
import { Lang, Spin } from '../../../blocks';

<<<<<<< HEAD
import { DOM } from '../../../utils';
import { Icon } from '../../../icons';
=======
>>>>>>> master
import { booksList } from '../../../data/books';
import { createHtmlBook } from '@bookbox/preset-web';

const b = block('book');

const bookCache = new Map();

const Book = Component.Book(({ props, state, hooks }) => {
    state.init({
        bookData: null,
    });

    function setBook(bookData) {
        state.set({ bookData });
    }

    hooks.didMount(() => {
        const { name } = props();
        if (!booksList.hasOwnProperty(name)) return;

        if (bookCache.has(name)) {
            window.setTimeout(() => setBook(bookCache.get(name)), 100);
            return;
        } else {
            fetch(`/data/books/data/${name}/schema.json`).then(e => e.json()).then(value => {
                console.log({value});
                const bookData = createHtmlBook({schema: value});
                bookCache.set(name, bookData);
                setBook(bookData);
            })
        }
    });

    return () => {
        const { name } = props();
        if (!booksList.hasOwnProperty(name)) return Page404;
        const { bookData } = state();

        const { title } = booksList[name];

        return E.div.class(b())(
            Breadcrumbs.items([
                [Lang.token`menu/books`, 'books'],
                [title, `books/${name}`],
            ]),
            bookData === null && E.div.class(b('loading'))(Spin.size('xl')),
            bookData && BookBox.name(name).bookData(bookData)
        );
    };
});

export default Book;
