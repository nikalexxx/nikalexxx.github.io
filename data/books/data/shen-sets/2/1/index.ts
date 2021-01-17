import { getHeaders, problem, teor_end, teor_start, ttt } from '../../elements.js';

export default (api) => {
    const { _, text, block, meta, control, math } = api;
    const { h, i, b, label, code } = text;
    const { start, end } = control;
    const { ul, li, area } = block;
    const { paragraph } = getHeaders(h);
    const {draft} = meta;
    const { $, $$ } = math;

    const A = $`A`;
    const B = $`B`;
    const C = $`C`;
    const X = $`X`;
    const Y = $`Y`;
    const empty = '\\varnothing';
    const simdiff = '\\vartriangle';
    return _`
${paragraph('2.1. Отношения эквивалентности и порядка')}
Напомним, что бинарным отношением на множестве ${$`X`} называется подмножество ${$`R \\subset X \\times X`};
вместо ${$`\\lang x_1, x_2 \\rang \\in R`} часто пишут ${$`x_1 R x_2`}.


Бинарное отношение ${$`R`} на множестве ${$`X`} называется ${i`отношением эквивалентности`}, если выполнены следующие свойства:
${start(ul)}
${li(_`
(рефлексивность) ${$`x R x`} для всех ${$`x \\in X`};
`)}
${li(_`
(симметричность) ${$`x R y \\rArr y R x`} для всех ${$`x, y \\in X`};
`)}
${li(_`
(транзитивность) ${$`x R y`} и ${$`y R z \\rArr x R z`} для всех ${$`x, y, z \\in X`}.
`)}
${end(ul)}


Имеет место следующее очевидное, но важное утверждение:


${start(area.key('teor_11'))}
${b`Теорема 11`}.
(${b`а`}) Если множество ${X} разбито в объединение непересекающихся подмножеств, то отношение «лежать в одном подмножестве» является отношением эквивалентности.


(${b`б`}) Всякое отношение эквивалентности получается описанным способом из некоторого разбиения.
${end(area)}


${$`${teor_start}`}
Первое утверждение совсем очевидно;
мы приведём доказательство второго, чтобы было видно, где используются все пункты определения эквивалентности.
Итак, пусть ${$`R`} — отношение эквивалентности.
Для каждого элемента ${$`x \\in X`} рассмотрим его ${i`класс эквивалентности`} — множество всех ${$`y \\in X`}, для которых верно ${$`x R y`}.


Докажем, что для двух различных ${$`x_1, x_2`} такие множества либо не пересекаются, либо совпадают.
Пусть они пересекаются, то есть имеют общий элемент ${$`z`}.
Тогда ${$`x_1 R z`} и ${$`x_2 R z`}, откуда ${$`z R x_2`} (симметричность) и ${$`x_1 R x_2`} (транзитивность), а также ${$`x_2 R x_1`} (симметричность).
Поэтому для любого ${$`z`} из ${$`x_1 R z`} следует ${$`x_2 R z`} (транзитивность) и наоборот.


Осталось заметить, что в силу рефлексивности каждый элемент ${$`x`} принадлежит задаваемому им классу, то есть действительно всё множество ${X} разбито на непересекающиеся классы.
${$`${teor_end}`}


${problem(api)} Покажите, что требования симметричности и транзитивности можно заменить одним: ${$`x R z`} и ${$`y R z \\rArr x R y`} (при сохранении требования рефлексивности).


${problem(api)} Сколько различных отношений эквивалентности существует на множестве ${$`\\{ 1, 2, 3, 4, 5 \\}`}?


${problem(api)} На множестве ${$`M`} заданы два отношения эквивалентности, обозначаемые ${$`∼_1`} и ${$`∼_2`}, имеющие ${$`n_1`} и ${$`n_2`} классов эквивалентности соответственно.
Будет ли их пересечение ${$`x ∼ y \\lrArr [(x ∼_1 y) и (x ∼_2 y)]`} отношением эквивалентности?
Сколько у него может быть классов?
Что можно сказать про объединение отношений?


${problem(api)} (Теорема Рамсея) Множество всех ${$`k`}-элементных подмножеств бесконечного множества ${A} разбито на ${$`l`} классов (${$`k, l`} — натуральные числа).
Докажите, что найдётся бесконечное множество ${$`B \\subset A`}, все ${$`k`}-элементные подмножества которого принадлежат одному классу.


(При ${$`k = 1`} это очевидно: если бесконечное множество разбито на конечное число классов, то один из классов бесконечен.
При ${$`k = 2`} и ${$`l = 2`}  утверждение можно сформулировать так: из бесконечного множества людей можно выбрать либо бесконечно много попарно знакомых, либо бесконечно много попарно незнакомых.
Конечный вариант этого утверждения — о том, что среди любых шести людей есть либо три попарно знакомых, либо три попарно незнакомых, — известная задача для школьников.)


Множество классов эквивалентности называют ${i`фактор-множеством`} множества ${X} по отношению эквивалентности ${$`R`}.
(Если отношение согласовано с дополнительными структурами на ${X}, получаются фактор-группы, фактор-кольца и т. д.)


Отношения эквивалентности нам не раз ещё встретятся, но сейчас наша основная тема — отношения порядка.


Бинарное отношение ${$`\\leqslant`} на множестве ${X} называется ${i`отношением частичного порядка`}, если выполнены такие свойства:
${start(ul)}
${li(_`
(рефлексивность) ${$`x \\leqslant x`} для всех ${$`x \\in X`};
`)}
${li(_`
(антисимметричность) ${$`x \\leqslant y`} и ${$`y \\leqslant x \\rArr x = y`} для всех ${$`x, y \\in X`};
`)}
${li(_`
(транзитивность) ${$`x \\leqslant y`} и ${$`y \\leqslant z \\rArr x \\leqslant z`} для всех ${$`x, y, z \\in X`}.
`)}
${end(ul)}

(Следуя традиции, мы используем символ ${$`\\leqslant`} (а не букву) как знак отношения порядка.)
Множество с заданным на нём отношением частичного порядка называют ${i`частично упорядоченным`}.


Говорят, что два элемента ${$`x, y`} частично упорядоченного множества ${i`сравнимы`}, если ${$`x \\leqslant y`} или ${$`y \\leqslant x`}.
Заметим, что определение частичного порядка не требует, чтобы любые два элемента множества были сравнимы.
Добавив это требование, мы получим определение ${i`линейного порядка`} (${i`линейно упорядоченного множества`}).


Приведём несколько примеров частичных порядков:
${start(ul)}
${li`Числовые множества с обычным отношением порядка (здесь порядок будет линейным).`}
${li(_`
На множестве ${$`\\R \\times \\R`} всех пар действительных чисел можно ввести частичный порядок, считая, что ${$`\\lang x_1, x_2 \\rang \\leqslant \\lang y_1, y_2 \\rang`}, если ${$`x_1 \\leqslant y_1`} и ${$`x_2 \\leqslant y_2`}.
Этот порядок уже не будет линейным: пары ${$`\\lang 0, 1 \\rang`} и ${$`\\lang 1, 0 \\rang`} не сравнимы.
`)}
${li(_`
На множестве функций с действительными аргументами и значениями можно ввести частичный порядок, считая, что ${$`f \\leqslant g`}, если ${$`f(x) \\leqslant g(x)`} при всех ${$`x \\in \\R`}.
Этот порядок не будет линейным.
`)}
${li(_`
На множестве целых положительных чисел можно определить порядок, считая, что ${$`x \\leqslant y`}, если ${$`x`} делит ${$`y`}.
Этот порядок тоже не будет линейным.
`)}
${li(_`
Отношение «любой простой делитель числа ${$`x`} является также и делителем числа ${$`y`}» не будет отношением порядка на множестве целых положительных чисел (оно рефлексивно и транзитивно, но не антисимметрично).
`)}
${li(_`
Пусть ${$`U`} — произвольное множество.
Тогда на множестве ${$`P(U)`} всех подмножеств множества ${$`U`} отношение включения ${$`\\subset`} будет частичным порядком.
`)}
${li(_`
На буквах русского алфавита традиция определяет некоторый порядок (а ${$`\\leqslant`} б ${$`\\leqslant`} в ${$`\\leqslant \\ldots \\leqslant`} я).
Этот порядок линеен — про любые две буквы можно сказать, какая из них раньше (при необходимости заглянув в словарь).
`)}
${li(_`
На словах русского алфавита определён ${i`лексикографический`} порядок (как в словаре).
Формально определить его можно так: если слово ${$`x`} является началом слова ${$`y`}, то ${$`x \\leqslant y`}
(например, кант ${$`\\leqslant`} кантор).
Если ни одно из слов не является началом другого, посмотрим на первую по порядку букву, в которой слова отличаются: то слово, где эта буква меньше в алфавитном порядке, и будет меньше.
Этот порядок также линеен (иначе что бы делали составители словарей?).
`)}
${li(_`
Отношение равенства ${$`((x \\leqslant y) \\lrArr (x = y))`} также является отношением частичного порядка, для которого никакие два различных элемента не сравнимы.
`)}
${li(_`
Приведём теперь бытовой пример.
Пусть есть множество ${X} картонных коробок.
Введём на нём порядок, считая, что ${$`x \\leqslant y`}, если коробка ${$`x`} целиком помещается внутрь коробки ${$`y`} (или если ${$`x`} и ${$`y`} — одна и та же коробка).
В зависимости от набора коробок этот порядок может быть или не быть линейным.
`)}
${end(ul)}

Пусть ${$`x, y`} — элементы частично упорядоченного множества ${X}.
Говорят, что ${$`x < y`}, если ${$`x \\leqslant y`} и ${$`x \\not = y`}.
Для этого отношения выполнены такие свойства:
${$$`
\\begin{gathered}
x \\not < x; \\\\
(x < y) \\ и \\ (y < z) \\rArr x < z.
\\end{gathered}
`}
(Первое очевидно, проверим второе: если ${$`x < y`} и ${$`y < z`}, то есть ${$`x \\leqslant y, x \\not = y, y \\leqslant z, y \\not = z`}, то ${$`x \\leqslant z`} по транзитивности; если бы оказалось, что ${$`x = z`}, то мы бы имели ${$`x \\leqslant y \\leqslant x`} и потому ${$`x = y`} по антисимметричности, что противоречит предположению.)


Терминологическое замечание: мы читаем знак ${$`\\leqslant`} как «меньше или равно», а знак ${$`<`} — как «меньше», неявно подразумевая, что ${$`x \\leqslant y`} тогда и только тогда, когда ${$`x < y`} или ${$`x = y`}.
К счастью, это действительно так.
Ещё одно замечание: выражение ${$`x > y`} («${$`x`} больше ${$`y`}») означает, что ${$`y < x`}, а выражение ${$`x \\leqslant y`} («${$`x`} больше или равно ${$`y`}») означает, что ${$`y \\leqslant x`}.


${problem(api)} Объясните, почему не стоит читать ${$`x \\leqslant y`} как «${$`x`} не больше ${$`y`}».


В некоторых книжках отношение частичного порядка определяется как отношение ${$`<`}, удовлетворяющее двум указанным свойствам.
В этом случае отношение ${$`x \\leqslant y \\lrArr [(x < y) \\ или \\ (x = y)]`} является отношением частичного порядка в смысле нашего определения.


${problem(api)} Проверьте это.


Во избежание путаницы отношение ${$`<`} иногда называют отношением ${i`строгого порядка`}, а отношение ${$`\\leqslant`} — отношением ${i`нестрогого порядка`}.
Одно и то же частично упорядоченное множество можно задавать по-разному: можно сначала определить отношение нестрогого порядка ${$`\\leqslant`} (рефлексивное, антисимметричное и транзитивное) и затем из него получить отношение строгого порядка ${$`<`}, а можно действовать и наоборот.


${problem(api)} Опуская требование антисимметричности в определении частичного порядка, получаем определение предпорядка.
Докажите, что любой предпорядок устроен так: множество делится на непересекающиеся классы, при этом ${$`x \\leqslant y`} для любых двух элементов ${$`x, y`} из одного класса, а на фактор-множестве задан частичный порядок, который и определяет результат сравнения двух элементов из разных классов.


Вот несколько конструкций, позволяющих строить одни упорядоченные множества из других.
${start(ul)}
${start(li)}
Пусть ${$`Y`} — подмножество частично упорядоченного множества ${$`(X, \\leqslant)`}.
Тогда на множестве ${$`Y`} возникает естественный частичный порядок, индуцированный из ${X}.
Формально говоря,
${$$`
(\\leqslant_Y) = (\\leqslant) \\cap (Y \\times Y).
`}
Если порядок на ${X} был линейным, то и индуцированный порядок на ${$`Y`}, очевидно, будет линейным.
${end(li)}
${start(li)}
Пусть ${X} и ${Y} — два непересекающихся частично упорядоченных множества.
Тогда на их объединении можно определить частичный порядок так: внутри каждого множества элементы сравниваются как раньше, а любой элемент множества ${X} по определению меньше любого элемента ${Y}.
Это множество естественно обозначить ${$`X + Y`}.
(Порядок будет линейным, если он был таковым на каждом из множеств.)


Это же обозначение применяют и для пересекающихся (и даже совпадающих множеств).
Например, говоря об упорядоченном множестве ${$`\\N + \\N`}, мы берём две непересекающиеся копии натурального ряда ${$`\\{0, 1, 2, \\ldots \\}`} и ${$`\\{\\overline{0}, \\overline{1}, \\overline{2}, \\ldots \\}`} и рассматриваем множество ${$`\\{0, 1, 2, \\ldots , \\overline{0}, \\overline{1}, \\overline{2}, \\ldots \\}`}, причём ${$`k \\leqslant \\overline{l}`} при всех ${$`k`} и ${$`l`}, а внутри каждой копии порядок обычный.
${end(li)}
${start(li)}
Пусть ${$`(X, \\leqslant_X)`} и ${$`(Y, \\leqslant_Y)`} — два частично упорядоченных множества.
Можно определить порядок на произведении ${$`X \\times Y`} несколькими способами.
Можно считать, что ${$`\\lang x_1, y_1 \\rang \\leqslant \\lang x_2, y_2 \\rang`}, если ${$`x_1 \\leqslant_X x_2`} и ${$`y_1 \\leqslant_Y y_2`} (покоординатное сравнение).
Этот порядок, однако, не будет линейным, даже если исходные порядки и были линейными: если первая координата больше у одной пары, а вторая у другой, как их сравнить?
Чтобы получить линейный порядок, договоримся, какая координата будет «главной» и будем сначала сравнивать по ней, а потом (в случае равенства) — по другой.
Если главной считать ${X}-координату, то ${$`\\lang x_1, y_1 \\rang \\leqslant \\lang x_2, y_2 \\rang`}, если ${$`x_1 <_X x_2`} или если ${$`x_1 = x_2`}, а ${$`y_1 \\leqslant_Y y_2`}.
Однако по техническим причинам удобно считать главной вторую координату.
Говоря о произведении двух линейно упорядоченных множеств как о линейно упорядоченном множестве, мы в дальнейшем подразумеваем именно такой порядок (сначала сравниваем по второй координате).
${end(li)}
${end(ul)}

${problem(api)} Докажите, что в частично упорядоченном множестве ${$`\\N \\times \\N`} (порядок покоординатный) нет бесконечного подмножества, любые два элемента которого были бы несравнимы.
Верно ли аналогичное утверждение для ${$`\\Z \\times \\Z`}?


${problem(api)} Докажите аналогичное утверждение для ${$`\\N^k`} (порядок покоординатный).


${problem(api)} Пусть ${$`U`} — конечное множество из ${$`n`} элементов.
Рассмотрим множество ${$`P(U)`} всех подмножеств множества ${$`U`}, упорядоченное по включению.
Какова максимально возможная мощность множества ${$`S \\subset P(U)`}, если индуцированный на ${$`S`} порядок линеен?
если никакие два элемента ${$`S`} не сравнимы? (Указание: см. ${draft`задачу 14`}.)


${problem(api)} Сколько существует различных линейных порядков на множестве из ${$`n`} элементов?


${problem(api)} Докажите, что всякий частичный порядок на конечном множестве можно продолжить до линейного («продолжить» означает, что если ${$`x \\leqslant y`} в исходном порядке, то и в новом это останется так).


${problem(api)} Дано бесконечное частично упорядоченное множество ${X}.
Докажите, что в нём всегда найдётся либо бесконечное подмножество попарно несравнимых элементов, либо бесконечное подмножество, на котором индуцированный порядок линеен.


${problem(api)} (Конечный вариант предыдущей задачи.)
Даны целые положительные числа ${$`m`} и ${$`n`}.
Докажите, что во всяком частично упорядоченном множестве мощности ${$`mn + 1`} можно указать либо ${$`m + 1`} попарно несравнимых элементов, либо ${$`n + 1`} попарно сравнимых.


${problem(api)} В строчку написаны ${$`mn + 1`} различных чисел.
Докажите, что можно часть из них вычеркнуть так, чтобы осталась либо возрастающая последовательность длины ${$`m + 1`}, либо убывающая последовательность длины ${$`n + 1`}.
(Указание: можно воспользоваться предыдущей задачей.)


${problem(api)} Рассмотрим семейство всех подмножеств натурального ряда, упорядоченное по включению.
Существует ли у него линейно упорядоченное (в индуцированном порядке) подсемейство мощности континуум?
Существует ли у него подсемейство мощности континуум, любые два элемента которого несравнимы?


Элемент частично упорядоченного множества называют ${i`наибольшим`}, если он больше любого другого элемента, и ${i`максимальным`}, если не существует большего элемента.
Если множество не является линейно упорядоченным, то это не одно и то же: наибольший элемент автоматически является максимальным, но не наоборот.
(Одно дело коробка, в которую помещается любая другая, другое — коробка, которая никуда больше не помещается.)


Легко понять, что наибольший элемент в данном частично упорядоченном множестве может быть только один, в то время как максимальных элементов может быть много.


Аналогично определяют ${i`наименьшие`} и ${i`минимальные`} элементы.


${problem(api)} Докажите, что любые два максимальных элемента не сравнимы.
Докажите, что в конечном частично упорядоченном множестве ${X} для любого элемента ${$`x`} найдётся максимальный элемент ${$`y`}, больший или равный ${$`x`}.
`;
};
