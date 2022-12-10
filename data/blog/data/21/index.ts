import { BookApi } from "@bookbox/preset-web";

export default (_: BookApi) => _.book.root`
${_.header.level(3)`Второй подход к книжному формату`}
Теперь это больше тулкит, чем формат.
Он обзавёлся сайтом ${_.link.href('https://bookbox-format.github.io')}, где можно почитать документацию или просто посмотреть быстрый старт и начать использовать.


Целый год я постепенно работал над ним, чтобы наконец выкатить в опенсорс.
На гитхабе можно посмотреть исходники — ${_.link.href('https://github.com/bookbox-format')}


Также я обновил книгу ${_.link.href('/?/books/vereshagin-shen-sets')`Начала теории множеств`} и все статьи в этом блоге.


Что же я делал целый год?


${_.header.level(3)`Пакеты в npm`}
Нужна была хорошая структура пакетов, которую можно будет безболезненно расширять в будущем.

${_.start(_.list)}
${_.item`
${_.link.href('https://www.npmjs.com/package/@bookbox/core')`@bookbox/core`} — ядро, там описание элементов и построение дерева.
Дерево получает для каждого своего узла локально уникальный ключ.
Вычисляются счётчики.
Обрабатываются ресурсы (картинки/видео/...), они совмещаются с внешним конфигом ресурсов.
Производится разбивка на страницы, точнее их внедрение в книгу.
Заполняется хранилище элементов по ключу.
Заполняется мета-информация (оглавление, медиа).
`}
${_.item`
${_.link.href('https://www.npmjs.com/package/@bookbox/generator-js')`@bookbox/generator-js`} — генератор книги на typescript, и соответственно на javascript.
Генератор это исходный код, из которого можно получить схему в виде json или yaml.
Можно сразу манипулировать AST, не сохраняя схему в файл.
Но так как схему можно получить лишь один раз, а читать много, то лучше этапы генерации и использования разделять.
`}
${_.item`
${_.link.href('https://www.npmjs.com/package/@bookbox/view-html')`@bookbox/view-html`} — представление в виде html.
Превращает схему в строку html.
Работает в браузере и на сервере.
На сервере можно генерировать html документ.
В браузере можно встроить книгу, используя esm модули с любым современным сборщиком модулей или нативно.
Поддерживает цветовую схему на css переменных, можно адаптировать к любому сайту.
Есть поддержка светлой и тёмной темы, оглавления и медиа.
При прокрутке в урле запоминается страница, текущее положение в книге запоминается после перезагрузки страницы.
`}
${_.item`
${_.link.href('https://www.npmjs.com/package/@bookbox/preset-web')`@bookbox/preset-web`} — все три пакета выше в одном.
Можно установить один пакет и не следить за тремя версиями.
`}
${_.end(_.list)}


${_.header.level(3)`Алгоритм формирования страниц`}
Чтобы вклинить страницы в дерево, надо сначала понять, как будет выглядеть дерево элементов на странице.
А будут они выглядеть как плоский список текста.
Поэтому надо пробежаться по листьям дерева в том порядке, в каком они будут идти и через каждые N (сейчас 500) символов вставлять новый узел.
То есть прикреплять к родительскому узлу.
При этом длинные блоки сплошного текста необходимо разрезать в местах появления страниц и заменять старые листья в дереве на новые.


Для этого надо было связать узлы дерева.
Во-первых, связать узел с родителем.
Во-вторых, с соседними узлами.
В-третьих, узлы листья с соседними листьями.


Сначала мы имеем простое дерево.


${_.image.height(0.5).src('/data/blog/data/21/tree.svg')`Дерево до преобразования`}


Затем провязываем все узлы связями.
Зелёные стрелки связывают листья, листья тоже выделены зелёным.
Большие зелёные стрелки показывают путь обхода листьев — так мы видим книгу на странице.


${_.image.height(0.5).src('/data/blog/data/21/linked-tree.svg')`Дерево после преобразования`}


Теперь добавим по пути обхода страницы.
Нулевая страница идёт перед всем остальным, просто вставляем.
Потом отсчитываем 500 символов и попадаем в середину блока текста.
Разрезаем блок на две части и вклиниваем посередине нашу страницу под номером 1.


${_.image.height(0.5).src('/data/blog/data/21/page-tree.svg')`Дерево после вставки страниц`}


Продолжаем так, пока листья не кончатся.
Потом уже работаем с новым деревом, где появились страницы в нужных местах.


Такая структура может служить не только для вставки страниц, но и для других вещей, когда важно узнать о соседних узлах в дереве.
Например, можно будет для выделенного слова заглянуть на 10 слов назад и вперёд, чтобы показать слово в окружении текста и сформировать предметный указатель по книге.


${_.header.level(3)`Поддержка подсветки синтаксиса`}
Так как блоки кода не редактируемы, мощные инструменты, такие как monaco-editor, не нужны.
Досточно разбить код на токены, и каждому токену через css присвоить цвет.
Так работают большинство библиотек подсветки синтаксиса.


Я выбрал ${_.link.href('https://github.com/highlightjs/highlight.js')`highlight.js`} в первую очередь потому, что она одинаково хорошо работает для браузера и сервера с одним и тем же апи.

Буквально в пару строк я получил подсветку синтаксиса
${_.code.lang('javascript')`
import hljs from 'highlight.js';

