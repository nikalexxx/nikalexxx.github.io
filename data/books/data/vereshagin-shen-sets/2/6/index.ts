import { getCustomElements } from '../../elements.js';

export default (api) => {
    const { _, text, block, control, math } = api;
    const { i, b, label } = text;
    const { start, end } = control;
    const { area } = block;
    const { $, $$ } = math;

    const {paragraph, theorem, problem, proof, A, B, C, n} = getCustomElements(api);

    const empty = '\\varnothing';
    return _`
${paragraph`Теорема Цермело`}
${theorem.key('set-order').name('Цермело')`Всякое множество может быть вполне упорядочено.`}


${proof.start}
Доказательство этой теоремы существенно использует аксиому выбора и вызывало большие нарекания своей неконструктивностью.
На счётных множествах полный порядок указать легко (перенеся с ${$`\\N`}).
Но уже на множестве действительных чисел никакого конкретного полного порядка указать не удаётся, и доказав (с помощью аксиомы выбора) его существование, мы так и не можем себе этот порядок представить.


Объясним, в какой форме используется аксиома выбора.
Пусть ${A} — данное нам множество.
Мы принимаем, что существует функция ${$`\\varphi`}, определённая на всех подмножествах множества ${A}, кроме самого´ ${A}, которая указывает один из элементов вне этого подмножества:
${$$`
X \\subsetneq A \\rArr \\varphi(X) \\in A \\setminus X.
`}
После того как такая функция фиксирована, можно построить полный порядок на ${A}, и в этом построении уже нет никакой неоднозначности.
Вот как это делается.


Наименьшим элементом множества ${A} мы объявим элемент ${$`a_0 = \\varphi(${empty})`}.
За ним идёт элемент ${$`a_1 = \\varphi(\\{a_0\\})`};
по построению он отличается от ${$`a_0`}.
Далее следует элемент ${$`a_2 = \\varphi(\\{a_0, a_1\\})`}.
Если множество ${A} бесконечно, то такой процесс можно продолжать и получить последовательность ${$`\\{a_0, a_1, \\dots \\}`} элементов множества ${A}.
Если после этого остаются ещё не использованные элементы множества ${A}, рассмотрим элемент ${$`a_{\\omega} = \\varphi(\\{a_0, a_1, a_2, \\dots \\})`} и так будем продолжать, пока всё ${A} не кончится;
когда оно кончится, порядок выбора элементов и будет полным порядком на ${A}.


Конечно, последняя фраза нуждается в уточнении — что значит «так будем продолжать»?
Возникает желание применить теорему о трансфинитной рекурсии
(у нас очень похожая ситуация: следующий элемент определяется рекурсивно, если известны все предыдущие).
И это можно сделать, если у нас есть другое вполне упорядоченное множество ${B}, и получить взаимно однозначное соответствие либо между ${A} и частью ${B}, либо между ${B} и частью ${A}.
В первом случае всё хорошо, но для этого надо иметь вполне упорядоченное множество ${B} по крайней мере той же мощности, что и ${A}, так что получается некий порочный круг.


Тем не менее из него можно выйти.
Мы сделаем это так: рассмотрим все потенциальные кусочки будущего порядка и убедимся, что их можно склеить.


Пусть ${$`(S, \\leqslant_S)`} — некоторое подмножество множества ${A} и заданный на нём порядок.
Будем говорить, что ${$`(S, \\leqslant_S)`} является ${i`корректным фрагментом`}, если оно является вполне упорядоченным множеством, причём ${$`s = \\varphi([0, s))`} для любого ${$`s \\in S`}.
Здесь ${$`[0, s)`} — начальный отрезок множества ${$`S`}, состоящий из всех элементов, меньших ${$`s`} с точки зрения заданного на ${$`S`} порядка.


Например, множество ${$`\\{\\varphi(${empty})\\}`} является корректным фрагментом
(порядок здесь можно не указывать, так как элемент всего один).
Множество ${$`\\{\\varphi(${empty}), \\varphi(\\{\\varphi(${empty})\\})\\}`}
(первый из выписанных элементов считается меньшим второго) также является корректным фрагментом.
Это построение можно продолжать и дальше, но нам надо каким-то образом «перескочить» через бесконечное (и очень большое в смысле мощности) число шагов этой конструкции.


План такой: мы докажем, что любые два корректных фрагмента в определённом смысле согласованы, после чего рассмотреть объединение всех корректных фрагментов.
Оно будет корректным и будет совпадать со всем множеством ${$`A`}
(в противном случае его можно было бы расширить и получить корректный фрагмент, не вошедший в объединение).


${start(area.key('theorem_set-order-l_1'))}
${b`Лемма 1`}. Пусть ${$`(S, \\leqslant_S)`} и ${$`(T, \\leqslant_T)`} — два корректных фрагмента.
Тогда один из них является начальным отрезком другого, причём порядки согласованы
(два общих элемента всё равно как сравнивать — в смысле ${$`\\leqslant_S`} или в смысле ${$`\\leqslant_T`}).
${end(area)}


Заметим, что по ${label.ref('theorem_A<>B')`теореме ${n.theorem('A<>B')}`} один из фрагментов изоморфен начальному отрезку другого.
Пусть ${$`S`} изоморфен начальному отрезку ${$`T`} и ${$`h: S \\to T`} — их изоморфизм.
Лемма утверждает, что изоморфизм ${$`h`} является тождественным, то есть что ${$`h(x) = x`} при всех ${$`x \\in S`}.
Докажем это индукцией по ${$`x \\in S`}
(это законно, так как ${$`S`} вполне упорядочено по определению корректного фрагмента).
Индуктивное предположение гарантирует, что ${$`h(y) = y`} для всех ${$`y < x`}.
Мы хотим доказать, что ${$`h(x) = x`}.
Рассмотрим начальные отрезки ${$`[0, x)_S`} и ${$`[0, h(x))_T`}
(с точки зрения порядков ${$`\\leqslant_S`} и ${$`\\leqslant_T`} соответственно).
Они соответствуют друг другу при изоморфизме ${$`h`}, поэтому по предположению индукции совпадают как множества.
Но по определению корректности ${$`x = \\varphi([0, x))`} и ${$`h(x) = \\varphi([0, h(x)))`}, так что ${$`x = h(x)`}.
Лемма 1 доказана.


${start(area.key('theorem_set-order-l_2'))}
Рассмотрим объединение всех корректных фрагментов (как множеств).
На этом объединении естественно определён линейный порядок: для всяких двух элементов найдётся фрагмент, которому они оба принадлежат (каждый принадлежит своему, возьмём больший из фрагментов), так что их можно сравнить.
По ${label.ref('theorem_set-order-l_1')`лемме 1`} порядок не зависит от того, какой фрагмент будет выбран для сравнения.


${b`Лемма 2`}. Это объединение будет корректным фрагментом.
${end(area)}


Чтобы доказать лемму 2, заметим, что на этом объединении определён линейный порядок.
Он будет полным.
Для разнообразия объясним это в терминах убывающих (невозрастающих) последовательностей.
Пусть ${$`x_0 \\geqslant x_1 \\geqslant \\dots`}; возьмём корректный фрагмент ${$`F`}, которому принадлежит ${$`x_0`}.
Из ${label.ref('theorem_set-order-l_1')`леммы 1`} следует, что все ${$`x_i`} также принадлежат этому фрагменту
(поскольку фрагмент ${$`F`} будет начальным отрезком в любом большем фрагменте),
а ${$`F`} вполне упорядочен по определению, так что последовательность стабилизируется.
Лемма 2 доказана.


Утверждение ${label.ref('theorem_set-order-l_2')`леммы 2`} можно переформулировать таким образом: существует наибольший корректный фрагмент.
Осталось доказать, что этот фрагмент (обозначим его ${$`S`}) включает в себя всё множество ${A}.
Если ${$`S \\not = A`}, возьмём элемент ${$`a = \\varphi(S)`}, не принадлежащий ${$`S`}, и добавим его к ${$`S`}, считая, что он больше всех элементов ${$`S`}.
Полученное упорядоченное множество ${$`S'`} (сумма ${$`S`} и одноэлементного множества) будет, очевидно, вполне упорядочено.
Кроме того, условие корректности также выполнено
(для ${$`a`} — по построению, для остальных элементов — поскольку оно было выполнено в ${$`S`}).
Таким образом, мы построили больший корректный фрагмент, что противоречит максимальности ${$`S`}.
Это рассуждение завершает доказательство теоремы Цермело.
${proof.end}


Как мы уже говорили, из ${label.ref('theorem_set-order')`теоремы Цермело`} и ${label.ref('theorem_A<>B')`теоремы ${n.theorem('A<>B')}`} о сравнении вполне упорядоченных множеств немедленно вытекает такое утверждение:


${theorem.key('set=subset')`Из любых двух множеств одно равномощно подмножеству другого.`}


${problem.key('proof-<>=')`
Докажите ${label.ref('theorem_<>=')`теорему Кантора–Бернштейна (теорема ${n.theorem('<>=')})`}, используя ${label.ref('theorem_set-order')`теорему Цермело`} и ${label.ref('theorem_A<>B')`теорему ${n.theorem('A<>B')}`}.
(Указание. Достаточно доказать, что если ${$`A \\sub B \\sub C`} и ${A} равномощно ${C}, то все три множества равномощны.
Можно считать, что ${C} вполне упорядочено и является кардиналом.
${label.ref('problem_subset-init')`Задача ${n.problem('subset-init')}`} позволяет считать ${B} начальным отрезком ${C}, а ${A} — начальным отрезком ${B}, и тогда оба этих отрезка должны совпасть со всем ${C}.)
`}


Понятие вполне упорядоченного множества ввёл ${label.ref('name_cantor')`Кантор`} в работе 1883 года;
в его итоговой работе 1895 – 1897 годов приводится доказательство того, что любые два вполне упорядоченных множества сравнимы
(одно изоморфно начальному отрезку другого).


Утверждения о возможности полного упорядочения любого множества и о сравнении мощностей (теоремы ${label.ref('theorem_set-order')`${n.theorem('set-order')}`} и ${label.ref('theorem_set=subset')`n ${n.theorem('set=subset')}`}) неоднократно встречаются в работах Кантора, но никакого внятного доказательства он не предложил, и оно было дано лишь в 1904 году немецким математиком ${label.ref('name_zermelo')`Э. Цермело`}.
`;
};