import { Book } from './model';

const bookGiudeRu: Book = (api) => {
    const { book, header } = api;

    return book.root`
${header.level(1)`Книжный формат JSBook`}


`;
};
