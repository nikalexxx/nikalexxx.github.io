import { BookApi } from "@bookbox/preset-web";

export default (api: BookApi) => {
    const { book, format: {pre}, image, list, item, header, link, code, tooltip, start, end } = api;
    return book`
${header.level(3)`Github как сервис комментариев`}
С комментариями изначально была проблема.
Во-первых, их нужно где-то хранить.
Раз сайт статический, то вполне подошло бы хранение в виде файлов, например, в папке ${pre`comments`} для каждого поста.


Во-вторых, комментарии должен кто-то писать, и нельзя давать кому угодно доступ к исходному коду.
Поднимать свой сервер долго, хотя в будущем я надеюсь к нему придти (есть хороший движок ${link.href(
        'https://github.com/umputun/remark42'
    )`remark42`}, поднять можно в ${link.href(
        'https://cloud.yandex.ru/'
    )`Яндекс.Облаке`}).
Можно было обойтись без сервера и манипулировать файлами в отдельной ветке репозитория, но это по сути с нуля проектирование базы данных на файлах, плюс авторизация всё равно через github.


Так что были выбраны комментарии самого Github как самые простые в реализации.


${header.level(3)`Устройство комментариев`}
Для каждого нового поста создаётся issue (пока руками) вида ${pre`comments/blog/<post-id>`}.
Например, для данного поста это ${link.href(
        'https://github.com/nikalexxx/nikalexxx.github.io/issues/25'
    )(
        'https://github.com/nikalexxx/nikalexxx.github.io/issues/25'
    )}. Ставлю тег ${pre`comment`} и сразу закрываю issue, чтобы не мешалось в общем списке.


С псевдо-серверной частью всё.
Любой пользователь, авторизованный через Github, может написать комментарий.


Осталось отобразить их на странице сайта.
Для этого я связываю пост и issue в конфиге блога следующим образом (пример данного поста)
${code.lang('javascript')`
19: {
    type: 'js',
    creationTime: '2021-11-02T22:04:15',
    title: 'Комментарии с Github API и генерация превью по хэшу',
    tags: ['site', 'javascript', 'github', 'api'],
    comments: {
        githubIssue: 25,
    },
},
`}


Пользуясь открытостью ${link.href(
        'https://docs.github.com/en/rest'
    )`API Github`} на чтение данных публичных репозиториев, запрашиваю список комментариев для данного issue.

Ручка для комментариев выглядит так
${code`
https://api.github.com/repos/&lt;login>/&lt;repo>/issues/&lt;issue>/comments
`}
Для этого поста можно посмотреть её ответ ${link.href`https://api.github.com/repos/nikalexxx/nikalexxx.github.io/issues/25/comments`(
        'https://api.github.com/repos/nikalexxx/nikalexxx.github.io/issues/25/comments'
    )}


Скроем её за абстракцией API, описав нужные поля ответа (есть ${link.href(
        'https://github.com/github/rest-api-description'
    )`полная спецификация апи`}, но мне нужен лишь маленький кусочек, можно описать на месте)
${code.lang('typescript')`
export interface Comment {
    created_at: string;
    updated_at: string;
    body: string;
    user: {
        login: string;
        avatar_url: string;
        html_url: string;
    }
}

export function getIssueComments(login: string, repo: string, issue: string): Promise<Comment[]> {
    return fetch(
        \`https://api.github.com/repos/\${login}/\${repo}/issues/\${issue}/comments\`
    ).then((response) => response.json());
}
`}


В списке выводим каждый комментарий, ${tooltip.content(`
E.div.class(b('comment'))(
    E.div.class(b('comment-header'))(
        E.a
            .href(comment.user.html_url)
            .target('_blank')(
            E.div.class(b('user'))(
                E.img
                    .class(b('user-logo'))
                    .src(comment.user.avatar_url),
                comment.user.login
            )
        ),
        E.em.class(b('comment-date'))(
            prettyDate(new Date(comment.created_at))
        )
    ),

    E.pre(
        textWithLink(
            \`\n\${comment.body}\`
        ).map(({ type, body }) =>
            type === 'link'
                ? E.a.href(body)(body)
                : body
        )
    )
)
`)`так выглядит код компонента`}

Комментарии в самом гитхабе поддерживают ${link.href(
        'https://guides.github.com/features/mastering-markdown/'
    )`markdown`}, но тащить сторонний движок или писать свой с нуля не хотелось.
Поэтому необходимый минимум обеспечивает функция ${pre`textWithLink`}.
Она находит в тексте безопасные ссылки и делает их кликабельными.
Больше никаких других манипуляций.