const {value: colorHtml} = hljs.highlight(text, {language});
`}

Я решил сделать темы, приближенные к темам ${_.link.href('https://github.com/Binaryify/OneDark-Pro')`One Dark Pro`}.
Темная тема очень похожа на неё.
Светлая почти такая же, но некоторые цвета темнее для контрастности.
Например строки в светлой теме имеют более темный зеленый цвет, а функции более темный синий.


Сами цвета как и все остальные цвета задаются через css переменные.

Сначала определяется список именованных цветов, они составляют палитру.


${_.image.height(0.7).src('/data/blog/data/21/css-example.png')`Все цвета имеют имена`}


А цвета для кода уже используют именованные цвета

${_.code.lang('css')`
--book-box-color-code-string: var(--book-box-color-name-green-herbal);
--book-box-color-code-number: var(--book-box-color-name-orange-light);
--book-box-color-code-boolean: var(--book-box-color-name-orange-light);
--book-box-color-code-literal: var(--book-box-color-name-orange-light);
--book-box-color-code-regexp: var(--book-box-color-name-red);
`}


${_.header.level(3)`Типизация`}
@bookbox/generator-js написан на typescript c хорошей поддержкой типов.


${_.image.width(1).src('/data/blog/data/21/ts-example.png')`Вывод типов для элемента заголовка`}

Типы свойств элементов выводятся автоматически из ядра и преобразуются в типы для объектов.
Объекты также являются функциями, который принимают в качестве аргументов поддерево книги.
Свойства тоже функции, они принимают как аргумент свои значения и возвращают исходный объект-функцию, обогащённую свойством.

${_.code`
вариант 1: element + .property(value) + ... + (children)
вариант 2: element + .property(value) + ... + \`child text\`

пример: image.width(1).src('/data/blog/data/21/ts-example.png')\`Вывод типов для элемента заголовка\`
`}


${_.header.level(3)`Минимум javascript для html представления`}
Всплывающие панели реализованы на css.

Логика открытия/скрытия панели реализована с помощью input checkbox.
Сам input невидимый, к нему привязан видимый label.


${_.image.width(1).src('/data/blog/data/21/panel-example-1.png')`В потоке книги виден только label`}

Контент панели становится видимым, если галочка поставлена.
Это можно проверить в css c помощью псевдокласса :checked, а также возможности указывать в правиле подряд идущие элементы.


${_.image.width(1).src('/data/blog/data/21/panel-example-2.png')`display меняется с none на grid при активации правила`}


Аналогично сделано в табах, только там состояние переключается между N элементами (не более 9).


${_.header.level(3)`Навигация по страницам`}
Текущий номер страницы сохраняется в url в качестве якоря.
При перезагрузке книга промотается к нужному месту.

Также книга отслеживает текущий раздел и помечает активный заголовок в оглавлении.


Обе эти возможности реализованы с помощью ${_.link.href('https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API')`IntersectionObserver`}.
IntersectionObserver позволяет следить за элементами на странице, точнее за тем, как они пересекают видимую область просмотра в браузере.
Это гораздо эффективнее, чем проверять положение элементов после каждого события скролла.


