import "./Book.less";

import { Breadcrumbs, Page404, BookBox } from "../../../components";
import { block } from "../../../utils";
import { Lang, Spin } from "../../../blocks";

import { booksList } from "../../../data/books";
import { createHtmlBook } from "@bookbox/preset-web";
import { Component } from "parvis";
import { BookData } from "@bookbox/core";

const b = block("book");

function isExistBook(name: string): name is keyof typeof booksList {
    return booksList.hasOwnProperty(name);
}
const bookCache = new Map();

const Book = Component<{ name: string }>("Book", ({ props, state, hooks }) => {
    const [getBook, setBook] = state<null | BookData<string>>(null);

    hooks.mount(() => {
        const { name } = props();
        if (!booksList.hasOwnProperty(name)) return;

        if (bookCache.has(name)) {
            window.setTimeout(() => setBook(bookCache.get(name)), 100);
            return;
        } else {
            fetch(`/data/books/data/${name}/schema.json`)
                .then((e) => e.json())
                .then((value) => {
                    const bookData = createHtmlBook({ schema: value });
                    // console.log({ value, bookData });
                    bookCache.set(name, bookData);
                    setBook(bookData);
                });
        }
    });

    return () => {
        const { name } = props();
        if (!isExistBook(name)) return <Page404 />;
        const bookData = getBook();

        const { title } = booksList[name];

        return (
            <div class={b()}>
                <Breadcrumbs
                    items={[
                        [<Lang token={`menu/books`} />, "books"],
                        [title, `books/${name}`],
                    ]}
                />
                {bookData === null && (
                    <div class={b("loading")}>
                        <Spin size={"xl"} />
                    </div>
                )}
                {bookData && <BookBox name={name} bookData={bookData} />}
            </div>
        );
    };
});

export default Book;
