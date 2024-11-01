import { BookApi } from "@bookbox/preset-web";

export default (api: BookApi) => {
    const {book, format, header, link} = api;
    const {i, b} = format;
    return book`
Каждое изменение небольшое, поэтому написал о них всех сразу.


${header.level(3)`Изменение интерфейса`}
Прежде всего была добавлена функциональность на главную страницу с блогом.
Теперь можно фильтровать статьи по тегам.
При клике на тег он становится активным и все статьи, содержащие его, попадают в выборку.
Теги кликабельны как и под заголовками, так и на верхней панели.
Панель прокручивается горизонтально.
Сбросить выбранные теги и показать все статьи можно, нажав на специальный псевдо-тег ${i`all`}.

Убрал кнопки ${b`Читать`}, теперь весь заголовок это ссылка на статью.


Добавил в порядке эксперимента мини-логотипы для ссылок.
Пока для ${link.href('https://wikipedia.org')('википедии')} и ${link.href('https://github.com')('гитхаба')}.
Для этого скачал их в векторном формате и вручную уменьшил размер, округляя координаты точек для кривых Безье.


Заодно под капотом проделал работу по выделению общих компонентов для страниц, теперь страницы стали выглядеть в одном стиле(Проекты, Физика, Дизайн).


${header.level(3)`Новые разделы`}
Давно уже есть темы, но решил завести для них ${link.href('?/design/themes')('отдельную страничку')} в разделе ${link.href('?/design')('дизайна')}.
Сравниваются тёмная и светлая темы для одинакового контента.


Создан раздел ${link.href('?/catalog')('Каталог')}.
Туда я буду помещать интересные и полезные мне ссылки.
Пока он выглядит просто, всего лишь дерево со ссылками листьями.
Троеточие в дереве означает лишь то, что я ещё не определил ссылку в категорию.

В будущем помимо заполнения ссылками планирую сделать поиск и удобную организацию ссылок.
Возможно подумаю в сторону автоматического вытаскивания иконки сайта(.ico) и её кэшировании.
`};
