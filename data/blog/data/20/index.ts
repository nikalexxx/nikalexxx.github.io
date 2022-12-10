import { BookApi } from "@bookbox/preset-web";

export default (api: BookApi) => {
    const { book, math, format: {pre},image, header, link, code } = api;
    return book.root`
TL;DR планеты вращаются вокруг светил согласно классической теории гравитации и показывают свою скорость и ускорение.

Посмотреть демо и поиграться можно на странице ${link.href('?/physics/gravitation')`Гравитация`} в разделе ${link.href('?/physics')`Физика`}.


${header.level(3)`Модель всемирного тяготения`}
Чтобы рассчитать силу гравитационного притяжения между двумя материальными точками, воспользуемся классической ${link.href('https://en.wikipedia.org/wiki/Newton%27s_law_of_universal_gravitation')`формулой Ньютона`}:
${math.block()`
F = G\\frac{m_1 m_2}{r^2}
`}
где ${math`m_1`} и ${math`m_2`} — массы тел, ${math`r`} — расстояние между ними, ${math`G`} — гравитационная постоянная.


Для каждого тела рассмотрим попарно взаимодействие с остальными телами, на рисунке красным обозначены единичные векторы
${image.src('/data/blog/data/20/gravitation-vectors.svg').width(0.9).height(0.9)('Центральное тело и направление сил притяжения от остальных тел')}

Для расчёта ускорения силу рассчитывать не нужно, ведь по ${link.href('https://en.wikipedia.org/wiki/Newton%27s_laws_of_motion#Newton\'s_second_law')`второму закону Ньютона`} ускорение пропорционально массе тела:
${math.block()`
\\vec{a} = \\frac{\\vec{F}}{M}
`}

и если просуммировать все вектора сил от остальных тел, то массу рассматриваемого тела можно сократить (здесь и далее считаем, что она не равна нулю)

${math.block()`
\\begin{split}
\\textcolor{orange}{M}\\vec{a} &= G\\vec{e_1}\\frac{\\textcolor{orange}{M} m_1}{r_1^2} + G\\vec{e_2}\\frac{\\textcolor{orange}{M} m_2}{r_2^2} + ... + G\\vec{e_n}\\frac{\\textcolor{orange}{M} m_n}{r_n^2}\\\\
&=\\sum_{\\mathclap{1\\le i\\le n}} G\\vec{e_i}\\frac{\\textcolor{orange}{M} m_i}{r_i^2}
\\end{split}
`}


Для простоты возьмём гравитационную постоянную равной 1 (численное значение имеет смысл только в сравнении с другими ${link.href('https://en.wikipedia.org/wiki/Coupling_constant')`константами взаимодействий`}).


Итоговое уравнение для ускорения имеет вид
${math.block()`
\\vec{a} = \\sum_{\\mathclap{1\\le i\\le n}} \\vec{e_i}\\frac{m_i}{r_i^2}
`}

Перепишем его явно через вектор положения каждого тела в системе отсчёта основного тела ${math`\\vec{R_i} = \\{x_i,\\ y_i,\\ z_i\\}`}
${math.block()`
\\vec{a} = \\sum_{\\mathclap{1\\le i\\le n}} \\frac{\\vec{R_i}}{|\\vec{R_i}|}\\frac{m_i}{|\\vec{R_i}|^2}
`}


${header.level(3)`Реализация в браузере`}
${header.level(4)`Подсчёт ускорения`}
Сначала создадим звёзды и планеты.
На самом деле разницы с точки зрения кода не будет, все они будут просто небесными телами и отличаться только массой.


Устройство небесного тела
${code.lang('typescript')`
type Body = {
    coords: Coords; // координаты центра
    speed: Speed; // скорость
    acceleration: Acceleration; // ускорение
    mass: number;
    color: string; // цвет только для отображения на экране, в физике не участвует
};
`}

Координаты, скорость и ускорение описываются также досточно лаконично.
Для простоты модели третьей координаты ${math`z`} не будет.
${code.lang('typescript')`
type Axes = 'x' | 'y';
type Vector<T> = Record<Axes, T>;


type S = number; // координаты
type Coords = Vector<S>;


type V = number; // скорость
type Speed = Vector<V>;


type A = number; // ускорение
type Acceleration = Vector<A>;
`}


Чтобы реализовать формулу выше, необходимо посчитать сумму векторов, для этого сначала вычислим каждый вектор
${code.lang('typescript')`
// current: Body — текущее тело, для которого считаем ускорение
// bodyList: Body[] — остальные тела, которые создают ускорение


const accelerationVectors: Acceleration[] = bodyList.map(
    ({ mass, coords }) => {
        // считаем относительные координаты, по умолчанию метрика евклидова
        const localX = metrika.getX(current.coords, coords);
        const localY = metrika.getY(current.coords, coords);


        // квадрат расстояния
        const L2 = localX ** 2 + localY ** 2;


        // само расстояние
        const L = Math.sqrt(L2);


        // единичные вектора
        const vX = localX / L;
        const vY = localY / L;


        // длина вектора ускорения
        const a = mass / metrika.powerK(L2);

        return {
            x: vX * a,
            y: vY * a,
        };
    }
);
`}

Далее просто просуммируем их
${code.lang('typescript')`
const sumAcceleration: Acceleration = {
    x: accelerationVectors.map(v => v.x).reduce(sum),
    y: accelerationVectors.map(v => v.y).reduce(sum),
};
`}

Вектор ускорения посчитан!


${header.level(4)`Метрика`}
В коде выше для рассчёта относительных координат был использован отдельный объект метрики.
Этот объект не совпадает с классическим определением ${link.href('https://en.wikipedia.org/wiki/Metric_space')`метрического пространства`}, так как, во-первых, высчитываются отдельные координаты вместо расстояния, во-вторых, не требуется соблюдение ${link.href('https://en.wikipedia.org/wiki/Triangle_inequality')`неравенства треугольника`}.


Метрика устроена как группа методов
${code.lang('typescript')`
type S = number; // координаты

type Metrika = {
    getX(c1: Coords, c2: Coords): S;
    getY(c1: Coords, c2: Coords): S;


    // нормализация (для конечных пространств типа тора)
    normalizeX(c: Coords): S;
    normalizeY(c: Coords): S;
    powerK(l: number): number;
};
`}

Для плоского пространства она будет иметь вид
${code.lang('typescript')`
// плоское пространство
const defaultMetrika: Metrika = {
    getX: (c1, c2) => c2.x - c1.x,
    getY: (c1, c2) => c2.y - c1.y,
    normalizeX: (c) => c.x,
    normalizeY: (c) => c.y,
    powerK: (l) => l,
};
`}


${header.level(4)`Движение тел`}
Общая идея такова — итеративно рассчитывать ускорение, затем скорость и координаты.
Плавность анимации обеспечит вызов такого пересчёта в ${link.href('https://developer.mozilla.org/ru/docs/Web/API/window/requestAnimationFrame')`window.requestAnimationFrame`}


После получения вектора ускорения посчитаем скорость, так как ускорение это просто изменение скорости, то результатирующая скорость получится суммированием
${code.lang('typescript')`
const speed = {
    x: current.speed.x + sumAcceleration.x,
    y: current.speed.y + sumAcceleration.y,
};
`}

Аналогично, скорость — это изменение координат
${code.lang('typescript')`
const coords = {
    x: current.coords.x + speed.x,
    y: current.coords.y + speed.y,
};
`}


Для всех тел сначала посчитаем новые позиции/скорости/ускорения, потом обновим данные для каждого тела
${code.lang('typescript')`
export function positionStep(list: Body[], metrika = defaultMetrika) {
    // считаем новые данные относительно старых позиций
    const newPositions = list.map((body, i) =>
        getPosition(
            body,
            list.filter((_, j) => i !== j),
            metrika
        )
    );

    // и только потом обновляем все тела
    list.forEach((body, i) => updatePosition(body, newPositions[i]));
}
`}

Эта функция как раз и будет вызываться в ${pre`window.requestAnimationFrame`}
${code.lang('javascript')`
let requestId; // идентификатор для отмены вызова

function step() {
    // та самая метрика, которую можно менять извне
    const { metrika } = props();


    // список тел в текущем стейте
    const { list } = state();


    // пересчёт векторов и положений
    positionStep(list, metrika);


    // тик рендера
    state.set((prev) => ({ flag: !prev.flag }));


    // управление анимацией
    const needStep = state().animation;
    if (needStep) {
        requestId = window.requestAnimationFrame(step);
    } else {
        requestId && window.cancelAnimationFrame(requestId);
    }
}
`}


${header.level(3)`Визуальная часть`}
${header.level(4)`Отрисовка`}
Всё действие происходит внутри элемента 500x500px.
Все тела представлены как элементы ${pre`div`} с ${pre`border-radius: 50%`} и абсолютным позиционированием, их координаты в модели совпадают с координатами в css.
Все вычисления ведутся в пискелях.
Цвет тел задаётся сразу и не меняется, а размер вычисляется как кубический корень из массы с неким коэфициентом (считаем плотность тел постоянной, значит масса пропорциональна объёму, а значит кубу линейного размера).


Вектор скорости показан зелёным цветом, вектор ускорения красным.
В начале тела не имеют ускорения
${image.src('/data/blog/data/20/gravitation-start.png').width(0.9).height(0.9)('Пример начального положения')}

В процессе ускорение появляется и постоянно меняется, как и скорость
${image.src('/data/blog/data/20/gravitation-process.png').width(0.9).height(0.9)('Пример положения тел спустя некоторое время')}


По умолчанию вектора скрыты, как и массы тел, их можно включить через кнопки управления (также можно сбросить до начального состояния).


${header.level(4)`Встраивание в сайт`}
Завёл отдельную страницу ${link.href('?/physics/gravitation')`Гравитация`}.
В разделе ${link.href('?/physics')`Физика`}, где находится страница, добавил соответствующую плитку с анимацией планеты, которая вращается вокруг звезды (но там всё проще, css анимация через ${pre`rotate`}).
В блоге также над всеми записями появилась плашка с переходом на страницу, она будет мной в дальнейшем использована для новых событий (показывается первые две недели после появления).


${header.level(3)`Проблемы и хитрости`}
Так как шаг итерации не зависит от масштаба, то при близком расположении тел начинает проявлятся ошибка округления.
Закон сохранения импульса перестаёт работать и тела разгоняются до бесконечности.


Чтобы это обойти, в уравнение для вычисления ускорения я беру не расстояние между телами, а сумму этого расстояния с диаметром тела.
Таким образом задаётся максимальная сила, что может действовать на тело.


В метрике тора также не выполняется закон сохранения импульса, и поэтому там сила зависит не от квадрата расстояния, а просто от расстояния.
`;
};
