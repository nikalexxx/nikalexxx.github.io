import { getCustomElements } from '../../elements.js';

const path = '/data/books/vereshagin-shen-sets/2/9';

export default (api) => {
    const { _, text, block, control, math } = api;
    const { b, label } = text;
    const { start, end } = control;
    const { area, img } = block;
    const { $ } = math;

    const {paragraph, theorem, problem, proof, A, B, C, n, printNote} = getCustomElements(api);

    return _`
${paragraph.key('cardinal-rules')`Свойства операций над мощностями`}
Теперь мы можем доказать несколько утверждений о мощностях.


${theorem`Если ${A} бесконечно, то множество ${$`A \\times \\N`} равномощно ${A}.`}


${proof.start}
Вполне упорядочим множество ${A}.
Мы ${label.ref('z+n')`уже знаем`} ${printNote`(см. с. 56)`}, что всякий элемент множества ${A} однозначно представляется в виде ${$`z + n`}, где ${$`z`} — предельный элемент (не имеющий непосредственно предыдущего), а ${$`n`} — натуральное число.
Это означает, что ${A} равномощно ${$`B \\times \\N`}, где ${B} — множество предельных элементов.
(Тут есть небольшая трудность — последняя группа элементов конечна, если в множестве есть наибольший элемент.
Но мы уже знаем, что добавление конечного или счётного множества не меняет мощности, так что этим можно пренебречь.)


Теперь утверждение теоремы очевидно: ${$`A \\times \\N`} равномощно ${$`(B \\times \\N) \\times \\N`}, то есть ${$`B \\times (\\N \\times \\N)`} и тем самым ${$`B \\times \\N`} (произведение счётных множеств счётно), то есть ${A}.
${proof.end}


По ${label.ref('theorem_<>=')`теореме Кантора–Бернштейна`} отсюда следует, что промежуточные мощности (в частности, ${$`|A| + |A|`}, а также любое произведение ${A} и конечного множества) совпадают с ${$`|A|`}.
Ещё одно следствие полезно выделить:


${theorem`Сумма двух бесконечных мощностей равна их максимуму.`}


${proof.start}
Прежде всего напомним, что любые две мощности сравнимы (${label.ref('theorem_set=subset')`теорема ${n.theorem('set=subset')}`}).
Пусть, скажем, ${$`|A| \\leqslant |B|`}.
Тогда ${$`|B| \\leqslant |A| + |B| \\leqslant |B| + |B| \\leqslant |B| \\times \\alef_0 = |B|`}
(последнее неравенство — утверждение предыдущей теоремы).
Остаётся воспользоваться ${label.ref('theorem_<>=')`теоремой Кантора–Бернштейна`} и заключить, что ${$`|B| = |A + B|`}.
${proof.end}


Теперь можно доказать более сильное утверждение.


${theorem`Если ${A} бесконечно, то ${$`A \\times A`} равномощно ${A}.`}


${proof.start}
Заметим, что для счётного множества (как, впрочем, и для континуума — но это сейчас не важно) мы это уже знаем.
Поэтому в ${A} есть подмножество, равномощное своему квадрату.


Рассмотрим семейство всех таких подмножеств вместе с соответствующими биекциями.
Элементами этого семейства будут пары ${$`\\lang B, f \\rang`}, где ${B} — подмножество ${A}, а ${$`f: B \\to B \\times B`} — взаимно однозначное соответствие.
Введём на этом семействе частичный порядок: ${$`\\lang B_1, f_1 \\rang \\leqslant \\lang B_2, f_2 \\rang`}, если ${$`B_1 \\sub B_2`} и ограничение отображения ${$`f_2`} на ${$`B_1`} совпадает с ${$`f_1`} (${label.ref('img_6')`рис. 6`}).


${start(area.key('img_6'))}
${img.src(`${path}/img6.svg`).height(0.5)(_`
Рис. 6. Отображение ${$`f_1`} — взаимно однозначное соответствие между малым квадратом и его стороной;
${$`f_2`} добавляет к нему взаимно однозначное соответствие между ${$`B_2 \\setminus B_1`} и «уголком» ${$`(B_2 \\times B_2) \\setminus (B_1 \\times B_1)`}.
`)}
${end(area)}


Теперь применим ${label.ref('theorem_zorns-lemma')`лемму Цорна`}.
Для этого нужно убедиться, что любое линейно упорядоченное (в смысле описанного порядка) множество пар указанного вида имеет верхнюю границу.
В самом деле, объединим все первые компоненты этих пар; пусть ${B} — их объединение.
Как обычно, согласованность отображений (гарантируемая определением порядка) позволяет соединить отображения в одно.
Это отображение (назовём его ${$`f`}) отображает ${B} в ${$`B \\times B`}.
Оно будет инъекцией: значения ${$`f(b')`} и ${$`f(b'')`} при различных ${$`b'`} и ${$`b''`} различны
(возьмём большее из множеств, которым принадлежат ${$`b'`} и ${$`b''`}; на нём ${$`f`} является инъекцией по предположению).
С другой стороны, ${$`f`} является сюръекцией: для любой пары ${$`\\lang b', b'' \\rang \\in B \\times B`} возьмём множества, из которых произошли ${$`b'`} и ${$`b''`}, выберем из них большее и вспомним, что мы имели взаимно однозначное соответствие между ним и его квадратом.


По лемме Цорна в нашем частично упорядоченном множестве существует максимальный элемент.
Пусть этот элемент есть ${$`\\lang B, f \\rang`}.
Мы знаем, что ${$`f`} есть взаимно однозначное соответствие между ${B} и ${$`B \\times B`} и потому ${$`|B| = |B| \\times |B|`}.
Теперь есть две возможности.
Если ${B} равномощно ${A}, то ${$`B \\times B`} равномощно ${$`A \\times A`} и всё доказано.
Осталось рассмотреть случай, когда ${B} не равномощно ${A}, то есть имеет меньшую мощность (большей оно иметь не может, будучи подмножеством).
Пусть ${C} — оставшаяся часть ${A}, то есть ${$`A \\setminus B`}.
Тогда ${$`|A| = |B| + |C| = \\max(|B|, |C|)`}, следовательно, ${C} равномощно ${A} и больше ${B} по мощности.
Возьмём в ${C} часть ${$`C'`}, равномощную ${B}, и положим ${$`B' = B + C'`} (${label.ref('img_7')`рис. 7`}).


${start(area.key('img_7'))}
${img.src(`${path}/img7.svg`).height(0.5)(_`
Рис. 7. Продолжение соответствия с ${B} на ${$`B' = B + C'`}.
`)}
${end(area)}


Обе части множества ${$`B'`} равномощны ${B}.
Поэтому ${$`B' \\times B'`} разбивается на 4 части, каждая из которых равномощна ${$`B \\times B`}, и, следовательно, равномощна ${B}
(напомним, что у нас есть взаимно однозначное соответствие ${$`f`} между ${B} и ${$`B \\times B`}).
Соответствие ${$`f`} можно продолжить до соответствия ${$`f'`} между ${$`B'`} и ${$`B' \\times B'`}, дополнив его соответствием между ${$`C'`} и ${$`(B' \\times B') \\setminus (B \\times B)`}
(эта разность состоит из трёх множеств, равномощных ${B}, так что равномощна ${B}).
В итоге мы получаем бо´льшую пару ${$`\\lang B', f' \\rang`}, что противоречит утверждению леммы Цорна о максимальности.
Таким образом, этот случай невозможен.
${proof.end}


Выведем теперь некоторые следствия из доказанного утверждения.


${theorem`
(${b`а`}) Произведение двух бесконечных мощностей равно большей из них.
(${b`б`}) Если множество ${A} бесконечно, то множество ${$`A^n`} всех последовательностей длины ${$`n > 0`}, составленных из элементов ${A}, равномощно ${A}.
(${b`в`}) Если множество ${A} бесконечно, то множество всех конечных последовательностей, составленных из элементов ${A}, равномощно ${A}.
`}


${proof.start}
Первое утверждение доказывается просто: если ${$`|A| \\leqslant |B|`}, то ${$`|B| \\leqslant |A| \\times |B| \\leqslant |B| \\times |B| = |B|`}.


Второе утверждение легко доказывается индукцией по ${$`n`}: если ${$`|A^n| = |A|`}, то ${$`|A^{n+1}| = |A^n| \\times |A| = |A| \\times |A| = |A|`}.


Третье тоже просто: множество конечных последовательностей есть ${$`1 + A + A^2 + A^3 + \\ldots`};
каждая из частей (кроме первой, которой можно пренебречь) равномощна ${A} (по доказанному), и потому всё вместе есть ${$`|A| \\times \\alef_0 = |A|`}.
${proof.end}


Заметим, что из последнего утверждения теоремы вытекает, что семейство всех конечных подмножеств бесконечного множества ${A} имеет ту же мощность, что и ${A}
(подмножеств не больше, чем конечных последовательностей и не меньше, чем одноэлементных подмножеств).


${problem`Пусть ${A} бесконечно. Докажите, что ${$`|A^A| = |2^A|`}.`}


${problem`
Рассмотрим мощность ${$`\\alpha = \\alef_0 + 2^{\\alef_0} + 2^{(2^{\\alef_0})} + \\ldots`} (счётная сумма).
Покажите, что ${$`\\alpha`} — минимальная мощность, которая больше мощностей множеств ${$`\\N, P(\\N), P(P(\\N)), \\dots`}
Покажите, что ${$`\\alpha^{\\alef_0} = 2^{\\alpha} > \\alpha`}.
`}


Теперь мы можем доказать упоминавшееся ранее утверждение о равномощности базисов.


${theorem.key('inf-basis')`Любые два базиса в бесконечномерном векторном пространстве имеют одинаковую мощность.`}


${proof.start}
Пусть даны два базиса — первый и второй.
Для каждого вектора из первого базиса фиксируем какой-либо способ выразить его через векторы второго базиса.
В этом выражении участвует конечное множество векторов второго базиса.
Таким образом, есть некоторая функция, которая каждому вектору первого базиса ставит в соответствие некоторое конечное множество векторов второго.
Как мы только что видели, возможных значений этой функции столько же, сколько элементов во втором базисе.
Кроме того, прообраз каждого значения состоит из векторов первого базиса, выражающихся через данный (конечный) набор векторов второго, и потому конечен.
Выходит, что первый базис разбит на группы, каждая группа конечна, а всего групп не больше, чем векторов во втором базисе.
Поэтому мощность первого базиса не превосходит мощности второго, умноженной на ${$`\\alef_0`}
(от чего, как мы знаем, мощность бесконечного множества не меняется).
Осталось провести симметричное рассуждение и сослаться на ${label.ref('theorem_<>=')`теорему Кантора–Бернштейна`}.
${proof.end}
`;
};
