import { BookApi } from '@bookbox/preset-web';
import { getCustomElements } from '../../elements.js';

const path = '/data/books/data/vereshagin-shen-sets/2/2';

export default (api: BookApi) => {
    const { book, start,end, math, label, format, area, image, list, item, resource } = api;
    const { i, b} = format;

    const {paragraph, theorem, problem, proof, A, B, X, Y, n, printNote} = getCustomElements(api);

    return book`
${resource.path('/2/2/img5.svg').src(path + '/img5.svg')}
${paragraph`Изоморфизмы`}
Два частично упорядоченных множества называются ${i`изоморфными`}, если между ними существует ${i`изоморфизм`}, то есть взаимно однозначное соответствие, сохраняющее порядок.
(Естественно, что в этом случае они равномощны как множества.)
Можно сказать так: биекция ${math`f: A \\to B`} называется изоморфизмом частично упорядоченных множеств ${A} и ${B}, если
${math.block()`
a_1 \\leqslant a_2 \\lrArr f(a_1) \\leqslant f(a_2)
`}
для любых элементов ${math`a_1, a_2 \\in A`} (слева знак ${math`\\leqslant`} обозначает порядок в множестве ${A}, справа — в множестве ${B}).


Очевидно, что отношение изоморфности рефлексивно (каждое множество изоморфно самому себе), симметрично (если ${X} изоморфно ${Y}, то и наоборот) и транзитивно (два множества, изоморфные третьему, изоморфны между собой).
Таким образом, все частично упорядоченные множества разбиваются на классы изоморфных, которые называют ${i`порядковыми типами`}.
(Правда, как и с мощностями, тут необходима осторожность — изоморфных множеств слишком много, и потому говорить о порядковых типах как множествах нельзя.)


${theorem.key('iso-eql-lin')`Конечные линейно упорядоченные множества из одинакового числа элементов изоморфны.`}


${proof.start}
Конечное линейно упорядоченное множество всегда имеет наименьший элемент
(возьмём любой элемент; если он не наименьший, возьмём меньший, если и он не наименьший, ещё меньший — и так далее;
получим убывающую последовательность ${math`x > y > z > \\ldots`}, которая рано или поздно должна оборваться).
Присвоим наименьшему элементу номер ${math`1`}.
Из оставшихся снова выберем наименьший элемент и присвоим ему номер ${math`2`} и так далее.
Легко понять, что порядок между элементами соответствует порядку между номерами, то есть что наше множество изоморфно множеству ${math`\\{1, 2, \\dots , n\\}`}.
${proof.end}


${problem`
Докажите, что множество всех целых положительных делителей числа ${math`30`} с отношением «быть делителем» в качестве отношения порядка изоморфно множеству всех подмножеств множества ${math`\\{a, b, c\\}`}, упорядоченному по включению.
`}


${problem`
Будем рассматривать финитные последовательности натуральных чисел, то есть последовательности, у которых все члены, кроме конечного числа, равны ${math`0`}.
На множестве таких последовательностей введём покомпонентный порядок: ${math`(a_0, a_1, \\dots ) \\leqslant (b_0, b_1, \\dots )`}, если ${math`a_i \\leqslant b_i`} при всех ${math`i`}.
Докажите, что это множество изоморфно множеству всех положительных целых чисел с отношением «быть делителем» в качестве порядка.
`}


Взаимно однозначное отображение частично упорядоченного множества ${A} в себя, являющееся изоморфизмом, называют автоморфизмом частично упорядоченного множества ${A}.
Тождественное отображение всегда является автоморфизмом, но для некоторых множеств существуют и другие автоморфизмы.
Например, отображение прибавления единицы ${math`(x \\mapsto x + 1)`} является автоморфизмом частично упорядоченного множества ${math`\\Z`} целых чисел (с естественным порядком).
Для множества натуральных чисел та же формула не даёт автоморфизма (нет взаимной однозначности).


${problem`Покажите, что не существует автоморфизма упорядоченного множества ${math`\\N`} натуральных чисел, отличного от тождественного.`}


${problem`
Рассмотрим множество ${math`P(A)`} всех подмножеств некоторого ${math`k`}-элементного множества ${A}, частично упорядоченное по включению.
Найдите число автоморфизмов этого множества.
`}


${problem`Покажите, что множество целых положительных чисел, частично упорядоченное отношением «${math`x`} делит ${math`y`}», имеет континуум различных автоморфизмов.`}


Вот несколько примеров равномощных, но не изоморфных линейно упорядоченных множеств
(в силу ${label.ref('theorem_iso-eql-lin')`теоремы ${n.theorem('iso-eql-lin')}`} они должны быть бесконечными).
${start(list)}
${start(item)}
Отрезок ${math`[0, 1]`} (с обычным отношением порядка) не изоморфен множеству ${math`\\R`}, так как у первого есть наибольший элемент, а у второго нет.
(При изоморфизме наибольший элемент, естественно, должен соответствовать наибольшему.)
${end(item)}
${start(item)}
Множество ${math`\\Z`} (целые числа с обычным порядком) не изоморфно множеству ${math`\\Bbb{Q}`} (рациональные числа).
В самом деле, пусть ${math`\\alpha: \\Z \\to \\Bbb{Q}`} является изоморфизмом.
Возьмём два соседних целых числа, скажем, ${math`2`} и ${math`3`}.
При изоморфизме ${math`\\alpha`} им должны соответствовать какие-то два рациональных числа ${math`\\alpha(2)`} и ${math`\\alpha(3)`}, причём ${math`\\alpha(2) < \\alpha(3)`}, так как ${math`2 < 3`}.
Но тогда рациональным числам между ${math`\\alpha(2)`} и ${math`\\alpha(3)`} должны соответствовать целые числа между ${math`2`} и ${math`3`}, которых нет.
${end(item)}
${start(item)}
Более сложный пример — множества ${math`\\Z`} и ${math`\\Z + \\Z`}.
Возьмём в ${math`\\Z + \\Z`} две копии нуля (из той и другой компоненты); мы обозначали их ${math`0`} и ${math`\\overline{0}`}.
При этом ${math`0 < \\overline{0}`}.
При изоморфизме им должны соответствовать два целых числа ${math`a`} и ${math`b`}, для которых ${math`a < b`}.
Тогда всем элементам между ${math`0`} и ${math`\\overline{0}`} (их бесконечно много: ${math`1, 2, 3, \\dots , -\\overline{3}, -\\overline{2}, -\\overline{1}`}) должны соответствовать числа между ${math`a`} и ${math`b`} — но их лишь конечное число.


Этот пример принципиально отличается от предыдущих тем, что здесь разницу между свойствами множеств нельзя записать формулой.
Как говорят, упорядоченные множества ${math`\\Z`} и ${math`\\Z + \\Z`} «элементарно эквивалентны».
${end(item)}
${end(list)}


${problem`
Докажите, что линейно упорядоченные множества ${math`\\Z \\times \\N`} и ${math`\\Z \\times \\Z`}
(с описанным ${label.ref('multi-set-order')`выше`} ${printNote`на с. 46`} порядком) не изоморфны.
`}


${problem`Будут ли изоморфны линейно упорядоченные множества ${math`\\N \\times \\Z`} и ${math`\\Z \\times \\Z`}?`}


${problem`Будут ли изоморфны линейно упорядоченные множества ${math`\\Bbb{Q} \\times \\Z`} и ${math`\\Bbb{Q} \\times \\N`}?`}


Отображение ${math`x \\mapsto \\sqrt{2}x`} осуществляет изоморфизм между интервалами ${math`(0, 1)`} и ${math`(0, \\sqrt{2}`}).
Но уже не так просто построить изоморфизм между множествами рациональных точек этих интервалов
(то есть между ${math`\\Bbb{Q} \\cap (0, 1)`} и ${math`\\Bbb{Q} \\cap (0, \\sqrt{2})`}),
поскольку умножение на ${math`\\sqrt{2}`} переводит рациональные числа в иррациональные.
Тем не менее изоморфизм построить можно.
Для этого надо взять возрастающие последовательности рациональных чисел ${math`0 < x_1 < x_2 < \\ldots`} и ${math`0 < y_1 < y_2 < \\ldots`}, сходящиеся соответственно к ${math`1`} и ${math`\\sqrt{2}`}, и построить кусочно-линейную функцию ${math`f`}, которая переводит ${math`x_i`} в ${math`y_i`} и линейна на каждом из отрезков ${math`[x_i, x_{i+1}]`} (${label.ref('img_5')`рис. 5`}).
Легко понять, что она будет искомым изоморфизмом.


${start(area.key`img_5`)}
${image.src`/2/2/img5.svg`.height(0.5)`Рис. 5. Ломаная осуществляет изоморфизм.`}
${end(area)}


${problem`
Покажите, что множество рациональных чисел интервала ${math`(0, 1)`} и множество ${math`\\Bbb{Q}`} изоморфны.
(Указание: здесь тоже можно построить ломаную;
впрочем, можно действовать иначе и начать с того, что функция ${math`x \\mapsto 1 / x`} переводит рациональные числа в рациональные.)
`}


Более сложная конструкция требуется в следующей задаче (видимо, ничего проще, чем сослаться на общую ${label.ref('theorem_iso-dense-sets')`теорему ${n.theorem('iso-dense-sets')}`}, тут не придумаешь).


${problem`
Докажите, что множество двоично-рациональных чисел интервала ${math`(0, 1)`} изоморфно множеству ${math`\\Bbb{Q}`}.
(Число считается ${i`двоично-рациональным`}, если оно имеет вид ${math`m / 2^n`}, где ${math`m`} — целое число, а ${math`n`} — натуральное.)
`}


Два элемента ${math`x, y`} линейно упорядоченного множества называют ${i`соседними`}, если ${math`x < y`} и не существует элемента между ними, то есть такого ${math`z`}, что ${math`x < z < y`}.
Линейно упорядоченное множество называют ${i`плотным`}, если в нём нет соседних элементов (то есть между любыми двумя есть третий).


${theorem.key('iso-dense-sets')`Любые два счётных плотных линейно упорядоченных множества без наибольшего и наименьшего элементов изоморфны.`}

${proof.start}
Пусть ${X} и ${Y} — данные нам множества.
Требуемый изоморфизм между ними строится по шагам.
После ${math`n`} шагов у нас есть два ${math`n`}-элементных подмножества ${math`X_n \\sub X`} и ${math`Y_n \\sub Y`}, элементы которых мы будем называть «охваченными», и взаимно однозначное соответствие между ними, сохраняющее порядок.
На очередном шаге мы берём какой-то неохваченный элемент одного из множеств (скажем, множества ${X}) и сравниваем его со всеми охваченными элементами ${X}.
Он может оказаться либо меньше всех, либо больше, либо попасть между какими-то двумя.
В каждом из случаев мы можем найти неохваченный элемент в ${Y}, находящийся в том же положении (больше всех, между первым и вторым охваченным сверху, между вторым и третьим охваченным сверху и т. п.).
При этом мы пользуемся тем, что в ${Y} нет наименьшего элемента, нет наибольшего и нет соседних элементов, — в зависимости от того, какой из трёх случаев имеет место.
После этого мы добавляем выбранные элементы к ${math`X_n`} и ${math`Y_n`}, считая их соответствующими друг другу.


Чтобы в пределе получить изоморфизм между множествами ${X} и ${Y} , мы должны позаботиться о том, чтобы все элементы обоих множеств были рано или поздно охвачены.
Это можно сделать так: поскольку каждое из множеств счётно, пронумеруем его элементы и будем выбирать неохваченный элемент с наименьшим номером (на нечётных шагах — из ${X}, на чётных — из ${Y}).
Это соображение завершает доказательство.
${proof.end}


${problem`Сколько существует неизоморфных счётных плотных линейно упорядоченных множеств (про наименьший и наибольший элементы ничего не известно)? (Ответ: 4.)`}


${problem`
Приведите пример неизоморфных линейно упорядоченных множеств мощности c без наименьшего и наибольшего элементов.
(Указание: возьмите множества ${math`\\Bbb{Q} + \\R`} и ${math`\\R + \\Bbb{Q}`}.)
`}


${theorem.key('iso-sub-Q')`Всякое счётное линейно упорядоченное множество изоморфно некоторому подмножеству множества ${math`\\Bbb{Q}`}.`}

${proof.start}
Заметим сразу же, что вместо множества ${math`\\Bbb{Q}`} можно было взять любое плотное счётное всюду плотное множество без первого и последнего элементов, так как они все изоморфны.


Доказательство этого утверждения происходит так же, как и в ${label.ref('theorem_iso-dense-sets')`теореме ${n.theorem('iso-dense-sets')}`} — с той разницей, что новые необработанные элементы берутся только с одной стороны (из данного нам множества), а пары к ним подбираются в множестве рациональных чисел.
${proof.end}


${problem`Дайте другое доказательство ${label.ref('theorem_iso-sub-Q')`теоремы ${n.theorem('iso-sub-Q')}`}, заметив, что любое множество ${X} изоморфно подмножеству множества ${math`\\Bbb{Q} \\times X`}.`}
`;
};
