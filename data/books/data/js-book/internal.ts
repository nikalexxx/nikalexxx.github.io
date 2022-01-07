import model from './model.js';

export default (api) => {
    const { header, book, code, image, draft, strong, em, audio, start, end, list, item, label } = api;

    return book`
${header.level(2)`Внутреннее устройство книги`}

Схематически устройство можно представить так

${image.src('/data/books/js-book/pipeline.svg').alt('BookBox pipeline')`Генератор > Модель > Представление`}

Начнём с модели

${model(api)}


${header.level(2)`Генератор`}
Генератор используется для динамического создания моделей.
`;
};
