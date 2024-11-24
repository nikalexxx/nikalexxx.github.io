import { BookApi } from "@bookbox/preset-web";

export default (api: BookApi) => {
    const {book, format, header, link, code, image, list, item, start, end} = api;
    const {pre} = format;
    return book`
${header.level(3)`Внешний вид блога`}
Пора было обновить дизайн сайта, поэтому я унифицировал блог относительно остальных разделов.
Каждый пост стал плиткой, по которой можно кликать.
Если у поста есть картинка для превью, то теперь она появляется в правом нижнем углу плитки.
Grid сетка позволяет использовать максимум пространства экрана, оставаясь гибкой для настройки.


Облако тегов теперь переехало в правую часть экрана.
Для узких экранов меньше 700px (например на телефонах) оно смещается вниз.
Так оно не мешает чтению статей, когда полезного места и так мало.


Каждый тег в облаке теперь увеливается в размерах, исходя из его частоты в постах.
Навигация по тегам работает как и прежде, и теперь над каждым из них в нативном ${pre`title`} при наведении показывается количество постов с этим тегом.

Из забавного — добавил в тегах иконку для ${pre`svg`}


${header.level(3)`Просмотрщик изображений`}
Так как у меня скопились много фотографий из путешествий, то надо было их выкладывать.
Посмотреть их все можно в разделе ${link.href`/?/travels`('Путешествия')}.
Но нельзя просто так обновлять контент, нужно и техническую сторону усовершенствовать.


Поэтому я дописал просмотрщик изображений, теперь в нём можно листать вперёд и назад.
Добавил поддержку управления с клавиатуры, стрелки влево и вправо листают, Esc закрывает модальное окно.


${header.level(3)`Что ещё?`}
${start(list)}
${item`Добавил ссылки на инструменты сборки для веба в ${link.href`/?/catalog`('Каталог')}`}
${item`Добавил обложку для книги "Начала теории множеств" в разделе ${link.href`/?/books`('Книги')}`}
${item`Добавил наконец свою фотографию в раздел ${link.href`/?/about`('Кто я?')}`}
${item`Добавил css переменные для раздела ${link.href`/?/design/themes`('Темы')}`}
${item`Добавил существующие языковые токены для интернализации во все основные разделы`}
${item`Добавил флаги 🇷🇺 и 🇬🇧 в выбор языка в шапке`}
${item`Добавил внизу для каждого поста ссылки на предыдущую и следующую статью в блоге `}
${item`Исправил выставление скролла по умолчанию на некоторых элементах, из-за этого возникали лишние полосы прокрутки`}
${item`Исправил вывод изображений в ${link.href`/?/blog/9`('книжном формате')} (ширина не учитывалась верно и их "плющило")`}
${end(list)}
`};