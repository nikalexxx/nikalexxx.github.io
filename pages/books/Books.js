import './Books.less';

import { Component, E, RouteLink, block } from '../../utils';
import { PageGrid, Tile } from '../../components';

import { booksList } from '../../data/books';
import { Lang } from '../../blocks';

const b = block('books');

const Books = Component.Books(() => {
    return () => {
        return E.div.class(b())(
            E.h2(Lang.token`menu/books`),
            PageGrid(
                Object.keys(booksList).map((name) => {
                    const { title, authors, image } = booksList[name];
                    return RouteLink.href(`books/${name}`)(
                        Tile(
                            E.div.class(b('tile'))(
                                E.img.src(image).width`100%`,
                                E.h3(title),
                                authors.map((author, i) => [
                                    i > 0 && ', ',
                                    E.i(author),
                                ]),
                            )
                        )
                    );
                })
            )
        );
    };
});

export default Books;
