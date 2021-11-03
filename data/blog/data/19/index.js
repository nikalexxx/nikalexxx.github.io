export default (api) => {
    const { book, text, block } = api;
    const { h, a, code, tooltip } = text;
    const { pre, img, ul, li } = block;
    return book`
${h(3)`Github как сервис комментариев`}
С комментариями изначально была проблема.
Во-первых, их нужно где-то хранить.
Раз сайт статический, то вполне подошло бы хранение в виде файлов, например, в папке ${code`comments`} для каждого поста.


Во-вторых, комментарии должен кто-то писать, и нельзя давать кому угодно доступ к исходному коду.
Поднимать свой сервер долго, хотя в будущем я надеюсь к нему придти (есть хороший движок ${a.href(
        'https://github.com/umputun/remark42'
    )`remark42`}, поднять можно в ${a.href(
        'https://cloud.yandex.ru/'
    )`Яндекс.Облаке`}).
Можно было обойтись без сервера и манипулировать файлами в отдельной ветке репозитория, но это по сути с нуля проектирование базы данных на файлах, плюс авторизация всё равно через github.


Так что были выбраны комментарии самого Github как самые простые в реализации.


${h(3)`Устройство комментариев`}
Для каждого нового поста создаётся issue (пока руками) вида ${code`comments/blog/<post-id>`}.
Например, для данного поста это ${a.href(
        'https://github.com/nikalexxx/nikalexxx.github.io/issues/25'
    )(
        'https://github.com/nikalexxx/nikalexxx.github.io/issues/25'
    )}. Ставлю тег ${code`comment`} и сразу закрываю issue, чтобы не мешалось в общем списке.


С псевдо-серверной частью всё.
Любой пользователь, авторизованный через Github, может написать комментарий.


Осталось отобразить их на странице сайта.
Для этого я связываю пост и issue в конфиге блога следующим образом (пример данного поста)
${pre`
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


Пользуясь открытостью ${a.href(
        'https://docs.github.com/en/rest'
    )`API Github`} на чтение данных публичных репозиториев, запрашиваю список комментариев для данного issue.

Ручка для комментариев выглядит так
${pre`
https://api.github.com/repos/<login>/<repo>/issues/<issue>/comments
`}
Для этого поста можно посмотреть её ответ ${a.href`https://api.github.com/repos/nikalexxx/nikalexxx.github.io/issues/25/comments`(
        'https://api.github.com/repos/nikalexxx/nikalexxx.github.io/issues/25/comments'
    )}


Скроем её за абстракцией API, описав нужные поля ответа (есть ${a.href(
        'https://github.com/github/rest-api-description'
    )`полная спецификация апи`}, но мне нужен лишь маленький кусочек, можно описать на месте)
${pre`
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


В списке выводим каждый комментарий, ${tooltip.text(book`
${pre`
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
`}`)`так выглядит код компонента`}

Комментарии в самом гитхабе поддерживают ${a.href(
        'https://guides.github.com/features/mastering-markdown/'
    )`markdown`}, но тащить сторонний движок или писать свой с нуля не хотелось.
Поэтому необходимый минимум обеспечивает функция ${code`textWithLink`}.
Она находит в тексте безопасные ссылки и делает их кликабельными.
Больше никаких других манипуляций.


${tooltip.text(
    book`${pre`
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


${h(3)`Превью поста по хэшу заголовка`}
Для некоторых статей (как например текущая) мне было сложно придумать картинку для привлечения внимания.
В блоге до недавнего времени вообще не было картинок, добавил только в предыдущем посте.
Но они смотрелись достаточно скованно в углу плитки, поэтому я вынес их наверх.


Для некоторых постов я добавил картинки (${a.href(
        '/?/blog/11'
    )`Книга по теории множеств`}, ${a.href(
        '/?/blog/1'
    )`Руководство по filemaker`}, ${a.href(
        '/?/blog/4'
    )`Стандартная модель элементарных частиц`}, ${a.href(
        '/?/blog/6'
    )`Клеточный автомат "Жизнь"`}). Для ${a.href(
        '/?/blog/16'
    )`поста про интернализацию`} картинкой послужил инлайновый svg c флагами.


Для каждой плитки задан плавный переход от картинки к названию — картинки растворяется к низу.
Это сделано с помощью дополнительного блока, который абсолютным позиционированием ставится поверх картинки и имеет линейный градиент от прозрачного к цвету фона.
${pre`
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
В качестве хэш-функции я взял ${a.href(
        'https://en.wikipedia.org/wiki/MurmurHash'
    )`MurmurHash`} из-за быстроты выполнения.

${tooltip.text(
    book`${pre`
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

`}`
)`код функции hash`}


Чтобы получить 64 бита, функция hash применяется два раза
${pre`
const h1 = hash(title);
const h = h1 + hash(h1 + title);
`}


В результате для каждого заголовка получена строка вида ${code`dc1e483ca0f1c339`}.
Её я разбиваю на 4 части, это описания 4 кругов.


Возьмем из примера выше первую четверть строки ${code`dc1e`}.
Что значит каждый символ?
${ul.start}
${li`${code`d`} — смещение по оси x`}
${li`${code`c`} — смещение по оси y`}
${li`${code`1`} — диаметр круга`}
${li`${code`e`} — цвет круга как угол в модели ${a.href(
    'https://ru.wikipedia.org/wiki/HSL'
)`HSL`}`}
${ul.end}

Каждый символ переводится в десятичную дробь функцией
${pre`
const d = char => parseInt(char, 16) / 16;
`}
Далее эта дробь используется уже в css для генерации процентов от высоты/ширины блоков (круг это div c ${code`border-radius: 50%`}) и угла в hsl().

${img.src('/data/blog/data/19/preview-example.png').height(0.5).width(1)('Картинка для строки dc1e483ca0f1c339')}


Посмотреть, как это выглядит, можно прямо на ${a.href('/')`общей странице блога`}
`;
};
