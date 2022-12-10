export default (api) => {
    const { book, text, block, control, math, use } = api;
    const { ul, li, pre, area, img } = block;
    const { start, end } = control;
    const { h, i, b, a, link, label, code } = text;
    const { $, $$ } = math;
    return book.root`
Книга опубликована ${a.href('/?/books/vereshagin-shen-sets')`здесь`}.
Исходный код на гитхабе ${a.href('https://github.com/nikalexxx/nikalexxx.github.io/tree/master/data/books/data/vereshagin-shen-sets')`здесь`}


${area.key('2')`
После первых попыток переизобрести формат электронной книги я решил взять настоящую книгу и перевести её в новый формат, чтобы показать особенности и преимущества.
`}


${area.key('3')`
Была выбрана книга «Начала теории множеств» из серии «ЛЕКЦИИ ПО МАТЕМАТИЧЕСКОЙ ЛОГИКЕ И ТЕОРИИ АЛГОРИТМОВ».
Во-первых, она мне нравится, во-вторых, она показывает преимущества формата — есть много ссылок как на предыдущие части текста, так и на последующие (теоремы, задачи, имена математиков), есть формулы и картинки.
`}


Первую статью о формате электронной книги можно почитать ${a.href('/?/blog/9')`здесь`}.
Там общие идеи и краткое описание формата.


${h(3)`Ссылки`}
Ссылки в книге бывают трёх видов:
${start(ul)}
${start(li)}
Гиперссылки — внешние ссылки, ведут на другие документы или сайты.
${pre`
a.href('https://wikipedia.org')\`википедия\`
`}
${a.href('https://wikipedia.org')`википедия`}
${end(li)}
${start(li)}
Внутренние ссылки, по которым можно перейти в другие части книги.
${pre`
link.ref('2')\`второй абзац\`
`}
${link.ref('2')`второй абзац`}
${end(li)}
${start(li)}
Внутренние ссылки на другие области, при использовании создаётся лейбл, при нажатии на который можно посмотреть выделенную область из другой части книги, и при необходимости перейти к ней.
${pre`
label.ref('3')\`третий абзац\`
`}
${label.ref('3')`третий абзац`}
${end(li)}
${end(ul)}

${h(3)`Формулы`}
Для набора математических формул я использовал библиотеку ${a.href('https://katex.org/')`katex`} для формата ${code`tex`}.
Есть формулы встроенные и блочные.
Для формул завел отдельное пространство имён ${code`math`}.
${pre`
const { $, $$ } = api.math;
`}

${h(4)`Инлайновая формула`}
${pre`
Знает \${i\`каждый\`} космонавт — \${$\`E = mc^2\`}
`}
Знает ${i`каждый`} космонавт — ${$`E = mc^2`}


${h(4)`Блочная формула`}
${pre`
\$$\`
\\\\int_{0}^{+\\\\infin} e^{-x^2} = \\\\frac{\\\\sqrt{\\\\pi}}{2}
\`
`}
${$$`
\\int_{0}^{+\\infin} e^{-x^2} = \\frac{\\sqrt{\\pi}}{2}
`}


${h(3)`Автоматическая нумерация`}
Эту фишку я подсмотрел из texa.
В самом деле, ни одна достаточно большая техническая книга не обходится без нумерации.
Самый банальный пример — главы.


Реализована нумерация пока на уровне сборки исходников за счет использования замыканий в javascript.
Основная идея проста: последовательные объекты и в коде записываются последовательно.
Таким образом каждый вызов элемента параграфа использует текущее значение счетчика параграфов и увеличивает его на единицу.
Считать таким образом можно что угодно: главы, теоремы, задачи...


В будущем после проработки апи этой нумерации я включу её прямо в апи книги, например в пространство ${code`control`}.
Тогда не придется следить за тем, чтобы вызывать объекты последовательно в коде, порядок будет соответствовать порядку следования в книге.


Чтобы ссылаться на динамические данные из любого места книги (например, из первой главы на номер задачи из десятой), я добавил отдельное хранилище для метаинформации.
Любую информацию можно записать в это хранилище по ключу, и после первого прогона по книге, когда хранилище заполнится, мы находим ссылки на использование объектов из хранилища, если они есть, и подставляем информацию по требованию.
Таким образом, место использования и записи не зависят друг от друга.

Сейчас технически данные никак не ограничиваются, но понятно, что надо выделить некое сериализуемое подмножество.


Также, не забываем, что книги могут вкладываться друг в друга.
Вся нумерация и метаинформация подставляется на самом корневом уровне, он помечается атрибутом root (${code`api.book.root`} в отличие от обычного ${code`api.book`})


${pre`
— Я знаю, что ты загадал число \${use\`number\`(e => e.n)}, хотя ещё его не видел.

...

— Пожалуй, загадаю число \${area.inline(true).key('number').meta({n: 7})(7)}.
`}
— Я знаю, что ты загадал число ${use`number`(e => e.n)}, хотя ещё его не видел.

...

— Пожалуй, загадаю число ${area.inline(true).key('number').meta({n: 7})(7)}.


${h(3)`Навигация`}
Все заголовки собираются автоматически и формируют оглавление.

Вот как это выглядит для книги:
${img.src('/data/blog/data/11/toc.png').height(0.7)`Оглавление во всплывающем окне`}

Также добавил навигацию по картинкам.

Пример окна картинок для мобильного экрана:
${img.src('/data/blog/data/11/images.png').height(0.7)`Навигация по картинкам`}


В теории можно добавлять навигацию по произвольным сущностям.


${h(3)`Страницы`}
Их нет вообще и не будет.
Планируется в будущем дробить книгу на блоки по 1000 символов для точной навигации.
Эта функциональность требует переписывания самого алгоритма формирования книги.


${h(3)`О процессе`}
Следовало бы написать конвертор из texa в новый формат, но мне показалось довольно сложным учесть все нюансы texa, и быстрее просто скопировать текст.
Если есть исходники, сделать это достаточно быстро.


Немного о картинках.

В исходной книге для картинок использовался формат ${a.href('https://ru.wikipedia.org/wiki/MetaPost')`METAPOST`} и встроенные возможности texa для двух картинок.


Все картинки я перегонял в svg таким путём ${code`mp(tex) > pdf > svg`}.


${h(3)`Обратная связь`}
Если вы заметили неточность или опечатку, создайте issue на гитхабе.
`;
};