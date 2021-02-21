export default api => {
    const {text, book} = api;
    const {a, code} = text;
return book`
Сайт написан мной с нуля.


Полностью статический.


Хостинг ${a.href('https://pages.github.com/')('Github Pages')}.


Все данные хранятся как исходный код.
Репозиторий на Github ${a.href('https://github.com/nikalexxx/nikalexxx.github.io')('здесь')}.


Использую последние возможности ${code('javascript')}, поддержкой для старых браузеров пока не занимался.


Буду писать о преимущественно о программировании, но не только..
`;
}
