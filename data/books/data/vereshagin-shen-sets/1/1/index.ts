import { getCustomElements } from '../../elements.js';

export default (api) => {
    const { _, text, block, control, math } = api;
    const { i, b, link, label } = text;
    const { start, end } = control;
    const { ul, li, area } = block;
    const { $, $$ } = math;

    const {problem, paragraph, A, B, C, n} = getCustomElements(api);
    const empty = '\\varnothing';
    const simdiff = '\\vartriangle';
    return _`
${paragraph`Множества`}
Основные понятия и обозначения, связанные с множествами и операциями над ними:
${start(ul)}
${li(_`
${i`Множества`} состоят из ${i`элементов`}. Запись ${$`x \\in M`} означает, что ${$`x`} является элементом множества ${$`M`}.
`)}
${li(_`
Говорят, что множество ${A} является ${i`подмножеством`} множества ${B} (запись: ${$`A \\sub B`}), если все элементы ${A} являются элементами ${B}.
`)}
${li(_`
Множества ${A} и ${B} ${i`равны`} (запись: ${$`A = B`}), если они содержат
одни и те же элементы (другими словами, если ${$`A \\sub B`} и ${$`B \\sub A`}).
`)}
${li(_`
Если ${A} — подмножество ${B}, не равное всему ${B}, то ${A} называют
${i`собственным`} подмножеством ${B} (запись: ${$`A \\subsetneq B`}).
`)}
${li(_`
${i`Пустое`} множество ${$`\\varnothing`} не содержит ни одного элемента и является подмножеством любого множества.
`)}
${li(_`
${i`Пересечение`} ${$`A \\cap B`} двух множеств ${A} и ${B} состоит из элементов, которые принадлежат обоим множествам ${A} и ${B}.
Это записывают так:
${$$`A \\cap B = \\{x\\, | \\, x \\in A \\, \\text{и} \\, x \\in B\\}`}
(читается: множество таких ${$`x`}, что ${$`\\dots`}).
`)}
${li(_`
${i`Объединение`} ${$`A \\cup B`} состоит из элементов, которые принадлежат
хотя бы одному из множеств ${A} и ${B}:
${$$`A \\cup B = \\{x\\, | \\, x \\in A \\, \\text{или} \\, x \\in B\\}`}
`)}
${li(_`
${i`Разность`} ${$`A \\setminus B`} состоит из элементов, которые принадлежат ${A},
но не принадлежат ${B}:
${$$`A \\setminus B = \\{x\\, | \\, x \\in A \\, \\text{и} \\, x \\notin B\\}`}
Если множество ${B} является подмножеством множества ${A}, разность ${$`A \\setminus B`} называют также ${i`дополнением`} ${B} до ${A}.
`)}
${li(_`
${i`Симметрическая разность`} ${$`A \\vartriangle B`} состоит из элементов, которые принадлежат ровно одному из множеств ${A} и ${B}:
${$$`A \\vartriangle B = (A \\setminus B) \\cup (B \\setminus A) = (A \\cup B) \\setminus (A \\cap B).`}
`)}
${li(_`
Через ${$`\\{a, b, c\\}`} обозначается множество, которое содержит элементы ${$`a, b, c`} и не содержит других.
Если среди ${$`a, b, c`} есть равные, оно может содержать один или два элемента.
Подобное обозначение используется и в менее формальных ситуациях: множество членов последовательности ${$`a_0, a_1, \\dots`} обозначается ${$`\\{a_0, a_1, \\dots\\}`} или даже ${$`\\{a_i\\}`}.
Более аккуратная запись для того же множества такова: ${$`\\{a_i\\, | \\,i \\in \\N\\}`}, где
${start(area.key('set.N').inline(true))}
${$`\\N`} — множество натуральных чисел ${$`\\{0, 1, 2, \\dots\\}`}
${end(area)}
.
`)}
${end(ul)}

Понятие множества появилось в математике сравнительно недавно, в конце 19-го века, в связи с работами ${label.ref('name_cantor')`Кантора`} (сравнение мощностей множеств), о которых пойдёт речь дальше (раздел ${link.ref('paragraph_equivalence-order')`${n.paragraph('equivalence-order')}`} и следующие).
Некоторое время назад этот язык пытались внедрить в школьное преподавание, объясняя ученикам, что у уравнения ${$`x^2 + 1 = 0`} есть множество решений (впрочем, пустое), что множество решений системы уравнений есть пересечение множеств решений каждого из них (а для «совокупности» уравнений — объединение),
что в множестве ${$`\\{2, 2, 3\\}`} не три элемента, а два,
и оно равно множеству ${$`\\{2, 3\\}`}, что ${$`${empty}`}, ${$`\\{${empty}\\}`} и ${$`\\{${empty}, \\{${empty}\\}\\}`} — это три совершенно разных множества и т. д.
Но всё равно большинство школьников так и не поняло, почему множество решений уравнения ${$`x^2 = 4`} можно записывать как ${$`\\{-2, 2\\}`}, а множество решений уравнения ${$`x^2 = -4`} нельзя записывать как ${$`\\{${empty}\\}`} (а надо писать ${$`${empty}`}).
Отметим кстати ещё два расхождения: в школе натуральные числа начинаются с единицы, а в некоторых книжках — с нуля (мы тоже будем называть нуль натуральным числом).
Кроме того, иногда вместо ${$`\\sub`} пишут ${$`\\sube`}, используя ${$`\\sub`} для собственных подмножеств (вместо нашего ${$`\\subsetneq`}).


Мы предполагаем, что перечисленные выше основные понятия теории множеств более или менее вам знакомы, и будем достаточно свободно ими пользоваться.
Вот несколько задач для самоконтроля;
надеемся, что большинство из них не представит для вас большого труда.


${problem`
Старейший математик среди шахматистов и старейший шахматист среди математиков — это один или тот же человек или (возможно) разные?
`}


${problem`
Лучший математик среди шахматистов и лучший шахматист среди математиков — это один или тот же человек или (возможно) разные?
`}


${problem`
Каждый десятый математик — шахматист, а каждый шестой шахматист — математик. Кого больше — математиков или шахматистов — и во сколько раз?
`}


${problem`
Существуют ли такие множества ${A}, ${B} и ${C}, что ${$`A \\cap B \\not = ${empty}`}, ${$`A \\cap C = ${empty}`} и ${$`(A \\cap B) \\setminus C = ${empty}`}?
`}


${problem`
Какие из равенств
(${b`а`}) ${$`(A \\cap B) \\cup C = (A \\cup C) \\cap (B \\cup C)`};
(${b`б`}) ${$`(A \\cup B) \\cap C = (A \\cap C) \\cup (B \\cap C)`};
(${b`в`}) ${$`(A \\cup B) \\setminus C = (A \\setminus C) \\cup B`};
(${b`г`}) ${$`(A \\cap B) \\setminus C = (A \\setminus C) \\cap B`};
(${b`д`}) ${$`A \\setminus (B \\cup C) = (A \\setminus B) \\cap (A \\setminus C)`};
(${b`е`}) ${$`A \\setminus (B \\cap C) = (A \\setminus B) \\cup (A \\setminus C)`} верны для любых множеств ${A}, ${B}, ${C}?
`}


${problem`
Проведите подробное доказательство верных равенств предыдущей задачи, исходя из определений.
(Докажем, что множества в левой и правой частях равны. Пусть ${$`x`} — любой элемент левой части равенства.
Тогда ${$`\\dots`}
Поэтому ${$`x`} входит в правую часть.
Обратно, пусть ${$`\\dots`} )
Приведите контрпримеры к неверным равенствам.
`}


${problem`
Докажите, что операция «симметрическая разность» ассоциативна: ${$`A ${simdiff} (B ${simdiff} C) = (A ${simdiff} B) ${simdiff} C`} для любых ${A}, ${B} и ${C}.
(Указание: сложение по модулю 2 ассоциативно.)
`}


${problem`
Докажите, что ${$`(A_1 \\cap \\dots \\cap A_n) ${simdiff} (B_1 \\cap \\dots \\cap B_n) \\in (A_1 ${simdiff} B_1) \\cup \\dots \\cup (A_n ${simdiff} B_n)`} для любых множеств ${$`A_1, \\dots\\ , A_n`} и ${$`B_1, \\dots\\ , B_n`}.
`}


${problem`
Докажите, что если какое-то равенство (содержащее переменные для множеств и операции ${$`\\cap , \\cup , \\setminus`}) неверно, то можно найти контрпример к нему, в котором множества пусты или состоят из одного элемента.
`}


${problem`
Сколько различных выражений для множеств можно составить из переменных ${A} и ${B} с помощью (многократно используемых) операций пересечения, объединения и разности?
(Два выражения считаются одинаковыми, если они равны при любых значениях переменных.)
Тот же вопрос для трёх множеств и для ${$`n`} множеств.
(Ответ в общем случае: ${$`2^{2^n - 1}`}.)
`}


${problem`
Тот же вопрос, если используются только операции ${$`\\cup`} и ${$`\\cap`}.
(Для двух и трёх переменных это число несложно подсчитать, но общей формулы для ${$`n`} переменных не известно.
Эту задачу называют также задачей о числе монотонных булевых функций от ${$`n`} аргументов.)
`}


${problem`Сколько существует подмножеств у ${$`n`}-элементного множества?`}


${problem`
Пусть множество ${A} содержит ${$`n`} элементов, а его подмножество ${B} содержит ${$`k`} элементов.
Сколько существует множеств ${C}, для которых ${$`B \\sub C \\sub A`}?
`}


${problem.key('max-sub-size')`
Множество ${$`U`} содержит ${$`2n`} элементов.
В нём выделено ${$`k`} подмножеств, причём ни одно из них не является подмножеством другого.
Каково может быть максимальное значение числа ${$`k`}?
(Указание. Максимум достигается, когда все подмножества имеют по ${$`n`} элементов.
В самом деле, представим себе, что мы начинаем с пустого множества и добавляем по одному элементу, пока не получится множество ${$`U`}.
В ходе такого процесса может появиться не более одного выделенного множества;
с другой стороны, можно подсчитать математическое ожидание числа выделенных множеств по линейности; вероятность пройти через данное множество ${$`Z \\sub U`} минимальна, когда ${$`Z`} содержит ${$`n`} элементов, поскольку все множества данного размера равновероятны.)
`}
`;
};