${tooltip.content(
    `${`
const SafetyLink = /\\bhttps:\\/\\/([a-z-]+\\.)?[a-z-]+\\.[a-z-]+(\\/[a-z-]*)*\\b/g;

type Item = { type: 'text' | 'link'; body: string };
export function textWithLink(text: string): any {
    const result: Item[] = [];
    let currentIndex = 0;
    for (const elem of text.matchAll(SafetyLink)) {
        const link: string = elem[0];
        const { index } = elem;

        result.push(
            {
                type: 'text',
                body: text.substring(currentIndex, index),
            },
            {
                type: 'link',
                body: link,
            }
        );

        currentIndex = index + link.length;
    }
    if (currentIndex < text.length) {
        result.push({
            type: 'text',
            body: text.substring(currentIndex),
        });
    }

    return result;
}

`}`
)`код textWithLink`}


${header.level(3)`Превью поста по хэшу заголовка`}
Для некоторых статей (как например текущая) мне было сложно придумать картинку для привлечения внимания.
В блоге до недавнего времени вообще не было картинок, добавил только в предыдущем посте.
Но они смотрелись достаточно скованно в углу плитки, поэтому я вынес их наверх.


Для некоторых постов я добавил картинки (${link.href(
        '/?/blog/11'
    )`Книга по теории множеств`}, ${link.href(
        '/?/blog/1'
    )`Руководство по filemaker`}, ${link.href(
        '/?/blog/4'
    )`Стандартная модель элементарных частиц`}, ${link.href(
        '/?/blog/6'
    )`Клеточный автомат "Жизнь"`}). Для ${link.href(
        '/?/blog/16'
    )`поста про интернализацию`} картинкой послужил инлайновый svg c флагами.


Для каждой плитки задан плавный переход от картинки к названию — картинки растворяется к низу.
Это сделано с помощью дополнительного блока, который абсолютным позиционированием ставится поверх картинки и имеет линейный градиент от прозрачного к цвету фона.
${code.lang('css')`
background: linear-gradient(
    to bottom,
    transparent,
    transparent 70%,
    var(--color-background-prime)
);
position: absolute;
width: 100%;
height: 100%;
top: 0;
left: 0;
`}


Если картинка не задана, то в качестве фона генерируются цветные круги.
Так как я не хотел, чтобы при каждом обновлении страницы круги менялись, я не мог генерировать их рандомно.
В то же время они должны быть уникальными, то есть для разных постов не должно быть одинаковых картинок.


Решение — брать хэш от заголовка поста и на его основе создавать картинку.
В качестве хэш-функции я взял ${link.href(
        'https://en.wikipedia.org/wiki/MurmurHash'
    )`MurmurHash`} из-за быстроты выполнения.


${code.lang('javascript')`
export function hash(str: string) {
    let l = str.length;
    let hval = 0x811c9dc5;

    for (let i = 0; i < l; i++) {
        hval ^= str.charCodeAt(i);
        hval +=
            (hval << 1) +
            (hval << 4) +
            (hval << 7) +
            (hval << 8) +
            (hval << 24);
    }
    return ('0000000' + (hval >>> 0).toString(16)).substr(-8);
}

`}


Чтобы получить 64 бита, функция hash применяется два раза
${code.lang('javascript')`
const h1 = hash(title);
const h = h1 + hash(h1 + title);
`}


В результате для каждого заголовка получена строка вида ${pre`dc1e483ca0f1c339`}.
Её я разбиваю на 4 части, это описания 4 кругов.


Возьмем из примера выше первую четверть строки ${pre`dc1e`}.
Что значит каждый символ?
${start(list)}
${item`${pre`d`} — смещение по оси x`}
${item`${pre`c`} — смещение по оси y`}
${item`${pre`1`} — диаметр круга`}
${item`${pre`e`} — цвет круга как угол в модели ${link.href(
    'https://ru.wikipedia.org/wiki/HSL'
)`HSL`}`}
${end(list)}

Каждый символ переводится в десятичную дробь функцией
${code.lang('javascript')`
const d = char => parseInt(char, 16) / 16;
`}
Далее эта дробь используется уже в css для генерации процентов от высоты/ширины блоков (круг это div c ${pre`border-radius: 50%`}) и угла в hsl().

${image.src('/data/blog/data/19/preview-example.png').height(0.5).width(1)('Картинка для строки dc1e483ca0f1c339')}


Посмотреть, как это выглядит, можно прямо на ${link.href('/')`общей странице блога`}
`;
};
