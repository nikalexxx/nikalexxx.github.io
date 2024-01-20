import "./Books.less";

import { RouteLink, block } from "../../utils";
import { PageGrid, Tile } from "../../components";

import { booksList } from "../../data/books";
import { Lang } from "../../blocks";
import { Component } from "parvis";

type BookName = keyof typeof booksList;

const b = block("books");

const Books = Component("Books", () => {
    return () => {
        return (
            <div class={b()}>
                <h2>
                    <Lang token={`menu/books`} />
                </h2>
                <PageGrid>
                    {(Object.keys(booksList) as BookName[]).map((name) => {
                        const { title, authors, image } = booksList[name];
                        return (
                            <RouteLink href={`books/${name}`}>
                                <Tile>
                                    <div class={b("tile")}>
                                        <img
                                            src={image}
                                            style={`width: 100%`}
                                        />
                                        <h3>{title}</h3>
                                        {authors.map((author, i) => [
                                            i > 0 && ", ",
                                            <i>{author}</i>,
                                        ])}
                                    </div>
                                </Tile>
                            </RouteLink>
                        );
                    })}
                </PageGrid>
            </div>
        );
    };
});

export default Books;
