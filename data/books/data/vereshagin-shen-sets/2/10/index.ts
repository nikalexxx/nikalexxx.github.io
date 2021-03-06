import { getCustomElements } from '../../elements.js';

export default (api) => {
    const { _, text, block, control, math } = api;
    const { i, b, label } = text;
    const { start, end } = control;
    const { ul, li } = block;
    const { $ } = math;

    const {paragraph, theorem, problem, proof, A, B, X, n} = getCustomElements(api);

    const empty = '\\varnothing';
    return _`
${paragraph`Ординалы`}
Как мы уже говорили, ${i`ординалом`} называется порядковый тип вполне упорядоченного множества, то есть класс всех изоморфных ему упорядоченных множеств (естественно, они будут вполне упорядоченными).


На ординалах естественно определяется линейный порядок.
Чтобы сравнить два ординала ${$`\\alpha`} и ${$`\\beta`}, возьмём их представители ${A} и ${B}.
Применим ${label.ref('theorem_set-size')`теорему ${n.theorem('set-size')}`} и посмотрим, какой из трёх случаев
(${A} изоморфно начальному отрезку ${B}, отличному от всего ${B}; множества ${A} и ${B} изоморфны; ${B} изоморфно начальному отрезку ${A}, отличному от всего ${A}) имеет место.
В первом случае ${$`\\alpha < \\beta`}, во втором ${$`\\alpha = \\beta`}, в третьем ${$`\\alpha > \\beta`}.


Мы отвлекаемся от ${label.ref('theorem_01...')`трудностей`}, связанных с основаниями теории множеств; как формально можно оправдать наши рассуждения, мы ещё обсудим.
Пока что отметим некоторые свойства ординалов.
${start(ul)}
${start(li)}
Мы определили на ординалах линейный порядок.
Этот порядок будет полным: любое непустое семейство ординалов имеет наименьший элемент (${label.ref('theorem_min-set')`теорема ${n.theorem('min-set')}`}; разница лишь в том, что мы не употребляли там слова «ординал», а говорили о представителях).
${end(li)}
${start(li)}
Пусть ${$`\\alpha`} — некоторый ординал.
Рассмотрим начальный отрезок ${$`[0, \\alpha)`} в классе ординалов (образованный всеми ординалами, меньшими ${$`\\alpha`} в смысле указанного порядка).
Этот отрезок упорядочен по типу ${$`\\alpha`} (то есть изоморфен представителям ординала ${$`\\alpha`}).
В самом деле, пусть ${A} — один из представителей ординала ${$`\\alpha`}.
Ординалы, меньшие ${$`\\alpha`}, соответствуют собственным (не совпадающим с ${A}) начальным отрезкам множества ${A}.
Такие отрезки имеют вид ${$`[0, a)`} и тем самым находятся во взаимно однозначном соответствии с элементами множества ${A}.
(Легко проверить, что это соответствие сохраняет порядок.)


Сказанное можно переформулировать так: каждый ординал упорядочен как множество меньших ординалов.
(В одном из формальных построений теории ординалов каждый ординал равен множеству всех меньших ординалов.)
${end(li)}
${start(li)}
Ординал называется ${i`непредельным`}, если существует непосредственно предшествующий ему (в смысле указанного порядка) ординал.
Если такого нет, ординал называют ${i`предельным`}.
${end(li)}
${start(li)}
Любое ограниченное семейство ординалов имеет точную верхнюю грань
(наименьший ординал, больший или равный всем ординалам семейства).
В самом деле, возьмём какой-то ординал ${$`\\beta`}, являющийся верхней границей.
Тогда все ординалы семейства изоморфны начальным отрезкам множества ${B}, представляющего ординал ${$`\\beta`}.
Если среди этих отрезков есть само ${B}, то ${$`\\beta`} будет точной верхней гранью (и наибольшим элементом семейства).
Если нет, то эти отрезки имеют вид ${$`[0, b)`} для различных элементов ${$`b \\in B`}.
Рассмотрим множество ${$`S`} всех таких элементов ${$`b`}.
Если ${$`S`} не ограничено в ${B}, то ${$`\\beta`} будет точной верхней гранью.
Если ${$`S`} ограничено, то оно имеет точную верхнюю грань ${$`s`}, и ${$`[0, s)`} будет точной верхней гранью семейства.
${end(li)}
${end(ul)}
Можно сказать, что семейство ординалов — это как бы универсальное вполне упорядоченное семейство;
любое вполне упорядоченное множество изоморфно некоторому начальному отрезку этого семейства.
Поэтому мы немедленно придём к противоречию, если захотим рассмотреть множество всех ординалов (ведь для всякого вполне упорядоченного множества есть ещё большее — добавим к нему новый элемент, больший всех предыдущих).
Этот парадокс называется ${i`парадоксом ${label.ref('name_forti')`Бурали-Форти`}`}.


${problem`Докажите, что точная верхняя грань счётного числа счётных ординалов счётна.`}


Как же рассуждать об ординалах, не впадая в противоречия?
В принципе можно заменять утверждения об ординалах утверждениями о их представителях и воспринимать упоминания ординалов как «вольность речи».
Другой подход (предложенный ${label.ref('name_neumann')`фон Нейманом`}) применяется при аксиоматическом построении теории множеств, и состоит он примерно в следующем: мы объявляем каждый ординал равным множеству всех меньших ординалов.
Тогда минимальный ординал ${$`0`} (порядковый тип пустого множества) будет пустым множеством ${$(empty)}, следующий за ним ординал ${$`1`} (порядковый тип одноэлементного множества) будет ${$`\\{0\\} = \\{${empty}\\}`}, затем ${$`2 = \\{0, 1\\} = \\{${empty}, \\{${empty}\\}\\}, 3 = \\{0, 1, 2\\} = \\{${empty}, \\{${empty}\\}, \\{${empty}, \\{${empty}\\}\\}, 4 = \\{0, 1, 2, 3\\}`} и т.д.
За ними следует ординал ${$`\\omega`} (порядковый тип множества натуральных чисел), равный ${$`\\{0, 1, 2, 3, \\dots \\}`}, потом ${$`\\omega + 1 = \\{0, 1, 2, 3, \\dots , \\omega\\}`}, потом ${$`\\omega + 2 = \\{0, 1, 2, 3, \\dots , \\omega, \\omega + 1\\}`} и т.д.


Мы не будем говорить подробно об аксиоматической теории множеств Цермело–Френкеля, но два обстоятельства следует иметь в виду.
Во-первых, в ней нет никаких объектов, кроме множеств, и есть ${i`аксиома экстенсиональности`} (или ${i`объёмности`}), которая говорит, что два объекта, содержащие одни и те же элементы, равны.
Поэтому существует лишь один объект, не содержащий элементов (пустое множество).
Во-вторых, в ней есть ${i`аксиома фундирования`}, которая говорит, что отношение ${$`\\in`} фундировано: во всяком множестве ${X} есть элемент, являющийся ${$`\\in`}-минимальным, то есть элемент ${$`x \\in X`}, для которого ${$`X \\cap x = ${empty}`}.
Отсюда следует, что никакое множество ${$`x`} не может быть своим элементом (иначе для множества ${$`\\{x\\}`} нарушалась бы аксиома фундирования).


${problem`Выведите из аксиомы фундирования, что не существует множеств ${$`x, y, z`}, для которых ${$`x \\in y \\in z \\in x`}.`}


Философски настроенный математик обосновал бы аксиому фундирования так: множества строятся из ранее построенных множеств, начиная с пустого, и поэтому возможна индукция по построению
(доказывая какое-либо свойство множеств, можно рассуждать индуктивно и предполагать, что оно верно для всех его элементов).


Теперь можно определить ординалы так.
Будем говорить, что множество ${$`x`} ${i`транзитивно`}, если всякий элемент множества ${$`x`} является подмножеством множества ${$`x`}, то есть если из ${$`z \\in y \\in x`} следует ${$`z \\in x`}.
Назовём ${i`ординалом`} транзитивное множество, всякий элемент которого транзитивен.
Это требование гарантирует, что на элементах любого ординала отношение ${$`\\in`} является (строгим) частичным порядком.


Аксиома фундирования гарантирует, что частичный порядок ${$`\\in`} на любом ординале является фундированным.
После этого по индукции можно доказать, что он является линейным (и, следовательно, полным).


${problem`
(${b`а`}) Используя определение ординала как транзитивного множества с транзитивными элементами, докажите, что элемент ординала есть ординал.
(${b`б`}) Пусть ${$`\\alpha`} — ординал (в смысле данного нами определения).
Докажите, что отношение ${$`\\in`} на нём является частичным порядком.
(${b`в`}) Докажите, что для любых элементов ${$`a, b \\in \\alpha`} верно ровно одно из трёх соотношений: либо ${$`a \\in b`}, либо ${$`a = b`}, либо ${$`b \\in a`}.
(Указание: используйте двойную индукцию по фундированному отношению ${$`\\in`} на ${$`\\alpha`}, а также аксиому экстенсиональности.)
(${b`г`}) Докажите, что один ординал изоморфен собственному начальному отрезку другого тогда и только тогда, когда является его элементом.
(Таким образом, отношение ${$`<`} на ординалах как упорядоченных множествах совпадает с отношением принадлежности.)
Докажите, что каждый ординал является множеством всех меньших его ординалов.
`}


Заметим ещё, что если каждый ординал есть множество всех меньших его ординалов, то точная верхняя грань множества ординалов есть их объединение.


Мы не будем подробно развивать этот подход и по-прежнему будем наивно представлять себе ординалы как порядковые типы вполне упорядоченных множеств.


Прежде чем перейти к сложению и умножению ординалов, отметим такое свойство (уже упомянутое в ${label.ref('problem_subset-init')`задаче ${n.problem('subset-init')}`}):


${theorem.key('subset-ordinal')`
Пусть ${A} — подмножество вполне упорядоченного множества ${B}.
Тогда порядковый тип множества ${A} не превосходит порядкового типа множества ${B}.
`}


${proof.start}
Отметим сразу же, что равенство возможно, даже если ${A} является собственным подмножеством ${B}.
Например, чётные натуральные числа имеют тот же порядковый тип ${$`\\omega`}, что и все натуральные числа.


Рассуждая от противного, предположим, что порядковый тип множества ${A} больше.
Тогда ${B} изоморфно некоторому начальному отрезку множества ${A}, не совпадающему со всем ${A}.
Пусть ${$`a_0`} — верхняя граница (в ${A}) этого отрезка, а ${$`f: B \\to A`} — соответствующий изоморфизм.
Тогда ${$`f`} строго возрастает и потому ${$`f(b) \\geqslant b`} для всех ${$`b \\in B`} (${label.ref('theorem_f(x)>x')`теорема ${n.theorem('f(x)>x')}`}).
В частности, ${$`f(a_0) \\geqslant a_0`}, но по предположению любое значение ${$`f(b)`} меньше ${$`a_0`} — противоречие.
${proof.end}
`;
};
