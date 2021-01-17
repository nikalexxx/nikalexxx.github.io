export default api => {
    const {book, external, control, text, block, _} = api;
    const {start, end} = control;
    const {i, b, h, code, a} = text;
    const {pre, ul, li, img} = block;
    const minibook = api => {
        const {book, text: {i, b}} = api;
        return book` ${b`Книга`} как ${i`функция`}!`;
    };
    return book`
В современном мире книги всё чаще переходят из бумажного формата в электронный.
К сожалению, оформлению уделяют не так много внимания.
Мы можем добиться хорошей верстки документов с помощью ${code`TEX`},
но они будут выглядеть хорошо только на широких экранах.
Но на мобильных устройствах с чтением такого документа будут проблемы,
так как верстка на основе ${code`TEX`} не адаптируется под размер экрана.
Различные лёгкие "книжные" форматы, такие как ${a.href('https://en.wikipedia.org/wiki/FictionBook')`fb2`},
изначально создавались для книг. Они ушли от оформления, сделав упор на семантику,
предоставив внешний вид программе просмотра.
Другие, например ${a.href('https://en.wikipedia.org/wiki/EPUB')`epub`}, пытались совместить всё сразу, семантику и произвольную верстку. Как следствие, epub слишком перегружен, никак не ограничивая содержимое своих контейнеров.


Нам важно получить широкие оформительские возможности в сочетании с адаптивной версткой.
И мир уже знает решение — ${code`html`}.
Веб представляет нам безграничные возможности для создания интерфейсов и может служить основой для книжного формата,
нижним уровнем реализации. Веб как основу для своего книжного формата ${a.href('https://bureau.ru/books/manifesto/')('использует')} дизайнерское бюро Артёма Горбунова.
Понятно, что нам требуется абстракция над ${code`html`},
чтобы определить основные компоненты формата.
Интересно, что исторически ${code`html`} использовался как язык разметки документов, и только потом с развитием веба он стал использоваться для создания приложений в браузере — сложных сайтов.


Основным и по сути единственным языком для создания абстракций в вебе служит ${i`javascript`}.
Его мы и будем использовать для реализации.
В итоге книгу можно будет распространять как обычную ${code`html`} страницу, через файловое представление.
Это значит, что её можно будет открывать локально в браузере даже без доступа к интернету, это будет обычный файл.
Но также легко можно будет встроить книгу в сайт с помощью ${i`javascript`}.
Также книгу можно экспортировать по желанию в другой формат, с полной или частичной поддержкой функций,
например простую документацию можно преобразовать в ${code`markdown`}


По умолчанию книга создаётся для браузера и в нём теоретически поддерживаются многие функции.
Важно разумно ограничить функционал, исходя из целей, поэтому, например, не будет широкого взаимодействия с сервером.


${h(3)`Требования, которые мы хотим соблюсти`}
${start(ul)}
${li(_`
Книга это бесконечный документ, который можно листать вертикально
`)}
${li(_`
Отсутствуют отдельные страницы, для навигации помимо структуры текста используются блоки по 1000 символов
`)}
${li(_`
Отсутствует локальная горизонтальная прокрутка любых форм, т.е. никаких каруселей изображений и вкладок
`)}
${li(_`
Нет сетки, ни глобальной, ни локальной.
Текст обтекает изображения, поток элементов движется сверху вниз
`)}
${li(_`
Возможность задать стили самостоятельно.
Несмотря на наличие стилизации, это скорее функциональные возможности, нежели оформительские.
Но конечно будет оформление по умолчанию, светлая и темная темы.
`)}
${li(_`
Возможность добавить любой формат для эспорта,
для этого нужно будет всего лишь составить "таблицу" соответствий между элементами книги и элементами нужного формата.
Например, заголовок в ${code`html`} будет преобразован в тег ${code`<h1>`}
`)}
${end(ul)}

${h(3)`Возможности разметки`}
${start(ul)}
${li(_`Тип текста: ${b`выделение`}, ${i`акцент`}, ${code`машинопись`}`)}
${li(_`Изображения: ${img.src('../assets/images/favicon/favicon-32x32.png').alt('favicon').position('inline')}`)}
${li(_`Медиа контент: видео и тд.`)}
${li(_`Всплывающие подсказки`)}
${li(_`Спойлеры`)}
${li(_`Ссылки: ${a.href('https://www.wikipedia.org')('Wikipedia')}`)}
${li(_`...`)}
${li(_`
Внешние компоненты
${external(({E}) => E.input.type`color`)}

Внутри таких компонентов невозможно контролировать условие на локальность.
Требуется продумать интерфейс, при котором такие компоненты могут существовать при различных условиях(отсутствие интернета, графические форматы, печать).
Включают в себя интерактивные объекты сторонних систем, например, встроенный плеер youtube.

${external(({E}) => E.div.style`height: 300px; max-height: 40vw; max-width: 700px`(E.iframe
    .src`https://www.youtube.com/embed/3s7h2MHQtxc`
    .frameborder`0`
    .allow`accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture`
    .allowfullscreen(true)
))}
`)}
${end(ul)}

${h(3)`Возможности взаимодействия`}
По умолчанию для браузера, так как он позволяет реализовать всё это уже сейчас.
${start(ul)}
${li(_`Закладки, + закладка по умолчанию — текущее место в книге`)}
${li(_`Заметки`)}
${li(_`Автоматическая проверка обновлений, если есть источник`)}
${li(_`
Возможность сослаться на любой объект в книге и показать превью из другого места книги.
Самое очевидное применение — указания на изображения.
Превью может быть встроенное или полноразмерное.
`)}
${li(_`
Навигация: автоматическое оглавление, поиск, внутренние ссылки(якоря).
Возможность просмотреть все типы объектов: все изображения, все ссылки и тд.
`)}
${li(_`
Базовая настройка стилей: текст с засечками или без, цвет текста, цвет фона, размер в разумных пределах.
`)}
${li(_`
Возможность сменить прокрутку на поэкранное перелистывание.
`)}
${li(_`
Распространение: кнопка скачивания в файл, локальные сниппеты для частей книги(для вставки в другие места, перегон в картинку для отправки через каналы сообщений).
`)}
${end(ul)}

${h(3)`Устройство разметки`}
Основной контент книги — текст.
Так как отсутствует сложная вёрстка, элементы разметки вторичны по отношению к тексту.
Тем не менее разметка обогащает сырой текст.
Элементы разметки определяются из практических соображений.


Виды элементов:
${start(ul)}
${li(_`
Блоки.
Картинки, видео и тд.
`)}
${li(_`
Текстовые.
Текст в отличие от блоков может переносится на следующие строки.
`)}
${li(_`
Мета элементы. Такие как автор, дата издания, название.
Нужны, чтобы отображать информацию вне основного контента.
`)}
${end(ul)}

Список стандартных элементов может расширяться, текстовые и блочные расположены в корневом пространстве имён.
Мета элементы в ${code`meta`}.
Допускается стандартизация дополнительных пространств имён.


У каждого элемента есть стандартные аттрибуты, например ${code`href`} у ссылки.
Также у каждого элемента есть атрибут ${code`meta`} для несхематизированных данных.


Примерный вид части дерева элементов:
${start(ul)}
${li(_`
b
`)}
${li(_`
i
`)}
${li(_`
code
`)}
${li(_`
a ${i`:href`}
`)}
${li(_`
img ${i`:src`} ${i`:alt`}
`)}
${li(_`
meta
    ${start(ul)}
    ${start(li)}
    author ${i`:name`}
    ${end(li)}
    ${start(li)}
    title
    ${end(li)}
    ${end(ul)}
`)}
${end(ul)}

Одна из основных задач определить стандартные элементы.


${h(3)`Препроцессор`}
Формат записи разметки может быть любым, от xml до бинарного.
Я использую javascript, потому что он позволяет легко определять разметку и имеет встроенный препроцессор в виде самого себя.


Книгу я записываю как чистую функцию:
${pre`
const minibook = api => {
    const {book, text: {i, b}} = api;
    return book\`\${b\`Книга\`} как \${i\`функция\`}!\`;
};
`}

Так как язык программирования позволяет любые вычислимые манипуляции, я могу передавать эту книгу и вкладывать в другие книги.
Давайте вложим вышеприведённую мини книгу в текущую книгу, для этого просто вызовем её как функцию, пробросив api.


${code`\${minibook(api)}`} >> ${minibook(api)}


Можно определять части книги заранее и вставлять их в итоговый текст, например писать главы в отдельных файлах, а потом импортировать в основную книгу.
Javascript позволяет это делать так же легко, как и с кодом.
Если реализовывать формат на основе xml, придётся либо придумывать специфические конструкции препроцессора, которые никогда не будут полны, либо вообще обходиться без препроцессора.
Тьюринг полный язык подходит как нельзя лучше.
Можно было бы взять любой, но javascript реализован в браузерах и такую реализацию легче всего поддерживать, раз уж книга отображается в браузере.


Вот пример разных элементов, применных к одинаковому тексту.
${pre`
['b', 'i', 'code', 'sub', 'sup'].map(elem => api[elem]\` текст \`)
`}
${['b', 'i', 'code', 'sub', 'sup'].map(elem => text[elem]` текст `)}


${h(3)`Текущая реализация`}
Все статьи на этом сайте, кроме одной(про Filemaker), написаны в данном формате.
Вы можете убедиться в этом, открыв в инструментах браузера вкладку Network и просмотрев исходный код этой статьи.
Разумеется, функционал реализован далеко не весь, и есть куда расти!
`};
