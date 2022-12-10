import { BookApi } from "@bookbox/preset-web";

export default (api: BookApi) => {
    const {book, start, end, header, link, code, format: {pre}, list, item, image} = api;
    return book`
${header.level(3)`Чем полезна библиотека?`}
${link.href('https://github.com/nikalexxx/fp-magic')`fp-magic`} — библиотека для создания функций с размеченными данными.
Была написана мной в прошлом году на голом javascript.


Использование описано в README, здесь лишь расскажу основную идею.
Чтобы создать функцию с метками, вместо самих аргументов нужно передать аргументы, у которых некоторые части будут с метками.
Часть аргумента — это любое выражение внутри него (либо весь аргумент целиком).
Например в массиве ${pre`[1, 2]`} мы хотим отметить выражение ${pre`2`}, чтобы далее при разборе отличать его от обычных выражений.
Чтобы не оборачивать любое выражение объектом оберткой, сделаем это внутри нашей функции.


Так как операции над выражениями с метками должны выполняться штатно, нельзя просто обернуть выражение в объект вида
${code.lang('javascript')`
{
    value: 2,
    type: 'label'
}
`}


Он сломает все операции с выражением.
Поэтому реализована следующая обертка:
${start(list)}
${item`Для объектов метка это символьное поле`}
${item`Для примитивов обрачиваем примитив ${pre`x`} в ${pre`new Object(x)`} и ставим метку в полученный объект`}
${end(list)}


Этот компромисс не подойдёт тем, кто работает с примитивами и явно проверяет js типы для них c помощью typeof.
В остальном примитивы по возможности превращаются обратно в явные значения через valueOf.
Для объектов символьное поле прекрасно скрыто от использования, кроме совсем уж диких попыток работать со всеми символьными свойствами объекта независимо от их значения.


${header.level(3)`Всего лишь добавить типы...`}
Из-за динамической природы js изначально много информации о типах терялось в результате преобразований функций.


Так как цепочки функций при создании функтора и при его использовании должны быть согласованы по типам, эти типы пришлось вынести в параметры функции-дженерика, которую возвращает ${pre`createFunctor`}.


Сам ${pre`createFunctor`} параметризуется отдельно допустимыми типами для меток.
Если его не параметризовать, то в качестве меток можно ставить любые строки.


Итоговая сигнатура такова
${code.lang('typescript')`
<L extends string>() => <T, R>(f: CheckArgument<T, R, L>) => {
    (argumentFunction: WrapperArgument<T, L>): R;
    labels: string[];
}
`}

Вспомогательных типов всего 7, и все они экспортированы для удобства
${code.lang('typescript')`
export type WrapperObject = Record<string | symbol, unknown>;
export type CheckFunction = (x: unknown) => boolean;
export type WrapperFunction = <T>(x: T) => T & WrapperObject;
export type CheckLabels<L extends string> = Record<L, CheckFunction>;
export type CheckArgument<T, R, L extends string> = (labels: CheckLabels<L>) => (arg: T) => R;
export type WrapperLabels<L extends string> = Record<L, WrapperFunction>;
export type WrapperArgument<T, L extends string> = (labels: WrapperLabels<L>) => T;
`}
`};
