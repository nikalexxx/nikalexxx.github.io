import { block, Component, E, memo, RouteLink } from '../../../utils';
import { Breadcrumbs, PageGrid } from '../../../components';
import { Button, Lang } from '../../../blocks';
import {
    finiteToroidMetrika,
    positionStep,
} from '../../../services/gravitation';
import { Icon } from '../../../icons/index.js';
import { randInRange } from '../../../utils/random';

import './Gravitation.less';

const b = block('gravitation');

const r500 = randInRange(500);

const getBodyObject = ({ body, showVectors, showMass }) => {
    const { mass, coords, color, speed, acceleration = { x: 0, y: 0 } } = body;
    const size = Math.ceil(Math.min(Math.max(mass ** (1 / 3) * 3, 5), 100));
    const radius = size / 2;
    const speedLength =
        Math.ceil(Math.sqrt(speed.y ** 2 + speed.x ** 2) * 10) + size;
    const speedAngle = Math.atan2(speed.x, speed.y);

    const accelerationLength =
        Math.ceil(Math.sqrt(acceleration.y ** 2 + acceleration.x ** 2) * 100) +
        size;
    const accelerationAngle = Math.atan2(acceleration.x, acceleration.y);
    return E.div.style`
        background-color: ${color};
        position: absolute;
        top: ${coords.x - radius}px;
        left: ${coords.y - radius}px;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
    `(
        E.div.style`
            position: absolute;
            display: ${showVectors ? 'block' : 'none'};
            top: ${radius}px;
            left: ${radius - speedLength / 2}px;
            width: ${speedLength}px;
            height: 1px;
            background: linear-gradient(to right, transparent, transparent 50%, green 50%);
            transform: rotate(${speedAngle}rad);
        `(),
        E.div.style`
            position: absolute;
            display: ${showVectors ? 'block' : 'none'};
            top: ${radius}px;
            left: ${radius - accelerationLength / 2}px;
            width: ${accelerationLength}px;
            height: 1px;
            background: linear-gradient(to right, transparent, transparent 50%, red 50%);
            transform: rotate(${accelerationAngle}rad);
        `(),
        E.div.style`
            background-color: ${color};
            position: absolute;
            top: 0;
            left: 0;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
        `(),
        E.div.style`
            position: absolute;
            display: ${showMass ? 'block' : 'none'};
            top: ${size}px;
            left: ${size}px;
            font-size: 9px;
        `(mass)
    );
};

const Space = Component.Space(({ props, state, hooks }) => {
    state.init({
        animation: false,
        flag: true,
        showVectors: false,
        showMass: false,
        list: props().list(),
    });

    let requestId;

    function step() {
        const { metrika } = props();
        const { list } = state();
        positionStep(list, metrika);
        const needStep = state().animation;
        state.set((prev) => ({ flag: !prev.flag }));
        if (needStep) {
            requestId = window.requestAnimationFrame(step);
        } else {
            requestId && window.cancelAnimationFrame(requestId);
        }
    }

    return () => {
        const { animation, showVectors, showMass, list } = state();
        return E.div(
            E.div.class(b('controls'))(
                Button.onClick(() =>
                    state.set(
                        (prev) => ({ animation: !prev.animation }),
                        () => {
                            requestId = window.requestAnimationFrame(step);
                        }
                    )
                )(
                    E.div.title(animation ? 'Pause' : 'Play').class(b('play'))(
                        animation ? Icon.Pause : Icon.Play
                    )
                ),
                Button.onClick(() =>
                    state.set((prev) => ({ showVectors: !prev.showVectors }))
                )(
                    showVectors ? 'Hide' : 'Show',
                    ' ',
                    E.ruby.style`color: green;`('v', E.rt('⟶')),
                    ', ',
                    E.ruby.style`color: red;`('a', E.rt('⟶'))
                ),
                Button.onClick(() =>
                    state.set((prev) => ({ showMass: !prev.showMass }))
                )(showMass ? 'Hide' : 'Show', ' mass'),
                Button.onClick(() =>
                    state.set(() => ({
                        list: props().list(),
                        animation: false,
                    }))
                )('Reset')
            ),
            E.div.class(b('space'))(
                list.map((body) =>
                    getBodyObject({ body, showVectors, showMass })
                )
            )
        );
    };
});