Случаи со страницами и заголовками похожи.
Есть список элементов, и на странице видна лишь часть списка.
При прокрутке некоторые элементы появляются или изчезают сверху или снизу, в зависимости от направления прокрутки.

Всегда есть некий "текущий" элемент, который мы обновляем при прокрутке.
Я отслеживаю верхний из видимых, но это может быть наоборот нижний из видимых или тот, кто ближе с середине страницы по вертикали.


Выбор верхнего элемента важен в моём случае, так как если все элементы исчезли из области видимости, текущий элемент не сбрасывается.
Это значит, что в случае с главами достаточно отслеживать только их заголовок, ведь он всегда идёт перед текстом самой главы.


В случае со страницами это также удобно.
В зоне видимости обычно (почти всегда в сплошном тексте, реже для блоков картинок) бывает по крайней мере одна страница, поэтому аргумент про сохранение не так важен.
Но при перезагрузке удобно прокручивать к нужной странице, чтобы она оказалась на самом верху видимого пространства.
Поэтому если мы отслеживаем самую верхнюю видимую страницу, после перезагрузки она лишь немного сдвинется по вертикали.


Примерно так могла бы выглядеть функция определения верхнего элемента (чем меньше индекс, тем выше элемент)
${_.code.lang('typescript')`
function getCurrentItemIndex(
    listMap: Map<string, number>; // отображение data-key -> index
    current: { index: number | null; visible: Set<number> }; // текущий индекс и остальные видимые
    entries: IntersectionObserverEntry[]; // события
) {
    let overTopMaximum: number = -Infinity;
    let overBottomMinimum: number = Infinity;
    for (const entry of entries) {
        const {
            isIntersecting, // элемент стал виден?
            target, // dom узел элемента
            boundingClientRect: {top}, // верхняя граница элемента
            intersectionRect: {top: itop} // верхняя граница пересечения
        } = entry;
        // я отслеживаю элементы по data-key, но это не обязательно должно быть так
        const i = listMap.get((target as HTMLElement).dataset.key ?? '') ?? 0;
        if (isIntersecting) {
            current.visible.add(i);
            continue;
        }
        current.visible.delete(i);
        if ((top ^ 0) === (itop ^ 0)) {
            // исчезание сверху
            if (i > overTopMaximum) overTopMaximum = i;
        } else if (i < overBottomMinimum) {
            // исчезание снизу
            overBottomMinimum = i;
        }
    }

    if (current.visible.size > 0) return Math.min(...current.visible);

    const vars = [];
    if (current.index !== null) vars.push(current.index);
    if (overBottomMinimum !== Infinity) vars.push(overBottomMinimum - 1);
    if (overTopMaximum !== -Infinity) vars.push(overTopMaximum);

    return Math.max(0, Math.min(...vars));
}
`}


${_.header.level(3)`Полноценный сайт`}
Сайт ${_.link.href('https://bookbox-format.github.io')} написан на ${_.link.href('https://www.solidjs.com')`solid-js`}.


Страницы документации и быстрого старта написаны на bookbox.
Обертка для solid была небольшой.


Вот собственно и она


${_.code.lang('tsx')`
import { Component, onMount } from 'solid-js';
import { browserInit, render, RenderOptions } from '@bookbox/preset-web';

browserInit();

export const Bookbox: Component<Omit<RenderOptions, 'element'>> = ({ bookData, settingsOptions, layoutOptions }) => {
    let docsRef: HTMLDivElement;

    onMount(() => {
        render({ element: docsRef, bookData, settingsOptions, layoutOptions });
    });

    return <div ref={docsRef!}></div>;
};
`}


${_.header.level(3)`Планы`}
Сейчас мне нужно научится в автоматическом или полуавтоматическом режиме переводить документы tex.
Начала теории множеств я набивал вручную.
В идеале это должен быть онлайн конвертер, хочу любую теховскую статью из arxiv переводить на лету.


Параллельно с этим нужно искать лучший генератор.
Я пробовал mdx, но там слишком много багов в официальных реализациях.
Возможно, на первом этапе будет достаточно jsx, присматриваюсь к шаблонам astro.


И наконец нужно развивать html представление, добавить листание страниц, настройку размера текста и другие настройки.
Помимо html, очевидно нужен markdown и tex в качестве форматов просмотра.
Для конвертации туда-обратно рассматриваю pandoc.


`;
