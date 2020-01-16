import {
    E,
    block,
    Component,
    css
} from '../../utils/index.js';

css(import.meta.url, 'GameOfLife.less');

const b = block('game-of-life');
// console.log('game of life!!!!!!!!!')

const range = (start, end) => {
    const result = [];
    for (let i = start; i <= end; i++) {
        result.push(i);
    }
    return result;
}

const Game = Component.Game(({
    props,
    getState,
    setState,
    initState,
    didMount
}) => {
    const {
        H = 200, W = 400
    } = props;
    initState({
        i: 0,
        size: 0,
        stop: true,
        H,
        W
    });

    let canvas, img_data, data, ctx, rule = {
        new: [2,3],
        old: [3]
    }, fieldState, fieldStateNext;


    didMount(() => {
        const {
            startFieldState
        } = props;
        const {
            H,
            W
        } = getState();

        fieldState = new Array(H * W);
        fieldStateNext = new Array(H * W);
        for (let i = 0; i < H * W; i++) {
            fieldState[i] = false;
            fieldStateNext[i] = false;
        }

        if (startFieldState) {
            set_life(startFieldState);
        }
        canvas = document.getElementById('field');
        ctx = canvas.getContext('2d', {
            alpha: false
        });
        img_data = ctx.getImageData(0, 0, W, H);
        data = img_data.data;
        for (let k = 0; k < H * W * 4; k++) {
            data[k] = (k + 1) % 4 == 0 ? 255 : 0;
        }

        // paint();
        // rules();

        draw();
        life();
    })


    function torsum(i, j) {
        const {
            H,
            W,
            fieldState: state
        } = getState();
        // положение строки над текущей клеткой
        const i_top_W = (i ? i - 1 : H - 1) * W;
        // положение строки под текущей клеткой
        const i_down_W = (H - 1 - i ? i + 1 : 0) * W;
        // положение строки текущей клетки
        const i_W = i * W;
        // столбец слева от текущей клетки
        const j_l = j ? j - 1 : W - 1;
        // столбец справа от текущей клетки
        const j_r = W - 1 - j ? j + 1 : 0;
        return (
            +state[i_top_W + j_l] +
            state[i_top_W + j] +
            state[i_top_W + j_r] +
            state[i_W + j_l] +
            state[i_W + j_r] +
            state[i_down_W + j_l] +
            state[i_down_W + j] +
            state[i_down_W + j_r]
        );
    }

    function set_life(array) {
        const {
            W
        } = getState();
        for (const e of array) {
            fieldState[(e[1] + 50) * W + e[0] + 50] = true;
            fieldStateNext[(e[1] + 50) * W + e[0] + 50] = true;
        }
    }

    function clear() {
        const {W, H} = getState();
        for (let k = 0; k < H * W * 4; k++) {
            data[k] = (k + 1) % 4 === 0 ? 255 : 0;
        }
        for (let k = 0; k < H * W; k++) {
            fieldState[k] = (data[k * 4] === 255);
        }
        ctx.putImageData(img_data, 0, 0);
        setState({stop: true, i: 0});
    }

    function draw() {
        const {H, W} = getState();
        console.log(ctx);
        for (let k = 0; k < H * W; k++) {
            if (+fieldState[k] !== !data[k * 4 + 1]) {
                data[k * 4] = fieldState[k] ? 255 : 0;
            }
        }
        ctx.putImageData(img_data, 0, 0);
    }

    function step() {
        let i, j, sum, k = 0;
        for (i = 0; i < H; i++) {
            for (j = 0; j < W; j++) {
                sum = torsum(i, j);
                if (fieldState[k]) {
                    fieldStateNext[k] = rule.new.includes(sum);
                } else {
                    fieldStateNext[k] = rule.old.includes(sum);
                }
                k++;
            }
        }
        for (k = 0; k < H * W; k++) {
            fieldState[k] = fieldStateNext[k];
        }
    }

    function one_step() {
        step();
        draw();
        setState(prevState => ({i: prevState.i + 1}));
    }

    function life() {
        const {stop} = getState();
        if (!stop) {
            one_step();
        }
        setState({size: fieldState.reduce((sum, x) => sum += x)});
        setTimeout(life, 1000);
    }

    function rules() {
        document.getElementById('cells_new').addEventListener('click', update_rule);
        document.getElementById('cells_old').addEventListener('click', update_rule);

        update(document.getElementById('cells_new').querySelector('input'));
        update(document.getElementById('cells_old').querySelector('input'));

        function update_rule(e) {
            let elem = e.target;
            if (elem.tagName !== 'INPUT') return;
            update(elem);
        }

        function update(elem) {
            type = elem.name;
            list = elem.closest(`#cells_${type}`).querySelectorAll('input');
            list = Array.from(list).filter(x => x.checked).map(x => +x.id);
            rule[type] = list;
        }
    }

    function update(elem) {
        type = elem.name;
        list = elem.closest(`#cells_${type}`).querySelectorAll('input');
        list = Array.from(list).filter(x => x.checked).map(x => +x.id);
        rule[type] = list;
    }

    return () => {
        const {
            stop,
            H,
            W,
            i,
            size
        } = getState();
        return E.div.class(b())(
            E.canvas.id('field').width(W).height(H),
            E.p('Поколение ', E.span.id('old')(i)),
            E.p('Популяция ', E.span.id('size')(size)),
            E.input.type('button')
            .value(stop ? '>' : '||')
            .onClick(() => {
                setState(prevState => ({
                    stop: !prevState.stop
                }))
            }).id('play'),
            E.input.type('button').value('1>').onClick(() => one_step()),
            E.input.type('button').value('X').onClick(() => clear()).id('btn_clear'),
            E.br,
            E.div.id('cells_new')(
                E.p('Рождение'),
                range(0, 8).map(i =>
                    E.label(
                        E.input.type('checkbox').name('new').id(i),
                        i
                    )
                )
            ),
            E.br,
            E.div.id('cells_old')(
                E.p('Смерть'),
                range(0, 8).map(i => E.label(E.input.type('checkbox').name('old').id(i), i))
            )
        );
    }
}).startFieldState([
    [3, 0],
    [4, 1],
    [0, 2],
    [4, 2],
    [1, 3],
    [2, 3],
    [3, 3],
    [4, 3],
    [0, 7],
    [1, 8],
    [2, 8],
    [2, 9],
    [2, 10],
    [1, 11],
    [3, 14],
    [4, 15],
    [0, 16],
    [4, 16],
    [1, 17],
    [2, 17],
    [3, 17],
    [4, 17]
]);




