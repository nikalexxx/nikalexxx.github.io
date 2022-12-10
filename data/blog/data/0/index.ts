import type { BookApi } from "@bookbox/preset-web";

export default (api: BookApi) => {
    const { book, link, code, format: {pre}} = api;
return book`
Сайт написан мной с нуля.


Полностью статический.


Хостинг ${link.href('https://pages.github.com/')('Github Pages')}.


Все данные хранятся как исходный код.
Репозиторий на Github ${link.href('https://github.com/nikalexxx/nikalexxx.github.io')('здесь')}.


Использую последние возможности ${pre`javascript`}, поддержкой для старых браузеров пока не занимался.


Буду писать о преимущественно о программировании, но не только..
`;
}
