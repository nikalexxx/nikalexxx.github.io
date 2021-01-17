import './Books.less';

import { Component, E, RouteLink, block } from '../../utils';
import { PageGrid, Tile } from '../../components';

import { booksList } from '../../data/books';

const b = block('books');

const Books = Component.Books(() => {
    return () => {
        return E.div.class(b())(
            E.h2('Книги'),
            PageGrid(
                Object.keys(booksList).map((name) => {
                    const { title, authors } = booksList[name];
                    return RouteLink.href(`books/${name}`)(
                        Tile(
                            E.h3(title),
                            authors.map((author, i) => [
                                i > 0 && ', ',
                                E.i(author),
                            ])
                        )
                    );
                }),
            )
        );
    };
});

export default Books;