function initGame() {


    function paint() {
        canvas.onmousedown = startDrawing;
        canvas.onmouseup = stopDrawing;
        canvas.onmouseout = stopDrawing;
        canvas.onmousemove = draw;

        let context = ctx;
        let isDrawing;

        context.strokeStyle = 'rgb(255,0,0)';
        context.lineWidth = 1;

        let pause = false;

        function startDrawing(e) {

            // Начинаем рисовать
            isDrawing = true;
            if (!stop) {
                stop = true;
                pause = true;
            }

            // Создаем новый путь (с текущим цветом и толщиной линии)
            context.beginPath();

            // Нажатием левой кнопки мыши помещаем "кисть" на холст
            context.moveTo(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop);
        }


        function draw(e) {
            if (isDrawing == true) {
                // Определяем текущие координаты указателя мыши
                var x = e.pageX - canvas.offsetLeft;
                var y = e.pageY - canvas.offsetTop;

                // Рисуем линию до новой координаты
                context.lineTo(x, y);
                context.stroke();
            }
        }

        function stopDrawing() {
            isDrawing = false;
            if (pause) {
                stop = false;
                pause = false;
            }


            img_data = ctx.getImageData(0, 0, W, H);
            data = img_data.data;
            for (let k = 0; k < H * W; k++) {
                state[k] = (data[k * 4] == 255);
            }
        }
    }

    function rules() {
        document.getElementById('cells_new').addEventListener('click', update_rule);
        document.getElementById('cells_old').addEventListener('click', update_rule);

        update(document.getElementById('cells_new').querySelector('input'));
        update(document.getElementById('cells_old').querySelector('input'));

        function update_rule(e) {
            let elem = e.target;
            if (elem.tagName !== 'INPUT') return;
            update(elem);

        }

        function update(elem) {
            type = elem.name;
            list = elem.closest(`#cells_${type}`).querySelectorAll('input');
            list = Array.from(list).filter(x => x.checked).map(x => +x.id);
            rule[type] = list;
        }
    }
}

export default Game;
