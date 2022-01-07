// / <reference path="../../../../services/book/model.ts" />
// import { Book } from "../../../../services/book/model";
import internal from './internal.js';

export default (api) => {
    const { book, header, code, tooltip, link, strong, em, image, authors, title } = api;

    return book.root`
${image.src('/data/books/js-book/logo.svg').alt('BookBox logo')``}
${title`Книжный формат BookBox`}
${authors`Александр Николаичев`}


${header.level(2)`Описание`}

Формат BookBox создан для представления книг и другого текстового контента на экранах переменной ширины.
Данное описание формата реализовано на нём самом.


Основная среда для показа — Веб.
Соответственно основные представления — ${strong`html`} и элементы для веб-фрейворков.
Представление элементов книги без обработки — json представление, отражает структуру книги (AST) и подходит для хранения и передачи по сети.


Среди доступных представлений: Markdown и простой текст.
Вы можете создать своё представление, написав конвертор (об этом ниже).


${internal(api)}


${header.level(2)`Форматирование текста`}

${strong`выделение`}, ${em`акцент`}, ${code`машинопись`}
${tooltip.content('содержимое подсказки')`подсказка`}

`;
};
