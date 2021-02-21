import { getCustomElements } from '../../elements.js';

export default (api) => {
    const { _, text, block, control, math } = api;
    const { label, link } = text;
    const { start, end } = control;
    const { ul, li, area } = block;
    const { $ } = math;

    const {paragraph, problem, A, B, n} = getCustomElements(api);

    return _`
${paragraph`Арифметика ординалов`}
Мы определили сумму и произведение линейно упорядоченных множеств в разделе ${link.ref('paragraph_equivalence-order')`${n.paragraph('equivalence-order')}`}.
(Напомним, что в ${$`A + B`} элементы ${A} предшествуют элементам ${B}, а в ${$`A \\times B`} мы сначала сравниваем ${B}-компоненты пар, а в случае их равенства — ${A}-компоненты.)


Легко проверить следующие свойства сложения:
${start(ul)}
${li(_`
Сложение ассоциативно: ${$`\\alpha + (\\beta + \\gamma) = (\\alpha + \\beta) + \\gamma`}.
`)}
${li(_`
Сложение не коммутативно: например, ${$`1 + \\omega = \\omega`}, но ${$`\\omega + 1 \\not = \\omega`}.
`)}
${li(_`
Очевидно, ${$`\\alpha + 0 = 0 + \\alpha = \\alpha`}.
`)}
${li(_`
Сумма возрастает при росте второго аргумента: если ${$`\\beta_1 < \\beta_2`}, то ${$`\\alpha + \\beta_1 < \\alpha + \\beta_2`}.
(В самом деле, пусть ${$`\\beta_1`} изоморфно начальному отрезку в ${$`\\beta_2`}, отличному от всего ${$`\\beta_2`}.
Добавим к этому изоморфизму тождественное отображение на ${$`\\alpha`} и получим изоморфизм между ${$`\\alpha + \\beta_1`} и начальным отрезком в ${$`\\alpha + \\beta_2`}, отличным от ${$`\\alpha + \\beta_2`}.)
`)}
${li(_`
Сумма неубывает при росте первого аргумента: если ${$`\\alpha_1 < \\alpha_2`}, то ${$`\\alpha_1 + \\beta \\leqslant \\alpha_2 + \\beta`}.
(В самом деле, ${$`\\alpha_1 + \\beta`} изоморфно подмножеству в ${$`\\alpha_2 +\\beta`}.
Это подмножество не является начальным отрезком, но мы можем воспользоваться ${label.ref('theorem_subset-ordinal')`теоремой ${n.theorem('subset-ordinal')}`}.)
`)}
${li(_`
Определение суммы согласовано с обозначением ${$`\\alpha + 1`} для следующего за ${$`\\alpha`} ординала.
(Здесь ${$`1`} — порядковый тип одноэлементного множества.)
Следующим за ${$`\\alpha + 1`} ординалом будет ординал ${$`(\\alpha + 1) + 1 = \\alpha + (1 + 1) = \\alpha + 2`} и т.д.
`)}
${li(_`
Если ${$`\\alpha \\geqslant \\beta`}, то существует единственный ординал ${$`\\gamma`}, для которого ${$`\\beta + \\gamma = \\alpha`}.
(В самом деле, ${$`\\beta`} изоморфно начальному отрезку в ${$`\\alpha`}; оставшаяся часть ${$`\\alpha`} и будет искомым ординалом ${$`\\gamma`}.
Единственность следует из монотонности сложения по второму аргументу.)
Заметим, что эту операцию можно называть «вычитанием слева».
`)}
${li(_`
«Вычитание справа», напротив, возможно не всегда.
Пусть ${$`\\alpha`} — некоторый ординал.
Тогда уравнение ${$`\\beta + 1 = \\alpha`} (относительно ${$`\\beta`}) имеет решение тогда и только тогда, когда ${$`\\alpha`} — непредельный ординал, (т.е. когда ${$`\\alpha`} имеет наибольший элемент).
`)}
${end(ul)}
Определение суммы двух ординалов в силу ассоциативности можно распространить на любое конечное число ординалов.
Можно определить и сумму ${$`\\alpha_1 + \\alpha_2 + \\dots`} счётной последовательности ординалов (элементы ${$`\\alpha_i`} предшествуют элементам ${$`\\alpha_j`} при ${$`i < j`}; внутри каждого ${$`\\alpha_i`} порядок прежний).
Как легко проверить, это множество действительно будет вполне упорядоченным: чтобы найти минимальный элемент в его подмножестве, рассмотрим компоненты, которые это подмножество задевает, выберем из них компоненту с наименьшим номером и воспользуемся её полной упорядоченностью.


В этом построении можно заменить натуральные числа на элементы произвольного вполне упорядоченного множества ${$`I`} и определить сумму ${$`\\sum A_i`} семейства вполне упорядоченных множеств ${$`A_i`}, индексированного элементами ${$`I`}, как порядковый тип множества всех пар вида ${$`\\lang a, i \\rang`}, для которых ${$`a \\in A_i`}.
При сравнении пар сравниваются вторые компоненты, а в случае равенства и первые (в соответствующем ${$`A_i`}).
Если все ${$`A_i`} изоморфны одному и тому же множеству ${A}, получаем уже известное нам определение произведения ${$`A \\times I`}.


Теперь перейдём к умножению ординалов.
${start(ul)}
${li(_`
Умножение ассоциативно: ${$`(\\alpha\\beta)\\gamma = \\alpha(\\beta\\gamma)`}.
(В самом деле, в обоих случаях по существу получается множество троек; тройки сравниваются справа налево, пока не обнаружится различие.)
`)}
${li(_`
Умножение не коммутативно: например, ${$`2 \\cdot \\omega = \\omega`}, в то время как ${$`\\omega \\cdot 2 \\not = \\omega`}.
`)}
${li(_`
Очевидно, ${$`\\alpha \\cdot 0 = 0 \\cdot \\alpha = 0`} и ${$`\\alpha \\cdot 1 = 1 \\cdot \\alpha = \\alpha`}.
`)}
${li(_`
Выполняется одно из свойств дистрибутивности: ${$`\\alpha(\\beta + \\gamma) = \\alpha\\beta + \\alpha\\gamma`} (непосредственно следует из определения).
Симметричное свойство выполнено не всегда: ${$`(1 + 1) \\cdot \\omega = \\omega \\not= \\omega + \\omega`}.
`)}
${li(_`
Произведение строго возрастает при увеличении второго множителя, если первый не равен ${$`0`}.
(Для разнообразия выведем это из ранее доказанных свойств: если ${$`\\beta_2 > \\beta_1`}, то ${$`\\beta_2 = \\beta_1 + \\delta`}, так что ${$`\\alpha\\beta_2 = \\alpha(\\beta_1 + \\delta) = \\alpha\\beta_1 + \\alpha\\delta > \\alpha\\beta_1`}.)
`)}
${li(_`
Произведение не убывает при возрастании первого множителя.
(В самом деле, если ${$`\\alpha_1 < \\alpha_2`}, то ${$`\\alpha_1\\beta`} изоморфно подмножеству ${$`\\alpha_2\\beta`}.
Это подмножество не является начальным отрезком, но можно сослаться на ${label.ref('theorem_subset-ordinal')`теорему ${n.theorem('subset-ordinal')}`}.)
`)}
${li(_`
${start(area.key('ord_lin-sum'))}
Любой ординал, меньший ${$`\\alpha\\beta`}, однозначно представим в виде ${$`\\alpha\\beta' + \\alpha'`}, где ${$`\\beta' < \\beta`} и ${$`\\alpha' < \\alpha`}.
${end(area)}


(В самом деле, пусть множества ${A} и ${B} упорядочены по типам ${$`\\alpha`} и ${$`\\beta`}.
Тогда ${$`A \\times B`} упорядочено по типу ${$`\\alpha\\beta`}.
Всякий ординал, меньший ${$`\\alpha\\beta`}, есть начальный отрезок в ${$`A \\times B`}, ограниченный некоторым элементом ${$`\\lang a, b \\rang`}.
Начальный отрезок ${$`[0, \\lang a, b \\rang)`} состоит из пар, у которых второй член меньше ${$`b`}, а также из пар, у которых второй член равен ${$`b`}, а первый меньше ${$`a`}.
Отсюда следует, что этот начальный отрезок изоморфен ${$`A \\times [0, b) + [0, a)`}, так что остаётся положить ${$`\\beta' = [0, b)`} и ${$`\\alpha' = [0, a)`}.
Теперь проверим однозначность.
Пусть ${$`\\alpha\\beta' +\\alpha' = \\alpha\\beta'' +\\alpha''`}.
Если ${$`\\beta' = \\beta''`}, то можно воспользоваться однозначностью левого вычитания и получить, что ${$`\\alpha' = \\alpha''`}.
Остаётся проверить, что ${$`\\beta'`} не может быть, скажем, меньше ${$`\\beta''`}.
В этом случае ${$`\\beta'' = \\beta' + \\delta`}, и сокращая ${$`\\alpha\\beta'`} слева, получим, что ${$`\\alpha' = \\alpha\\delta + \\alpha''`}, что невозможно, так как левая часть меньше ${$`\\alpha`}, а правая часть больше или равна ${$`\\alpha`}.)
`)}
${li(_`
Аналогичное «деление с остатком» возможно и для любых ординалов.
Пусть ${$`\\alpha > 0`}.
Тогда любой ординал ${$`\\gamma`} можно разделить с остатком на ${$`\\alpha`}, то есть представить в виде ${$`\\alpha\\tau + \\rho`}, где ${$`\\rho < \\alpha`}, и притом единственным образом.


(В самом деле, существование следует из предыдущего утверждения, надо только взять достаточно большое ${$`\\beta`}, чтобы ${$`\\alpha\\beta`} было больше ${$`\\gamma`}, скажем, ${$`\\beta = \\gamma + 1`}.
Единственность доказывается так же, как и в предыдущем пункте.)
`)}
${li(_`
${area.key('ordinal-position')`Повторяя деление с остатком на ${$`\\alpha > 0`}, можно построить позиционную систему счисления для ординалов: всякий ординал, меньший ${$`\\alpha^{k+1}`} (здесь ${$`k`} — натуральное число), можно однозначно представить в виде ${$`\\alpha^k\\beta_k + \\alpha^{k-1}\\beta_{k-1} + \\ldots + \\alpha\\beta_1 + \\beta_0`}, где «цифры» ${$`\\beta_k, \\ldots , \\beta_1, \\beta_0`} — ординалы, меньшие ${$`\\alpha`}.`}
`)}
${end(ul)}

${problem`Для каких ординалов ${$`1 + \\alpha = \\alpha`}?`}


${problem`Для каких ординалов ${$`2 \\cdot \\alpha = \\alpha`}?`}


${problem`Какие ординалы представимы в виде ${$`\\omega \\cdot \\alpha`}?`}


${problem`
Докажите, что ${$`\\alpha + \\beta = \\beta`} тогда и только тогда, когда ${$`\\alpha\\omega \\leqslant \\beta`}
(здесь ${$`\\alpha`} и ${$`\\beta`} — ординалы).
`}


${problem`
Докажите, что если ${$`\\alpha + \\beta = \\beta + \\alpha`} для некоторых ординалов ${$`\\alpha`} и ${$`\\beta`}, то найдётся такой ординал ${$`\\gamma`} и такие натуральные числа ${$`m`} и ${$`n`}, что ${$`\\alpha = \\gamma m`} и ${$`\\beta = \\gamma n`}.
`}


${problem`
Определим операцию «замены основания» с ${$`k > 1`} на ${$`l > k`}.
Чтобы применить эту операцию к натуральному числу ${$`n`}, надо записать ${$`n`} в ${$`k`}-ичной системе счисления, а затем прочесть эту запись в ${$`l`}-ичной системе.
(Очевидно, число при этом возрастёт, если оно было больше или равно ${$`k`}.)
Возьмём произвольное число ${$`n`} и будет выполнять над ним такие операции: замена основания с ${$`2`} на ${$`3`} – вычитание единицы – замена основания с ${$`3`} на ${$`4`} – вычитание единицы – замена основания с ${$`4`} на ${$`5`} – вычитание единицы – ${$`\\dots`}
Докажите, что рано или поздно мы получим нуль и вычесть единицу не удастся.
(Указание: замените все основания на ординал ${$`\\omega`}; получится убывающая последовательность ординалов.)
`}
`;
};