export const Gravitation = Component.Gravitation(() => {
    const v1 = () => [
        {
            color: 'orange',
            mass: 1000,
            coords: { x: 250, y: 250 },
            speed: { x: 0, y: 0 },
        },
        {
            color: 'royalblue',
            mass: 1,
            coords: { x: 140, y: 70 },
            speed: { x: -1, y: 1 },
        },
        {
            color: 'brown',
            mass: 5,
            coords: { x: 140, y: 150 },
            speed: { x: 1, y: -1 },
        },
    ];

    const v2 = () => [
        {
            color: 'orange',
            mass: 1500,
            coords: { x: 300, y: 300 },
            speed: { x: -2, y: 0 },
        },
        {
            color: 'orange',
            mass: 1500,
            coords: { x: 300, y: 200 },
            speed: { x: 2, y: 0 },
        },
        {
            color: 'royalblue',
            mass: 2,
            coords: { x: 120, y: 250 },
            speed: { x: 0, y: 3 },
        },
    ];
    const v3 = () => [
        {
            color: 'orange',
            mass: 1000,
            coords: { x: 300, y: 200 },
            speed: { x: 0, y: 0 },
        },
        ...Array(50)
            .fill(0)
            .map(() => ({
                color: 'royalblue',
                mass: 0,
                coords: { x: r500(), y: r500() },
                speed: { x: (r500() - 250) / 100, y: (r500() - 250) / 100 },
            }))
            .filter(
                (e) =>
                    (e.coords.x > 320 || e.coords.x < 280) &&
                    (e.coords.y > 220 || e.coords.y < 180)
            ),
    ];

    const v4 = memo((mass) => () => [
        {
            color: 'green',
            mass,
            coords: { x: 300, y: 100 },
            speed: { x: 0, y: 0 },
        },
        {
            color: 'orange',
            mass,
            coords: { x: 300, y: 310 },
            speed: { x: 0, y: 0 },
        },
        {
            color: 'red',
            mass,
            coords: { x: 200, y: 207 },
            speed: { x: 0, y: 0 },
        },
    ]);

    return () => {
        return E.div(
            Breadcrumbs.items([
                [Lang.token`menu/physics`, 'physics'],
                [Lang.token`tile/gravitation`],
            ]),
            E.div.style`padding: 16px;`(
                E.p`Читайте ${RouteLink.href('blog/20')`подробное описание`} реализации в блоге`,
                E.br,
                PageGrid.itemWidth(550)(
                    E.div(E.h3`1 звезда, 2 планеты`, Space.list(v1)),
                    E.div(E.h3`2 звезды, 1 планета`, Space.list(v2)),
                    E.div(
                        E.h3`Массивная звезда, много планет`,
                        E.p`Планеты со случайным расположениями и скоростями, их массы бесконечно малы по сравнению с центральной звездой`,
                        Space.list(v3)
                    )
                ),
                E.br,
                E.h3`Задача трёх тел`,
                PageGrid.itemWidth(550)(
                    E.div(
                        E.p`Классическая иллюстрация, 3 тела с нулевыми скоростями`,
                        E.br,
                        Space.list(v4(200))
                    ),

                    E.div(
                        E.p`Гравитация на плоскости, свёрнутой в тор (концы склеены), где сила притяжения обратно пропорциональна не квадрату расстояния, а просто расстоянию.`,
                        E.br,
                        Space.list(v4(30)).metrika(finiteToroidMetrika)
                    )
                )
            )
        );
    };
});
