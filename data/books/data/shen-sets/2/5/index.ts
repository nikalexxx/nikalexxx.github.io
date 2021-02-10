import { getCustomElements } from '../../elements.js';

export default (api) => {
    const { _, text, block, control, math } = api;
    const { i, label, link } = text;
    const { start, end } = control;
    const { ul, li } = block;
    const { $, $$ } = math;

    const {
        paragraph,
        theorem,
        problem,
        proof,
        A,
        B,
        X,
        n,
    } = getCustomElements(api);

    return _`
${paragraph`Трансфинитная индукция`}
Термины «индукция» и «рекурсия» часто употребляются вперемежку.
Например, определение факториала ${$`n! = 1 \\cdot 2 \\cdot 3 \\cdot \\ldots \\cdot n`} как функции ${$`f(n)`}, для которой ${$`f(n) = n \\cdot f(n - 1)`} при ${$`n > 0`} и ${$`f(0) = 1`}, называют и «индуктивным», и «рекурсивным».
Мы будем стараться разграничивать эти слова так: если речь идёт о доказательстве чего-то сначала для ${$`n = 0`}, затем для ${$`n = 1, 2, \\dots`}, причём каждое утверждение опирается на предыдущее, то это ${i`индукция`}.
Если же мы определяем что-то сначала для ${$`n = 0`}, потом для ${$`n = 1, 2, \\dots`}, причём определение каждого нового значения использует ранее определённые, то это ${i`рекурсия`}.


Наша цель — научиться проводить индуктивные доказательства и давать рекурсивные определения не только для натуральных чисел, но и для других вполне упорядоченных множеств (эту технику иногда называют «трансфинитной индукцией»).


Доказательства по индукции мы уже обсуждали, говоря о фундированных множествах (см. раздел ${link.ref(
        'paragraph_founded-sets'
    )`${n.paragraph(
        'founded-sets'
    )}`}), и сейчас ограничимся только одним примером.
${theorem.key('f(x)>x')`
Пусть множество ${A} вполне упорядочено, а отображение ${$`f: A \\to A`} возрастает
(то есть ${$`f(x) < f(y)`} при ${$`x < y`}).
Тогда ${$`f(x) > x`} для всех ${$`x \\in A`}.
`}


${proof.start}
Согласно принципу индукции (${label.ref(
        'theorem_founded-set'
    )`теорема ${n.theorem(
        'founded-set'
    )}`}) достаточно доказать неравенство ${$`f(x) > x`}, предполагая, что ${$`f(y) > y`} при всех ${$`y < x`}.
Пусть это не так и ${$`f(x) < x`}.
Тогда по монотонности ${$`f(f(x)) < f(x)`}.
Но, с другой стороны, элемент ${$`y = f(x)`} меньше ${$`x`}, и потому по предположению индукции ${$`f(y) > y`}, то есть ${$`f(f(x)) > f(x)`}.


Если угодно, можно в явном виде воспользоваться существованием наименьшего элемента и изложить это же рассуждение так.
Пусть утверждение теоремы неверно.
Возьмём наименьшее ${$`x`}, для которого ${$`f(x) < x`}.
Но тогда ${$`f(f(x)) < f(x)`} по монотонности и потому ${$`x`} не является наименьшим вопреки предположению.


Наконец, это рассуждение можно пересказать и так: если ${$`x > f(x)`}, то по монотонности
${$$`
x > f(x) > f(f(x)) > f(f(f(x))) > \\dots ,
`}
но бесконечных убывающих последовательностей в фундированном множестве быть не может.
${proof.end}


Теперь перейдём к рекурсии.
В определении факториала ${$`f(n)`} выражалось через ${$`f(n - 1)`}.
В общей ситуации значение ${$`f(n)`} может использовать не только одно предыдущее значение функции, но и все значения на меньших аргументах.
Например, можно определить функцию ${$`f: \\N \\to \\N`}, сказав, что ${$`f(n)`} на единицу больше суммы всех предыдущих значений, то есть ${$`f(n) = f(0) + f(1) + \\ldots + f(n - 1) + 1`};
это вполне законное рекурсивное определение
(надо только пояснить, что пустая сумма считается равной нулю, так что ${$`f(0) = 1`}).


${problem`Какую функцию ${$`f`} задаёт такое определение?`}


Как обобщить эту схему на произвольные вполне упорядоченные множества вместо натурального ряда?
Пусть ${A} вполне упорядочено.
Мы хотим дать рекурсивное определение функции ${$`f: A \\to B`} (где ${B} — некоторое множество).
Такое определение должно связывать значение ${$`f(x)`} на некотором элементе ${$`x \\in A`} со значениями ${$`f(y)`} при всех ${$`y < x`}.
Другими словами, рекурсивное определение указывает ${$`f(x)`}, предполагая известным ограничение функции ${$`f`} на начальный отрезок ${$`[0, x)`}.
Вот точная формулировка:


${theorem.key(
    'transfinite-recursion'
)`Пусть ${A} — вполне упорядоченное множество.
Пусть ${B} — произвольное множество.
Пусть имеется некоторое рекурсивное правило, то есть отображение ${$`F`}, которое ставит в соответствие элементу ${$`x \\in A`} и функции ${$`g: [0, x) \\to B`} некоторый элемент множества ${B}.
Тогда существует и единственна функция ${$`f: A \\to B`}, для которой
${$$`
f(x) = F(x, f | _{[0,x)})
`}
при всех ${$`x \\in A`}.
(Здесь ${$`f | _{[0,x)}`} обозначает ограничение функции ${$`f`} на начальный отрезок ${$`[0, x)`} — мы отбрасываем все значения функции на элементах, больших или равных ${$`x`}.)
`}


${proof.start}
Неформально можно рассуждать так: значение ${$`f`} на минимальном элементе определено однозначно, так как предыдущих значений нет (сужение ${$`f | _{[0,0)}`} пусто).
Тогда и на следующем элементе значение функции ${$`f`} определено однозначно, поскольку на предыдущих (точнее, единственном предыдущем) функция ${$`f`} уже задана, и т.д.


Конечно, это надо аккуратно выразить формально.
Вот как это делается.
Докажем по индукции такое утверждение о произвольном элементе ${$`a \\in A`}:


${i(_`
существует и единственно отображение ${$`f`} отрезка ${$`[0, a]`} в множество ${B}, для которого рекурсивное определение (равенство, приведённое в условии) выполнено при всех ${$`x \\in [0, a]`}.
`)}


Будем называть отображение ${$`f: [0, a] \\to B`}, обладающее указанным свойством, ${i`корректным`}.
Таким образом, мы хотим доказать, что для каждого ${$`a \\in A`} есть единственное корректное отображение отрезка ${$`[0, a]`} в ${B}.


Поскольку мы рассуждаем по индукции, можно предполагать, что для всех ${$`c < a`} это утверждение выполнено, то есть существует и единственно корректное отображение ${$`f_c: [0, c] \\to B`}.
(Корректность ${$`f_c`} означает, что при всех ${$`d \\leqslant c`} значение ${$`f_c(d)`} совпадает с предписанным по рекурсивному правилу.)


Рассмотрим отображения ${$`f_{c_1}`} и ${$`f_{c_2}`} для двух различных ${$`c_1`} и ${$`c_2`}.
Пусть, например, ${$`c_1 < c_2`}.
Отображение ${$`f_{c_2}`} определено на большем отрезке ${$`[0, c_2]`}.
Если ограничить ${$`f_{c_2}`} на меньший отрезок ${$`[0, c_1]`}, то оно совпадёт с ${$`f_{c_1}`}, поскольку ограничение корректного отображения на меньший отрезок корректно (это очевидно), а мы предполагали единственность на отрезке ${$`[0, c_1]`}.


Таким образом, все отображения ${$`f_c`} согласованы друг с другом, то есть принимают одинаковое значение, если определены одновременно.
Объединив их, мы получаем некоторое единое отображение ${$`h`}, определённое на ${$`[0, a)`}.
Применив к ${$`a`} и ${$`h`} рекурсивное правило, получим некоторое значение ${$`b \\in B`}.
Доопределим ${$`h`} в точке ${$`a`}, положив ${$`h(a) = b`}.
Получится отображение ${$`h: [0, a] \\to B`}; легко понять, что оно корректно.


Чтобы завершить индуктивный переход, надо проверить, что на отрезке ${$`[0, a]`} корректное отображение единственно.
В самом деле, его ограничения на отрезки ${$`[0, c]`} при ${$`c < a`} должны совпадать с ${$`f_c`}, поэтому осталось проверить однозначность в точке ${$`a`} — что гарантируется рекурсивным определением
(выражающим значение в точке ${$`a`} через предыдущие).
На этом индуктивное доказательство заканчивается.


Осталось лишь заметить, что для разных ${$`a`} корректные отображения отрезков ${$`[0, a]`} согласованы друг с другом
(сужение корректного отображения на меньший отрезок корректно, применяем единственность)
и потому вместе задают некоторую функцию ${$`f: A \\to B`}, удовлетворяющую рекурсивному определению.


Существование доказано;
единственность тоже понятна, так как ограничение этой функции на любой отрезок ${$`[0, a]`} корректно и потому однозначно определено, как мы видели.
${proof.end}


Прежде чем применить эту теорему и доказать, что из двух вполне упорядоченных множеств одно является отрезком другого, нам потребуется её немного усовершенствовать.
Нам надо предусмотреть ситуацию, когда рекурсивное правило не всюду определено.
Пусть, например, мы определяем последовательность действительных чисел соотношением ${$`x_n = \\tg x_{n-1}`} и начальным условием ${$`x_0 = a`}.
При некоторых значениях ${$`a`} может оказаться, что построение последовательности обрывается, поскольку тангенс не определён для соответствующего аргумента.


${problem`Докажите, что множество всех таких «исключительных» ${$`a`} (когда последовательность конечна) счётно.`}


Аналогичная ситуация возможна и для общего случая.


${theorem.key(
    'recursive-rule'
)`Пусть отображение ${$`F`}, о котором шла речь в ${label.ref(
    'theorem_transfinite-recursion'
)`теореме ${n.theorem('transfinite-recursion')}`}, является частичным
(для некоторых элементов ${$`x`} и функций ${$`g: [0, x) \\to B`} оно может быть не определено).
Тогда существует функция ${$`f`}, которая
${start(ul)}
${li(_`
либо определена на всём ${A} и согласована с рекурсивным определением;
`)}
${li(_`
либо определена на некотором начальном отрезке ${$`[0, a)`} и на нём согласована с рекурсивным определением, причём для точки ${$`a`} и функции ${$`f`} рекурсивное правило неприменимо (отображение ${$`F`} не определено).
`)}
${end(ul)}
`}


${proof.start}
Это утверждение является обобщением, но одновременно и следствием предыдущей ${label.ref(
        'theorem_transfinite-recursion'
    )`теоремы ${n.theorem('transfinite-recursion')}`}.
В самом деле, добавим к множеству ${B} специальный элемент ${$`\\bot`} («неопределённость») и модифицируем рекурсивное правило: новое правило даёт значение ${$`\\bot`}, когда старое было не определено.
(Если среди значений функции на предыдущих аргументах уже встречалось ${$`\\bot`}, новое рекурсивное правило тоже даёт ${$`\\bot`}.)


Применив ${label.ref('theorem_transfinite-recursion')`теорему ${n.theorem(
        'transfinite-recursion'
    )}`} к модифицированному правилу, получим некоторую функцию ${$`f'`}.
Если эта функция нигде не принимает значения ${$`\\bot`}, то реализуется первая из двух возможностей, указанных в теореме (при ${$`f = f'`}).
Если же функция ${$`f'`} принимает значение ${$`\\bot`} в какой-то точке, то она имеет то же значение ${$`\\bot`} и во всех больших точках.
Заменив значение ${$`\\bot`} на неопределённость, мы получаем из функции ${$`f'`} функцию ${$`f`}.
Область определения функции ${$`f`} есть некоторый начальный отрезок ${$`[0, a)`} и реализуется вторая возможность, указанная в формулировке теоремы.
${proof.end}


${problem`Сформулируйте и докажите утверждение об однозначности функции, заданной частичным рекурсивным правилом.`}


Теперь у нас всё готово для доказательства теоремы о сравнении вполне упорядоченных множеств.


${theorem.key('A<>B')`
Пусть ${A} и ${B} — два вполне упорядоченных множества.
Тогда либо ${A} изоморфно некоторому начальному отрезку множества ${B}, либо ${B} изоморфно некоторому начальному отрезку множества ${A}.
`}


${proof.start}
Отметим прежде всего, что начальный отрезок может совпадать со всем множеством, так что случай изоморфных множеств ${A} и ${B} также покрывается этой теоремой.


Определим отображение ${$`f`} из ${A} в ${B} таким рекурсивным правилом: для любого ${$`a \\in A`}


${i(_`
${$`f(a)`} есть наименьший элемент множества ${B}, который не встречается среди ${$`f(a')`} при ${$`a' < a`}.
`)}


Это правило не определено в том случае, когда значения ${$`f(a')`} при ${$`a' < a`} покрывают всё ${B}.
Применяя ${label.ref('theorem_recursive-rule')`теорему ${n.theorem(
        'recursive-rule'
    )}`}, мы получаем функцию ${$`f`}, согласованную с этим правилом.
Теперь рассмотрим два случая:
${start(ul)}
${start(li)}
Функция ${$`f`} определена на всём ${A}.
Заметим, что рекурсивное определение гарантирует монотонность, поскольку ${$`f(a)`} определяется как минимальный ещё не использованный элемент;
чем больше ${$`a`}, тем меньше остаётся неиспользованных элементов и потому минимальный элемент может только возрасти
(из определения следует также, что одинаковых значений быть не может).
Остаётся лишь проверить, что множество значений функции ${$`f`}, то есть ${$`f(A)`}, будет начальным отрезком.
В самом деле, пусть ${$`b < f(a)`} для некоторого ${$`a \\in A`};
надо проверить, что ${$`b`} также является значением функции ${$`f`}.
Действительно, согласно рекурсивному определению ${$`f(a)`} является наименьшим неиспользованным значением, следовательно, ${$`b`} уже использовано, то есть встречается среди ${$`f(a')`} при ${$`a' < a`}.
${end(li)}
${start(li)}
Функция ${$`f`} определена лишь на некотором начальном отрезке ${$`[0, a)`}.
В этом случае этот начальный отрезок изоморфен ${B}, и функция ${$`f`} является искомым изоморфизмом.
В самом деле, раз ${$`f(a)`} не определено, то среди значений функции ${$`f`} встречаются все элементы множества ${B}.
С другой стороны, ${$`f`} сохраняет порядок в силу рекурсивного определения.
${end(li)}
${end(ul)}
Таким образом, в обоих случаях утверждение теоремы верно.
${proof.end}


Может ли быть так, что ${A} изоморфно начальному отрезку ${B}, а ${B} изоморфно начальному отрезку ${A}?
Нет — за исключением тривиального случая, когда начальные отрезки представляют собой сами множества ${A} и ${B}.
Это вытекает из такого утверждения:


${theorem`Никакое вполне упорядоченное множество не изоморфно своему начальному отрезку (не совпадающему со всем множеством).`}


${proof.start}
Пусть вполне упорядоченное множество ${A} изоморфно своему начальному отрезку, не совпадающему со всем множеством.
Как мы видели ${label.ref(
        '[0,x)'
    )`ранее`}, этот отрезок имеет вид ${$`[0, a)`} для некоторого элемента ${$`a \\in A`}.
Пусть ${$`f: A \\to [0, a)`} — изоморфизм.
Тогда ${$`f`} строго возрастает, и по ${label.ref(
        'theorem_f(x)>x'
    )`теореме ${n.theorem(
        'f(x)>x'
    )}`} имеет место неравенство ${$`f(a) > a`}, что противоречит тому, что множество значений функции ${$`f`} есть ${$`[0, a)`}.
${proof.end}


Если множество ${A} изоморфно начальному отрезку множества ${B}, а множество ${B} изоморфно начальному отрезку множества ${A}, то композиция этих изоморфизмов даёт изоморфизм между множеством ${A} и его начальным отрезком
(начальный отрезок начального отрезка есть начальный отрезок).
Этот начальный отрезок обязан совпадать со всем множеством ${A}, так что это возможно лишь если ${A} и ${B} изоморфны.


Сказанное позволяет сравнивать вполне упорядоченные множества.
Если ${A} изоморфно начальному отрезку множества ${B}, не совпадающему со всем ${B}, то говорят, что ${i(
        _`порядковый тип множества ${A} меньше порядкового типа множества ${B}`
    )}.
Если множества ${A} и ${B} изоморфны, то говорят, что у них ${i`одинаковые порядковые типы`}.
Наконец, если ${B} изоморфно начальному отрезку множества ${A}, то говорят, что ${i(
        _`порядковый тип множества ${A} больше порядкового типа множества ${B}`
    )}.
Мы только что доказали такое утверждение:


${theorem.key(
    'set-size'
)`Для любых вполне упорядоченных множеств ${A} и ${B} имеет место ровно один из указанных трёх случаев.`}


${problem.key('subset-init')`
Пусть ${A} — вполне упорядоченное множество, а ${B} — его подмножество с индуцированным порядком
(и, тем самым, тоже вполне упорядоченное множество).
Покажите, что ${B} изоморфно начальному отрезку ${A}.
Приведите пример, когда этот начальный отрезок совпадает со всем множеством ${A}, хотя ${$`B \\not = A`}.
(Указание. Если ${A} изоморфно собственному начальному отрезку множества ${B}, нарушается ${label.ref(
    'theorem_f(x)>x'
)`теорема ${n.theorem('f(x)>x')}`}.)
`}


Если временно забыть о проблемах оснований теории множеств и определить порядковый тип упорядоченного множества как класс изоморфных ему упорядоченных множеств, то можно сказать, что мы определили линейный порядок на порядковых типах вполне упорядоченных множеств (на ${i`ординалах`}, как говорят).
Этот порядок будет полным.
Мы переформулируем это утверждение так, чтобы избегать упоминания классов.


${theorem.key(
    'min-set'
)`Всякое непустое семейство вполне упорядоченных множеств имеет «наименьший элемент» — множество, изоморфное начальным отрезкам всех остальных множеств.`}


${proof.start}
Возьмём какое-то множество ${X} семейства.
Если оно наименьшее, то всё доказано.
Если нет, рассмотрим все множества семейства, которые меньше его, то есть изоморфны его начальным отрезкам вида ${$`[0, x)`}.
Среди всех таких элементов ${$`x`} выберем наименьший.
Тогда соответствующее ему множество и будет наименьшим.
${proof.end}


${problem`
Покажите, что для любого вполне упорядоченного множества ${A} существует равномощное ему вполне упорядоченное множество ${B} с таким свойством: любой начальный отрезок ${B} (кроме всего ${B}) имеет меньшую мощность, чем ${B}.
(Множества с этим свойством — точнее, их порядковые типы — называют ${i`кардиналами`}.)
`}


Из ${label.ref('theorem_set-size')`теоремы ${n.theorem(
        'set-size'
    )}`} следует, что любые два вполне упорядоченных множества сравнимы по мощности (одно равномощно подмножеству другого).
Сейчас мы увидим, что всякое множество может быть вполне упорядочено (${label.ref(
        'theorem_set-order'
    )`теорема Цермело`}), и, следовательно, любые два множества сравнимы по мощности.
`;
};
