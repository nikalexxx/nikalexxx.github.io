import { BookApi } from '@bookbox/preset-web';
import { getCustomElements } from '../../elements.js';

export default (api: BookApi) => {
    const { book, format, area, list, item, start, end, math, label } = api;
    const { i, b, } = format;

    const {
        paragraph,
        problem,
        theorem,
        proof,
        A,
        X,
        Y,
        n,
    } = getCustomElements(api);

    return book`
${paragraph.key('equivalence-order')`Отношения эквивалентности и порядка`}
Напомним, что бинарным отношением на множестве ${math`X`} называется подмножество ${math`R \\subset X \\times X`};
вместо ${math`\\lang x_1, x_2 \\rang \\in R`} часто пишут ${math`x_1 R x_2`}.


Бинарное отношение ${math`R`} на множестве ${math`X`} называется ${i`отношением эквивалентности`}, если выполнены следующие свойства:
${start(list)}
${item`
(рефлексивность) ${math`x R x`} для всех ${math`x \\in X`};
`}
${item`
(симметричность) ${math`x R y \\rArr y R x`} для всех ${math`x, y \\in X`};
`}
${item`
(транзитивность) ${math`x R y`} и ${math`y R z \\rArr x R z`} для всех ${math`x, y, z \\in X`}.
`}
${end(list)}


Имеет место следующее очевидное, но важное утверждение:


${theorem.key('eql-classes')`
(${b`а`}) Если множество ${X} разбито в объединение непересекающихся подмножеств, то отношение «лежать в одном подмножестве» является отношением эквивалентности.


(${b`б`}) Всякое отношение эквивалентности получается описанным способом из некоторого разбиения.
`}


${proof.start}
Первое утверждение совсем очевидно;
мы приведём доказательство второго, чтобы было видно, где используются все пункты определения эквивалентности.
Итак, пусть ${math`R`} — отношение эквивалентности.
Для каждого элемента ${math`x \\in X`} рассмотрим его ${i`класс эквивалентности`} — множество всех ${math`y \\in X`}, для которых верно ${math`x R y`}.


Докажем, что для двух различных ${math`x_1, x_2`} такие множества либо не пересекаются, либо совпадают.
Пусть они пересекаются, то есть имеют общий элемент ${math`z`}.
Тогда ${math`x_1 R z`} и ${math`x_2 R z`}, откуда ${math`z R x_2`} (симметричность) и ${math`x_1 R x_2`} (транзитивность), а также ${math`x_2 R x_1`} (симметричность).
Поэтому для любого ${math`z`} из ${math`x_1 R z`} следует ${math`x_2 R z`} (транзитивность) и наоборот.


Осталось заметить, что в силу рефлексивности каждый элемент ${math`x`} принадлежит задаваемому им классу, то есть действительно всё множество ${X} разбито на непересекающиеся классы.
${proof.end}


${problem`
Покажите, что требования симметричности и транзитивности можно заменить одним: ${math`x R z`} и ${math`y R z \\rArr x R y`}
(при сохранении требования рефлексивности).
`}

${problem`Сколько различных отношений эквивалентности существует на множестве ${math`\\{ 1, 2, 3, 4, 5 \\}`}?`}


${problem`
На множестве ${math`M`} заданы два отношения эквивалентности, обозначаемые ${math`∼_1`} и ${math`∼_2`}, имеющие ${math`n_1`} и ${math`n_2`} классов эквивалентности соответственно.
Будет ли их пересечение ${math`x ∼ y \\lrArr [(x ∼_1 y) \\ \\text{и} \\ (x ∼_2 y)]`} отношением эквивалентности?
Сколько у него может быть классов?
Что можно сказать про объединение отношений?
`}


${problem`
(Теорема ${label.ref(
    'name_ramsey'
)`Рамсея`}) Множество всех ${math`k`}-элементных подмножеств бесконечного множества ${A} разбито на ${math`l`} классов (${math`k, l`} — натуральные числа).
Докажите, что найдётся бесконечное множество ${math`B \\subset A`}, все ${math`k`}-элементные подмножества которого принадлежат одному классу.
`}


(При ${math`k = 1`} это очевидно: если бесконечное множество разбито на конечное число классов, то один из классов бесконечен.
При ${math`k = 2`} и ${math`l = 2`}  утверждение можно сформулировать так: из бесконечного множества людей можно выбрать либо бесконечно много попарно знакомых, либо бесконечно много попарно незнакомых.
Конечный вариант этого утверждения — о том, что среди любых шести людей есть либо три попарно знакомых, либо три попарно незнакомых, — известная задача для школьников.)


Множество классов эквивалентности называют ${i`фактор-множеством`} множества ${X} по отношению эквивалентности ${math`R`}.
(Если отношение согласовано с дополнительными структурами на ${X}, получаются фактор-группы, фактор-кольца и т. д.)


Отношения эквивалентности нам не раз ещё встретятся, но сейчас наша основная тема — отношения порядка.


Бинарное отношение ${math`\\leqslant`} на множестве ${X} называется ${i`отношением частичного порядка`}, если выполнены такие свойства:
${start(list)}
${item`
(рефлексивность) ${math`x \\leqslant x`} для всех ${math`x \\in X`};
`}
${item`
(антисимметричность) ${math`x \\leqslant y`} и ${math`y \\leqslant x \\rArr x = y`} для всех ${math`x, y \\in X`};
`}
${item`
(транзитивность) ${math`x \\leqslant y`} и ${math`y \\leqslant z \\rArr x \\leqslant z`} для всех ${math`x, y, z \\in X`}.
`}
${end(list)}

(Следуя традиции, мы используем символ ${math`\\leqslant`} (а не букву) как знак отношения порядка.)
Множество с заданным на нём отношением частичного порядка называют ${i`частично упорядоченным`}.


Говорят, что два элемента ${math`x, y`} частично упорядоченного множества ${i`сравнимы`}, если ${math`x \\leqslant y`} или ${math`y \\leqslant x`}.
Заметим, что определение частичного порядка не требует, чтобы любые два элемента множества были сравнимы.
Добавив это требование, мы получим определение ${i`линейного порядка`} (${i`линейно упорядоченного множества`}).


Приведём несколько примеров частичных порядков:
${start(list)}
${item`Числовые множества с обычным отношением порядка (здесь порядок будет линейным).`}
${item`
На множестве ${math`\\R \\times \\R`} всех пар действительных чисел можно ввести частичный порядок, считая, что ${math`\\lang x_1, x_2 \\rang \\leqslant \\lang y_1, y_2 \\rang`}, если ${math`x_1 \\leqslant y_1`} и ${math`x_2 \\leqslant y_2`}.
Этот порядок уже не будет линейным: пары ${math`\\lang 0, 1 \\rang`} и ${math`\\lang 1, 0 \\rang`} не сравнимы.
`}
${item`
На множестве функций с действительными аргументами и значениями можно ввести частичный порядок, считая, что ${math`f \\leqslant g`}, если ${math`f(x) \\leqslant g(x)`} при всех ${math`x \\in \\R`}.
Этот порядок не будет линейным.
`}
${item`
На множестве целых положительных чисел можно определить порядок, считая, что ${math`x \\leqslant y`}, если ${math`x`} делит ${math`y`}.
Этот порядок тоже не будет линейным.
`}
${item`
Отношение «любой простой делитель числа ${math`x`} является также и делителем числа ${math`y`}» не будет отношением порядка на множестве целых положительных чисел (оно рефлексивно и транзитивно, но не антисимметрично).
`}
${item`
Пусть ${math`U`} — произвольное множество.
Тогда на множестве ${math`P(U)`} всех подмножеств множества ${math`U`} отношение включения ${math`\\subset`} будет частичным порядком.
`}
${item`
На буквах русского алфавита традиция определяет некоторый порядок (а ${math`\\leqslant`} б ${math`\\leqslant`} в ${math`\\leqslant \\ldots \\leqslant`} я).
Этот порядок линеен — про любые две буквы можно сказать, какая из них раньше (при необходимости заглянув в словарь).
`}
${item`
${area.inline(true).key('lexical-order')`
На словах русского алфавита определён ${i`лексикографический`} порядок (как в словаре).
Формально определить его можно так: если слово ${math`x`} является началом слова ${math`y`}, то ${math`x \\leqslant y`}
(например, кант ${math`\\leqslant`} кантор).
Если ни одно из слов не является началом другого, посмотрим на первую по порядку букву, в которой слова отличаются: то слово, где эта буква меньше в алфавитном порядке, и будет меньше.
Этот порядок также линеен (иначе что бы делали составители словарей?).
`}
`}
${item`
Отношение равенства ${math`((x \\leqslant y) \\lrArr (x = y))`} также является отношением частичного порядка, для которого никакие два различных элемента не сравнимы.
`}
${item`
Приведём теперь бытовой пример.
Пусть есть множество ${X} картонных коробок.
Введём на нём порядок, считая, что ${math`x \\leqslant y`}, если коробка ${math`x`} целиком помещается внутрь коробки ${math`y`} (или если ${math`x`} и ${math`y`} — одна и та же коробка).
В зависимости от набора коробок этот порядок может быть или не быть линейным.
`}
${end(list)}

Пусть ${math`x, y`} — элементы частично упорядоченного множества ${X}.
Говорят, что ${math`x < y`}, если ${math`x \\leqslant y`} и ${math`x \\not = y`}.
Для этого отношения выполнены такие свойства:
${math.block()`
\\begin{gathered}
x \\not < x; \\\\
(x < y) \\ \\text{и} \\ (y < z) \\rArr x < z.
\\end{gathered}
`}
(Первое очевидно, проверим второе: если ${math`x < y`} и ${math`y < z`}, то есть ${math`x \\leqslant y, x \\not = y, y \\leqslant z, y \\not = z`}, то ${math`x \\leqslant z`} по транзитивности; если бы оказалось, что ${math`x = z`}, то мы бы имели ${math`x \\leqslant y \\leqslant x`} и потому ${math`x = y`} по антисимметричности, что противоречит предположению.)


Терминологическое замечание: мы читаем знак ${math`\\leqslant`} как «меньше или равно», а знак ${math`<`} — как «меньше», неявно подразумевая, что ${math`x \\leqslant y`} тогда и только тогда, когда ${math`x < y`} или ${math`x = y`}.
К счастью, это действительно так.
Ещё одно замечание: выражение ${math`x > y`} («${math`x`} больше ${math`y`}») означает, что ${math`y < x`}, а выражение ${math`x \\leqslant y`} («${math`x`} больше или равно ${math`y`}») означает, что ${math`y \\leqslant x`}.


${problem`Объясните, почему не стоит читать ${math`x \\leqslant y`} как «${math`x`} не больше ${math`y`}».`}


В некоторых книжках отношение частичного порядка определяется как отношение ${math`<`}, удовлетворяющее двум указанным свойствам.
В этом случае отношение ${math`x \\leqslant y \\lrArr [(x < y) \\ \\text{или} \\ (x = y)]`} является отношением частичного порядка в смысле нашего определения.


${problem`Проверьте это.`}


Во избежание путаницы отношение ${math`<`} иногда называют отношением ${i`строгого порядка`}, а отношение ${math`\\leqslant`} — отношением ${i`нестрогого порядка`}.
Одно и то же частично упорядоченное множество можно задавать по-разному: можно сначала определить отношение нестрогого порядка ${math`\\leqslant`} (рефлексивное, антисимметричное и транзитивное) и затем из него получить отношение строгого порядка ${math`<`}, а можно действовать и наоборот.


${problem`
Опуская требование антисимметричности в определении частичного порядка, получаем определение предпорядка.
Докажите, что любой предпорядок устроен так: множество делится на непересекающиеся классы, при этом ${math`x \\leqslant y`} для любых двух элементов ${math`x, y`} из одного класса, а на фактор-множестве задан частичный порядок, который и определяет результат сравнения двух элементов из разных классов.
`}


Вот несколько конструкций, позволяющих строить одни упорядоченные множества из других.
${start(list)}
${start(item)}
Пусть ${math`Y`} — подмножество частично упорядоченного множества ${math`(X, \\leqslant)`}.
Тогда на множестве ${math`Y`} возникает естественный частичный порядок, индуцированный из ${X}.
Формально говоря,
${math.block()`
(\\leqslant_Y) = (\\leqslant) \\cap (Y \\times Y).
`}
Если порядок на ${X} был линейным, то и индуцированный порядок на ${math`Y`}, очевидно, будет линейным.
${end(item)}
${start(item)}
Пусть ${X} и ${Y} — два непересекающихся частично упорядоченных множества.
Тогда на их объединении можно определить частичный порядок так: внутри каждого множества элементы сравниваются как раньше, а любой элемент множества ${X} по определению меньше любого элемента ${Y}.
Это множество естественно обозначить ${math`X + Y`}.
(Порядок будет линейным, если он был таковым на каждом из множеств.)


Это же обозначение применяют и для пересекающихся (и даже совпадающих множеств).
Например, говоря об упорядоченном множестве ${math`\\N + \\N`}, мы берём две непересекающиеся копии натурального ряда ${math`\\{0, 1, 2, \\ldots \\}`} и ${math`\\{\\overline{0}, \\overline{1}, \\overline{2}, \\ldots \\}`} и рассматриваем множество ${math`\\{0, 1, 2, \\ldots , \\overline{0}, \\overline{1}, \\overline{2}, \\ldots \\}`}, причём ${math`k \\leqslant \\overline{l}`} при всех ${math`k`} и ${math`l`}, а внутри каждой копии порядок обычный.
${end(item)}
${start(item)}
${start(area.key('multi-set-order').inline(true))}
Пусть ${math`(X, \\leqslant_X)`} и ${math`(Y, \\leqslant_Y)`} — два частично упорядоченных множества.
Можно определить порядок на произведении ${math`X \\times Y`} несколькими способами.
Можно считать, что ${math`\\lang x_1, y_1 \\rang \\leqslant \\lang x_2, y_2 \\rang`}, если ${math`x_1 \\leqslant_X x_2`} и ${math`y_1 \\leqslant_Y y_2`} (покоординатное сравнение).
Этот порядок, однако, не будет линейным, даже если исходные порядки и были линейными: если первая координата больше у одной пары, а вторая у другой, как их сравнить?
Чтобы получить линейный порядок, договоримся, какая координата будет «главной» и будем сначала сравнивать по ней, а потом (в случае равенства) — по другой.
Если главной считать ${X}-координату, то ${math`\\lang x_1, y_1 \\rang \\leqslant \\lang x_2, y_2 \\rang`}, если ${math`x_1 <_X x_2`} или если ${math`x_1 = x_2`}, а ${math`y_1 \\leqslant_Y y_2`}.
Однако по техническим причинам удобно считать главной вторую координату.
Говоря о произведении двух линейно упорядоченных множеств как о линейно упорядоченном множестве, мы в дальнейшем подразумеваем именно такой порядок (сначала сравниваем по второй координате).
${end(area)}
${end(item)}
${end(list)}

${problem`
Докажите, что в частично упорядоченном множестве ${math`\\N \\times \\N`} (порядок покоординатный) нет бесконечного подмножества, любые два элемента которого были бы несравнимы.
Верно ли аналогичное утверждение для ${math`\\Z \\times \\Z`}?
`}


${problem`Докажите аналогичное утверждение для ${math`\\N^k`} (порядок покоординатный).`}


${problem`
Пусть ${math`U`} — конечное множество из ${math`n`} элементов.
Рассмотрим множество ${math`P(U)`} всех подмножеств множества ${math`U`}, упорядоченное по включению.
Какова максимально возможная мощность множества ${math`S \\subset P(U)`}, если индуцированный на ${math`S`} порядок линеен?
если никакие два элемента ${math`S`} не сравнимы? (Указание: см. ${label.ref(
    'problem_max-sub-size'
)`задачу ${n.problem('max-sub-size')}`}.)
`}


${problem`Сколько существует различных линейных порядков на множестве из ${math`n`} элементов?`}


${problem`
Докажите, что всякий частичный порядок на конечном множестве можно продолжить до линейного
(«продолжить» означает, что если ${math`x \\leqslant y`} в исходном порядке, то и в новом это останется так).
`}


${problem`
Дано бесконечное частично упорядоченное множество ${X}.
Докажите, что в нём всегда найдётся либо бесконечное подмножество попарно несравнимых элементов, либо бесконечное подмножество, на котором индуцированный порядок линеен.
`}


${problem`
(Конечный вариант предыдущей задачи.)
Даны целые положительные числа ${math`m`} и ${math`n`}.
Докажите, что во всяком частично упорядоченном множестве мощности ${math`mn + 1`} можно указать либо ${math`m + 1`} попарно несравнимых элементов, либо ${math`n + 1`} попарно сравнимых.
`}


${problem`
В строчку написаны ${math`mn + 1`} различных чисел.
Докажите, что можно часть из них вычеркнуть так, чтобы осталась либо возрастающая последовательность длины ${math`m + 1`}, либо убывающая последовательность длины ${math`n + 1`}.
(Указание: можно воспользоваться предыдущей задачей.)
`}


${problem`
Рассмотрим семейство всех подмножеств натурального ряда, упорядоченное по включению.
Существует ли у него линейно упорядоченное (в индуцированном порядке) подсемейство мощности континуум?
Существует ли у него подсемейство мощности континуум, любые два элемента которого несравнимы?
`}


Элемент частично упорядоченного множества называют ${i`наибольшим`}, если он больше любого другого элемента, и ${i`максимальным`}, если не существует большего элемента.
Если множество не является линейно упорядоченным, то это не одно и то же: наибольший элемент автоматически является максимальным, но не наоборот.
(Одно дело коробка, в которую помещается любая другая, другое — коробка, которая никуда больше не помещается.)


Легко понять, что наибольший элемент в данном частично упорядоченном множестве может быть только один, в то время как максимальных элементов может быть много.


Аналогично определяют ${i`наименьшие`} и ${i`минимальные`} элементы.


${problem`
Докажите, что любые два максимальных элемента не сравнимы.
Докажите, что в конечном частично упорядоченном множестве ${X} для любого элемента ${math`x`} найдётся максимальный элемент ${math`y`}, больший или равный ${math`x`}.
`}
`;
};
