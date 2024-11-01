import type { BookApi } from '@bookbox/preset-web';
import { getCustomElements } from '../../elements.js';

export default (api: BookApi) => {
    const { book, format, area, start, end, math, label } = api;
    const { i } = format;
    const $ = math;
    const $$ = math.block();

    const {paragraph, problem, theorem, proof, A, B, n, printNote} = getCustomElements(api);

    const empty = '\\varnothing';
    return book`
${paragraph`Функции`}
До сих пор мы старались ограничиваться минимумом формальностей и говорили о функциях, их аргументах, значениях, композиции и т.п. без попыток дать определения этих понятий.
Сейчас мы дадим формальные определения.


Пусть ${A} и ${B} — два множества.
Рассмотрим множество всех упорядоченных пар ${$`\\lang a, b \\rang`}, где ${$`a \\in A`} и ${$`b \\in B`}.
Это множество называется ${i`декартовым произведением`} множеств ${A} и ${B} и обозначается ${$`A \\times B`}.
(К вопросу о том, что такое ${label.ref('x->y')`упорядоченная пара`}, мы ещё вернёмся ${printNote`на с. 36.`})


Любое подмножество ${$`R`} множества ${$`A \\times B`} называется ${i`отношением`} между множествами ${A} и ${B}.
Если ${$`A = B`}, говорят о ${i`бинарном отношении`} на множестве ${A}.
Например, на множестве натуральных чисел можно рассмотреть бинарное отношение «быть делителем», обычно обозначаемое символом ${$`|`}.
Тогда можно в принципе было бы написать ${$`\\lang 2, 6 \\rang \\in |`} и ${$`\\lang 2, 7 \\rang \\notin |`}.
Обычно, однако, знак отношения пишут между объектами (например, ${$`2|6`}).


${problem`
Вопрос для самоконтроля: отношения «быть делителем» и «делиться на» — это одно и то же отношение или разные?
(Ответ: конечно, разные — в упорядоченной паре порядок существен.)
`}


Если аргументами функции являются элементы множества ${A}, а значениями — элементы множества ${B}, то можно рассмотреть отношение между ${A} и ${B}, состоящее из пар вида ${$`\\lang x, f(x) \\rang`}.
По аналогии с графиками функций на плоскости такое множество можно назвать графиком функции ${$`f`}.
С формальной точки зрения, однако, удобнее не вводить отдельного неопределяемого понятия функции, а вместо этого отождествить функцию с её графиком.


Отношение ${$`F \\sub A \\times B`} называется ${i`функцией`} из ${A} в ${B}, если оно не содержит пар с одинаковым первым членом и разными вторыми.
Другими словами, это означает, что для каждого ${$`a \\in A`} существует не более одного ${$`b \\in B`}, при котором ${$`\\lang a, b \\rang \\in F`}.


Те элементы ${$`a \\in A`}, для которых такое ${$`b`} существует, образуют ${i`область определения`} функции ${$`F`}.
Она обозначается ${$`\\mathrm{Dom}\\ F`} (от английского слова domain).
Для любого элемента ${$`a \\in \\mathrm{Dom}\\ F`} можно определить ${i`значение`} функции ${$`F`} на аргументе ${$`a`} («в точке ${$`a`}», как иногда говорят) как тот единственный элемент ${$`b \\in B`}, для которого ${$`\\lang a, b \\rang \\in F`}.
Этот элемент записывают как ${$`F(a)`}.
Все такие элементы ${$`b`} образуют ${i`множество значений`} функции ${$`F`}, которое обозначается ${$`\\mathrm{Val}\\ F`}.


Если ${$`a \\notin \\mathrm{Dom}\\ F`}, то говорят, что функция ${i`не определена`} на ${$`a`}.
Заметим, что по нашему определению функция из ${A} в ${B} не обязана быть определена на всех элементах множества ${A} — её область определения может быть любым подмножеством множества ${A}.
Симметричным образом множество её значений может не совпадать с множеством ${B}.


Если область определения функции ${$`f`} из ${A} в ${B} совпадает с ${A}, то пишут ${$`f: A \\to B`}.


Пример: ${i`тождественная`} функция ${$`id_A: A \\to A`} переводит множество ${A} в себя, причём ${$`id(a) = a`} для любого ${$`a \\in A`}.
Она представляет собой множество пар вида ${$`\\lang a, a \\rang`} для всех ${$`a \\in A`}.
(Индекс ${A} в ${$`id_A`} иногда опускают, если ясно, о каком множестве идёт речь.)


${i`Композицией`} двух функций ${$`f: A \\to B`} и ${$`g: B \\to C`} называют функцию ${$`h: A \\to C`}, определённую соотношением ${$`h(x) = g(f(x))`}.
Другими словами, ${$`h`} представляет собой множество пар
${$$`
\\{\\lang a, c \\rang \\ | \\ \\lang a, b \\rang \\in f \\ \\text{и} \\ \\lang b, c \\rang \\in g \\ \\text{для некоторого} \\ b \\in B\\}.
`}
Композиция функций обозначается ${$`g \\circ f`} (мы, как и в большинстве книг, пишем справа функцию, которая применяется первой).


Очевидно, композиция (как операция над функциями) ассоциативна, то есть ${$`h \\circ (f \\circ g) = (h \\circ f) \\circ g`}, поэтому в композиции нескольких подряд идущих функций можно опускать скобки.


Пусть ${$`f: A \\to B`}.
${i`Прообразом`} подмножества ${$`B' \\sub B`} называется множество всех элементов ${$`x \\in A`}, для которых ${$`f(x) \\in B'`}.
Оно обозначается ${$`f^{-1}(B')`}:
${$$`
f^{-1}(B') = \\{x \\in A \\ | \\ f(x) \\in B'\\}.
`}
${i`Образом`} множества ${$`A' \\sub A`} называется множество всех значений функции ${$`f`} на всех элементах множества ${$`A'`}.
Оно обозначается ${$`f(A')`}:
${$$`
f(A') = \\{f(a) \\ | \\ a \\in A'\\} = \\{b \\in B \\ | \\ \\lang a, b \\rang \\in f \\ \\text{для некоторого} \\ a \\in A'\\}.
`}
Строго говоря, обозначение ${$`f(A')`} может привести к путанице (одни и те же круглые скобки употребляются и для значения функции, и для образа множества), но обычно ясно, что имеется в виду.


${problem`
Какие из следующих равенств верны?
${$$`
\\begin{aligned}
f(A' \\cap A'') &= f(A') \\cup f(A''); \\\\
f(A' \\cup A'') &= f(A') \\cup f(A''); \\\\
f(A' \\setminus A'') &= f(A') \\setminus f(A''); \\\\
f^{-1}(B' \\cap B'') &= f^{-1}(B') \\cap f^{-1}(B''); \\\\
f^{-1}(B' \\cup B'') &= f^{-1}(B') \\cup f^{-1}(B''); \\\\
f^{-1}(B' \\setminus B'') &= f^{-1}(B') \\setminus f^{-1}(B''); \\\\
f^{-1}(f(A')) &\\subset A'; \\\\
f^{-1}(f(A')) &\\supset A'; \\\\
f(f^{-1}(B')) &\\subset B'; \\\\
f(f^{-1}(B')) &\\supset B'; \\\\
(g \\circ f)(A) &= g(f(A)); \\\\
(g \\circ f)^{-1}(C') &= f^{-1}(g^{-1}(C'));
\\end{aligned}
`}
(Здесь ${$`f: A \\to B, g: B \\to C, A', A'' \\sub A, B', B'' \\sub B, C' \\sub C`}.)
`}


Иногда вместо функций говорят об отображениях (резервируя термин «функция» для отображений с числовыми аргументами и значениями).
Мы не будем строго придерживаться таких различий, употребляя слова «отображение» и «функция» как синонимы.


Функция ${$`f: A \\to B`} называется ${i`инъективной`}, или ${i`инъекцией`}, или ${i`вложением`}, если она переводит разные элементы в разные, то есть если ${$`f(a_1) \\not = f(a_2)`} при различных ${$`a_1`} и ${$`a_2`}.


Функция ${$`f: A \\to B`} называется ${i`сюръективной`}, или ${i`сюръекцией`}, или ${i`наложением`}, если множество её значений есть всё ${B}.
(Иногда такие функции называют ${i`отображениями`} на ${B}.)


Эти два определения более симметричны, чем может показаться на первый взгляд, как показывают такие задачи:


${problem`
Докажите, что функция ${$`f: A \\to B`} является вложением тогда и только тогда, когда она имеет ${i`левую обратную`} функцию ${$`g: B \\to A`}, то есть функцию ${$`g`}, для которой ${$`g \\circ f = id_A`}.
Докажите, что функция ${$`f: A \\to B`} является наложением тогда и только тогда, когда она имеет ${i`правую обратную`} функцию ${$`g: B \\to A`}, для которой ${$`f \\circ g = id_B`}.
`}


${problem`
Докажите, что функция ${$`f: A \\to B`} является вложением тогда и только тогда, когда на неё можно сокращать слева: из равенства ${$`f \\circ g_1 = f \\circ g_2`} следует равенство ${$`g_1 = g_2`}
(для любых функций ${$`g_1`}, ${$`g_2`}, области значений которых содержатся в ${A}).
Докажите, что функция ${$`f: A \\to B`} является наложением тогда и только тогда, когда на неё можно сокращать справа: из равенства ${$`g_1 \\circ f = g_2 \\circ f`} следует равенство ${$`g_1 = g_2`}
(для любых функций ${$`g_1`}, ${$`g_2`}, область определения которых есть ${B}).
`}


Отображение (функция) ${$`f: A \\to B`}, которое одновременно является инъекцией и сюръекцией (вложением и наложением), называется ${i`биекцией`}, или взаимно однозначным соответствием.


Если ${$`f`} — биекция, то существует обратная функция ${$`f^{-1}`}, для которой ${$`f^{-1}(y) = x \\lrArr f(x) = y`}.


${problem`Могут ли для некоторой функции левая и правая обратные существовать, но быть различны?`}


Напомним, что множества ${A} и ${B} равномощны, если существует биекция ${$`f: A \\to B`}.
В каком случае существует инъекция (вложение) ${$`f: A \\to B`}?
Легко понять, что вложение является взаимно однозначным соответствием между ${A} и некоторым подмножеством множества ${B}, поэтому такое вложение существует тогда и только тогда, когда в ${B} есть подмножество, равномощное ${A}, т. е. когда мощность ${A} не превосходит мощности ${B} (в смысле определения, данного ${label.ref('theorem_<>=')`ранее`}).


Чуть менее очевиден другой результат: наложение ${A} на ${B} существует тогда и только тогда, когда мощность ${B} не превосходит мощности ${A}.


В самом деле, пусть наложение ${$`f: A \\to B`} существует.
Для каждого элемента ${$`b \\in B`} найдётся хотя бы один элемент ${$`a \\in A`}, для которого ${$`f(a) = b`}.
Выбрав по одному такому элементу, мы получим подмножество ${$`A' \\subset A`}, которое находится во взаимно однозначном соответствии с множеством ${B}.
(Здесь снова используется ${label.ref('choice-axiom')`аксиома выбора`} ${printNote`, о которой мы говорили на с. 14.`})


В обратную сторону: если какое-то подмножество ${$`A'`} множества ${A} равномощно множеству ${B} и имеется биекция ${$`g: A' \\to B`}, то наложение ${A} на ${B} можно получить, доопределив эту биекцию на элементах вне ${$`A'`} каким угодно образом.


${problem`Найдите ошибку в этом рассуждении, не читая дальше.`}


На самом деле такое продолжение возможно, только если ${B} непусто, так что правильное утверждение звучит так: наложение ${A} на ${B} существует только и только тогда, когда ${B} непусто и равномощно некоторому подмножеству ${A}, или когда оба множества пусты.

${start(area.key('x->y'))}
В нашем изложении остаётся ещё один не вполне понятный момент: что такое «упорядоченная пара»?
Неформально говоря, это способ из двух объектов ${$`x`} и ${$`y`} образовать один объект ${$`\\lang x, y \\rang`}, причём этот способ обладает таким свойством:
${$$`
\\lang x_1, y_1 \\rang = \\lang x_2, y_2 \\rang \\lrArr x_1 = x_2 \\ \\text{и} \\ y_1 = y_2.
`}
${end(area)}
В принципе, можно так и считать понятие упорядоченной пары неопределяемым, а это свойство — аксиомой.
Однако при формальном построении теории множеств удобно использовать трюк, придуманный польским математиком ${label.ref('name_kuratowski')`Куратовским`}, и избежать появления отдельного понятия упорядоченной пары.
Прежде чем описывать этот трюк, напомним, что ${$`\\{x\\}`} обозначает множество, единственным элементом которого является ${$`x`}, а ${$`\\{x, y\\}`} обозначает множество, которое содержит ${$`x`} и ${$`y`} и не содержит других элементов.
Тем самым ${$`\\{x, y\\} = \\{x\\} = \\{y\\}`}, если ${$`x = y`}.


${theorem.key('(x)-(x-y)').name('Упорядоченная пара по Куратовскому')`
Определим ${$`\\lang x, y \\rang`} как ${$`\\{\\{x\\}, \\{x, y\\}\\}`}.
Тогда выполнено указанное выше свойство:
${$$`
\\lang x_1, y_1 \\rang = \\lang x_2, y_2 \\rang \\lrArr x_1 = x_2 \\ \\text{и} \\ y_1 = y_2.
`}
`}
${proof.start}
В одну сторону это очевидно: если ${$`x_1 = x_2`} и ${$`y_1 = y_2`}, то ${$`\\lang x_1, y_1 \\rang = \\lang x_2, y_2 \\rang`}.
В другую сторону: пусть ${$`\\lang x_1, y_1 \\rang = \\lang x_2, y_2 \\rang`}.
По определению это означает, что
${$$`
\\{\\{x_1\\}, \\{x_1, y_1\\}\\} = \\{\\{x_2\\}, \\{x_2, y_2\\}\\}.
`}
Теперь нужно аккуратно разобрать случаи (не путая при этом ${$`x`} с ${$`\\{x\\}`}).
Это удобно делать в следующем порядке.
Пусть сначала ${$`x_1 \\not = y_1`}.
Тогда множество ${$`\\{x_1, y_1\\}`} состоит из двух элементов.
Раз оно принадлежит левой части равенства, то принадлежит и правой.
Значит, оно равно либо ${$`\\{x_2\\}`}, либо ${$`\\{x_2, y_2\\}`}.
Первое невозможно, так как двухэлементное множество не может быть равно одноэлементному.
Значит, ${$`\\{x_1, y_1\\} = \\{x_2, y_2\\}`}.
С другой стороны, одноэлементное множество ${$`\\{x_1\\}`} принадлежит левой части равенства, поэтому оно принадлежит и правой, и потому равно ${$`\\{x_2\\}`} (поскольку не может быть равно двухэлементному).
Отсюда ${$`x_1 = x_2`} и ${$`y_1 = y_2`}, что и требовалось.


Аналогично разбирается симметричный случай, когда ${$`x_2 \\not = y_2`}.


Осталось рассмотреть ситуацию, когда ${$`x_1 = y_1`} и ${$`x_2 = y_2`}.
В этом случае ${$`\\{x_1, y_1\\} = \\{x_1\\}`} и потому левая часть данного нам равенства есть ${$`\\{\\{x_1\\}\\}`}.
Аналогичным образом, правая его часть есть ${$`\\{\\{x_2\\}\\}`}, и потому ${$`x_1 = x_2`}, так что все четыре элемента ${$`x_1, x_2, y_1, y_2`} совпадают.
${proof.end}


Заметим, что возможны и другие определения упорядоченной пары, для которых аналогичное утверждение верно, так что никакого «философского смысла» в этом определении нет — это просто удобный технический приём.


${problem`
Докажите утверждение ${label.ref('theorem_(x)-(x-y)')`теоремы ${n.theorem('(x)-(x-y)')}`} для ${i`упорядоченной пары по ${label.ref('name_wiener')`Винеру`}`}: ${$`\\lang x, y \\rang = \\{\\{${empty}, \\{x\\}\\}, \\{\\{y\\}\\}\\}`}.`}
`;
};
