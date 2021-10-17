import './Reports.less';

import { Component, E, block } from '../../utils';
import { PageGrid, YoutubeVideo } from '../../components';
import { Lang } from '../../blocks';

const b = block('reports');

export const Reports = Component.Reports(() => {
    return () => {
        return E.div.class(b())(
            E.h2(Lang.token`menu/reports`),
            E.div(
                E.div.class(b('report'))(
                    E.h3(
                        'Магия современных возможностей JavaScript для работающего программиста'
                    ),
                    E.p('Расскажу о таких современных возможностях JavaScript, как лямбда-функции, символы и прокси-объекты. Их использование позволяет писать лаконичный код и избегать лишних абстракций, особенно для сложных структур типа деревьев и графов. Как типовой рабочий пример — обогащение ответа API дополнительными знаниями о своей структуре. Затрону также метапрограммирование и связь между формальными языками и прокси-объектами.'),
                    E.br,
                    YoutubeVideo.src`https://www.youtube.com/embed/CBHoYfLMVKs`
                ),
                E.div.class(b('report'))(
                    E.h3('Продвинутые дженерики в TypeScript'),
                    E.p('Дженерики, или параметризованные типы, позволяют писать более гибкие функции и интерфейсы. Чтобы зайти дальше, чем параметризация одним типом, необходимо понять лишь несколько общих принципов составления дженериков — и TypeScript раскроется перед вами, как шкатулка с секретом. Расскажу, как не бояться вкладывать дженерики друг в друга и как использовать автоматический вывод типов в ваших проектах.'),
                    E.br,
                    E.p(E.a.href('https://habr.com/ru/company/yandex/blog/555520/')`Текстовая расшифровка`),
                    E.br,
                    YoutubeVideo.src`https://www.youtube.com/embed/YDTZpQrBXjc`
                )
            )
        );
    };
});
