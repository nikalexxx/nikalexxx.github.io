import { getCustomElements } from '../../elements.js';

export default (api) => {
    const { _, text, block, control, math } = api;
    const { i, label } = text;
    const { start, end } = control;
    const { ul, li, area } = block;
    const { $, $$ } = math;

    const {paragraph, theorem, proof, problem, A, B, n, printNote} = getCustomElements(api);

    return _`
${paragraph`Теорема Кантора`}
Классический пример неравномощных бесконечных множеств (до сих пор такого примера у нас не было!) даёт «диагональная конструкция ${label.ref('name_cantor')`Кантора`}».


${theorem.key('01...').name('Кантора')`Множество бесконечных последовательностей нулей и единиц несчётно.`}

${proof.start}
Предположим, что оно счётно.
Тогда все последовательности нулей и единиц можно перенумеровать: ${$`\\alpha_0, \\alpha_1, \\dots`}
Составим бесконечную вниз таблицу, строками которой будут наши последовательности:
${$$`
\\begin{matrix}
\\alpha_0 & = & \\underline{\\alpha_{00}} & \\alpha_{01} & \\alpha_{02} & \\dots \\\\
\\alpha_1 & = & \\alpha_{10} & \\underline{\\alpha_{11}} & \\alpha_{12} & \\dots \\\\
\\alpha_2 & = & \\alpha_{20} & \\alpha_{21} & \\underline{\\alpha_{22}} & \\dots \\\\
\\dots & \\dots & \\dots & \\dots & \\dots & \\dots
\\end{matrix}
`}
(через ${$`\\alpha_{ij}`} мы обозначаем ${$`j`}-й член ${$`i`}-й последовательности).
Теперь рассмотрим последовательность, образованную стоящими на диагонали членами ${$`\\alpha_{00}, \\alpha_{11}, \\alpha_{22}, \\dots`};
её ${$`i`}-й член есть ${$`\\alpha_{ii}`} и совпадает с ${$`i`}-м членом ${$`i`}-й последовательности.
Заменив все члены на противоположные, мы получим последовательность ${$`\\beta`}, у которой
${$$`
\\beta_i = 1 - \\alpha_{ii},
`}
так что последовательность ${$`\\beta`} отличается от любой из последовательностей ${$`\\alpha_i`} (в позиции ${$`i`}) и потому отсутствует в таблице.
Это противоречит нашему предположению о том, что таблица включает в себя все последовательности.
${proof.end}


Из этой теоремы следует, что множество ${$`\\R`} действительных чисел
(которое, как мы видели, равномощно множеству последовательностей нулей и единиц) несчётно.
В частности, оно не может совпадать со счётным множеством алгебраических чисел и потому существует действительное число, не являющееся алгебраическим (не являющееся корнем никакого ненулевого многочлена с целочисленными коэффициентами). Такие числа называют ${i`трансцендентными`}.


К моменту создания Кантором теории множеств уже было известно, что такие числа существуют.
Первый пример такого числа построил в 1844 году французский математик ${label.ref('name_liouville')`Ж. Лиувилль`}.
Он показал, что число, хорошо приближаемое рациональными, не может быть алгебраическим
(таково, например, число ${$`\\sum(1 / 10^{n!})`}).
Доказательство теоремы Лиувилля не очень сложно, но всё-таки требует некоторых оценок погрешности приближения; на его фоне доказательство Кантора, опубликованное им в 1874 году, выглядит чистой воды фокусом.
Эта публикация была первой работой по теории множеств; в её первом параграфе доказывается счётность множества алгебраических чисел, а во втором — несчётность множества действительных чисел.
(Общее определение равномощности было дано Кантором лишь через три года, одновременно с доказательством равномощности пространств разного числа измерений, о котором мы уже говорили.)


Отметим кстати, что в том же 1874 году французский математик ${label.ref('name_hermite')`Ш. Эрмит`} доказал, что основание натуральных логарифмов ${$`e = 2,71828\\mathellipsis`} трансцендентно, а через восемь лет немецкий математик ${label.ref('name_lindemann')`Ф. Линдеман`} доказал трансцендентность числа ${$`\\pi = 3,1415\\mathellipsis`} и тем самым невозможность квадратуры круга.


В нескольких следующих задачах мы предполагаем известными некоторые начальные сведения из курса математического анализа.


${problem`
Покажите, что для всякого несчётного множества ${$`A \\sub \\R`} можно указать точку ${$`a`}, любая окрестность которой пересекается с ${A} по несчётному множеству.
(Утверждение остаётся верным, если слова «несчётное множество» заменить на «множество мощности континуума».)
`}


${problem`Покажите, что любое непустое замкнутое множество ${$`A \\sub \\R`} без изолированных точек имеет мощность континуума.`}


${problem`
Покажите, что любое замкнутое множество ${$`A \\sub \\R`} либо конечно, либо счётно, либо имеет мощность континуума.
(Указание. Рассмотрим множество ${$`B \\sub A`}, состоящее из тех точек множества ${A}, в любой окрестности которых несчётно много других точек из ${A}.
Если ${B} пусто, то ${A} конечно или счётно.
Если ${B} непусто, то оно замкнуто и не имеет изолированных точек.)
`}


Эта задача показывает, что для замкнутых подмножеств прямой верна гипотеза континуума, утверждающая, что любое подмножество прямой либо конечно, либо счётно, либо равномощно ${$`\\R`}.
(${label.ref('name_cantor')`Кантор`}, доказавший этот факт, рассматривал его как первый шаг к доказательству гипотезы континуума для общего случая, но из этого ничего не вышло.)


${problem`
Из плоскости выбросили произвольное счётное множество точек.
Докажите, что оставшаяся часть плоскости линейно связна и, более того, любые две невыброшенные точки можно соединить двухзвенной ломаной, не задевающей выброшенных точек.
`}


Вернёмся к диагональной конструкции.
Мы знаем, что множество последовательностей нулей и единиц равномощно множеству подмножеств натурального ряда (каждому подмножеству соответствует его «характеристическая последовательность», у которой единицы стоят на местах из этого подмножества).
Поэтому можно переформулировать эту теорему так:


${i(_`Множество ${$`\\N`} не равномощно множеству своих подмножеств.`)}


Доказательство также можно шаг за шагом перевести на такой язык: пусть они равномощны; тогда есть взаимно однозначное соответствие ${$`i \\mapsto A_i`} между натуральными числами и подмножествами натурального ряда.
Диагональная последовательность в этих терминах представляет собой множество тех ${$`i`}, для которых ${$`i \\in A_i`}, а последовательность ${$`\\beta`}, отсутствовавшая в перечислении, теперь будет его дополнением (${$`B = \\{i\\ |\\ i \\notin A_i\\}`}).


При этом оказывается несущественным, что мы имеем дело с натуральным рядом, и мы приходим к такому утверждению:



${theorem.key('x!=2^x').name('общая формулировка теоремы Кантора')`Никакое множество ${$`X`} не равномощно множеству всех своих подмножеств.`}


${proof.start}
Пусть ${$`\\varphi`} — взаимно однозначное соответствие между ${$`X`} и множеством ${$`P(X)`} всех подмножеств множества ${$`X`}.
Рассмотрим те элементы ${$`x \\in X`}, которые не принадлежат соответствующему им подмножеству.
Пусть ${$`Z`} — образованное ими множество:
${$$`
Z = \\{x \\in X\\ |\\ x \\notin \\varphi(x)\\}.
`}
Докажем, что подмножество ${$`Z`} не соответствует никакому элементу множества ${$`X`}.
Пусть это не так и ${$`Z = \\varphi(z)`} для некоторого элемента ${$`z \\in X`}.
Тогда
${$$`
z \\in Z \\lrArr z \\notin \\varphi(z) \\lrArr z \\notin Z
`}
первое — по построению множества ${$`Z`}, второе — по предположению ${$`\\varphi(z) = Z`}).
Полученное противоречие показывает, что ${$`Z`} действительно ничему не соответствует, так что ${$`\\varphi`} не взаимно однозначно.
${proof.end}


С другой, стороны, любое множество ${$`X`} равномощно некоторой части множества ${$`P(X)`}.
В самом деле, каждому элементу ${$`x \\in X`} можно поставить в соответствие одноэлементное подмножество ${$`\\{x\\}`}.
Поэтому, вспоминая ${label.ref('set-size-variants')`определение`} сравнения множеств по мощности ${printNote`(с. 24)`}, можно сказать, что мощность множества ${$`X`} всегда меньше мощности множества ${$`P(X)`}


${problem`Докажите, что ${$`n < 2^n`} для всех натуральных ${$`n = 0, 1, 2, \\dots`}`}


В общей формулировке ${label.ref('theorem_x!=2^x')`теорема ${n.theorem('x!=2^x')}`} появляется в работе Кантора 1890/91 года.
Вместо подмножеств ${label.ref('name_cantor')`Кантор`} говорит о функциях, принимающих значения 0 и 1.


На самом деле мы уже приблизились к опасной границе, когда наглядные представления о множествах приводят к противоречию.
В самом деле, рассмотрим множество всех множеств ${$`U`}, элементами которого являются все множества.
Тогда, в частности, все подмножества множества ${$`U`} будут его элементами, и ${$`P(U) \\sub U`}, что невозможно по теореме Кантора.


${area.key('russell-paradox')`
Это рассуждение можно развернуть, вспомнив доказательство теоремы Кантора — получится так называемый парадокс ${label.ref('name_russell')`Рассела`}.
Вот как его обычно излагают.


Как правило, множество не является своим элементом.
Скажем, множество натуральных чисел ${$`\\N`} само не является натуральным числом и потому не будет своим элементом.
Однако в принципе можно себе представить и множество, которое является своим элементом (например, множество всех множеств).
Назовём такие множества «необычными».
Рассмотрим теперь множество всех обычных множеств.
Будет ли оно обычным?
Если оно обычное, то оно является своим элементом и потому необычное, и наоборот.
Как же так?`}


Модифицированная версия этого парадокса такова: будем называть прилагательное самоприменимым, если оно обладает описываемым свойством.
Например, прилагательное «русский» самоприменимо, а прилагательное «глиняный» нет.
Другой пример: прилагательное «трёхсложный» самоприменимо, а «двусложный» нет.
Теперь вопрос: будет ли прилагательное «несамоприменимый» самоприменимым?
(Любой ответ очевидно приводит к противоречию.)


Отсюда недалеко до широко известного «парадокса лжеца», говорящего «я лгу», или до истории о солдате, который должен был брить всех солдат одной с ним части, кто не бреется сам и т. п.


Возвращаясь к теории множеств, мы обязаны дать себе отчёт в том, что плохого было в рассуждениях, приведших к парадоксу Рассела.
Вопрос этот далеко не простой, и его обсуждение активно шло всю первую половину 20-го века.
Итоги этого обсуждения приблизительно можно сформулировать так:
${start(ul)}
${start(li)}
Понятие множества не является непосредственно очевидным; разные люди (и научные традиции) могут понимать его по-разному
${end(li)}
${start(li)}
Множества — слишком абстрактные объекты для того, чтобы вопрос «а что на самом деле?» имел смысл.
${area.key('сontinuum-hypothesis').inline(true)`Например, в работе Кантора 1878 года была сформулирована ${i`континуум-гипотеза`}: всякое подмножество отрезка либо конечно, либо счётно, либо равномощно всему отрезку.`}
(Другими словами, между счётными множествами и множествами мощности континуум нет промежуточных мощностей).
Кантор написал, что это может быть доказано «с помощью некоторого метода индукции, в изложение которого мы не будем входить здесь подробнее», но на самом деле доказать это ему не удалось.
Более того, постепенно стало ясно, что утверждение континуум-гипотезы можно считать истинным или ложным, — при этом получаются разные теории множеств, но в общем-то ни одна из этих теорий не лучше другой.


Тут есть некоторая аналогия с неевклидовой геометрией.
Мы можем считать «пятый постулат ${label.ref('name_euclid')`Евклида`}» (через данную точку проходит не более одной прямой, параллельной данной) истинным.
Тогда получится геометрия, называемая евклидовой.
А можно принять в качестве аксиомы противоположное утверждение: через некоторую точку можно провести две различные прямые, параллельные некоторой прямой.
Тогда получится неевклидова геометрия.
[Отметим, кстати, распространённое заблуждение: почему-то широкие массы писателей о науке и даже отдельные математики в минуты затмений (см. статью в Вестнике Академии Наук, посвящённую юбилею ${label.ref('name_lobachevski')`Лобачевского`}) считают, что в неевклидовой геометрии параллельные прямые пересекаются.
Это не так — параллельные прямые и в евклидовой, и в неевклидовой геометрии определяются как прямые, которые не пересекаются.]


Вопрос о том, евклидова или неевклидова геометрия правильна «на самом деле», если вообще имеет смысл, не является математическим — скорее об этом следует спрашивать физиков.
К теории множеств это относится в ещё большей степени, и разве что теология (Кантор неоднократно обсуждал вопросы теории множеств с профессионалами-теологами) могла бы в принципе претендовать на окончательный ответ.
${end(li)}
${start(li)}
Если мы хотим рассуждать о множествах, не впадая в противоречия, нужно проявлять осторожность и избегать определённых видов рассуждений.
Безопасные (по крайней мере пока не приведшие к противоречию) правила обращения со множествами сформулированы в аксиоматической теории множеств (формальная теория ZF, названная в честь ${label.ref('name_zermelo')`Цермело`} и ${label.ref('name_fraenkel')`Френкеля`}).
Добавив к этой теории аксиому выбора, получаем теорию, называемую ZFC (сhoice по-английски — выбор).
Есть и другие, менее популярные теории.
${end(li)}
${end(ul)}

Однако формальное построение теории множеств выходит за рамки нашего обсуждения.
Поэтому мы ограничимся неформальным описанием ограничений, накладываемых во избежание противоречий: нельзя просто так рассмотреть множество всех множеств или множество всех множеств, не являющихся своими элементами, поскольку класс потенциальных претендентов слишком «необозрим».
Множества можно строить лишь постепенно, исходя из уже построенных множеств.
Например, можно образовать множество всех подмножеств данного множества (${i`аксиома степени`}).
Можно рассмотреть подмножество данного множества, образованное элементами с каким-то свойством (${i`аксиома выделения`}).
Можно рассмотреть множество всех элементов, входящих хотя бы в один из элементов данного множества (${i`аксиома суммы`}).
Есть и другие аксиомы.


Излагая сведения из теории множеств, мы будем стараться держаться подальше от опасной черты, и указывать на опасность в тех местах, когда возникнет искушение к этой черте приблизиться.
Пока что такое место было одно: попытка определить мощность множества как класс (множество) всех равномощных ему множеств.
`;
};