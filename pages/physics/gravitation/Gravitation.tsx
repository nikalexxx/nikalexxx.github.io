import { block, memo, NOT, RouteLink } from "../../../utils";
import { Breadcrumbs, PageGrid } from "../../../components";
import { Button, Lang } from "../../../blocks";
import {
    Body,
    finiteToroidMetrika,
    Metrika,
    positionStep,
} from "../../../services/gravitation";
import { Icon } from "../../../icons/index";
import { randInRange } from "../../../utils/random";
import { Component, debug } from "parvis";

import "./Gravitation.less";

const b = block("gravitation");

const r500 = randInRange(500);

const getBodyObject = ({
    body,
    showVectors,
    showMass,
}: {
    body: Required<Body>;
    showVectors: boolean;
    showMass: boolean;
}) => {
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
    return (
        <div
            style={`
        background-color: ${color};
        position: absolute;
        top: ${coords.x - radius}px;
        left: ${coords.y - radius}px;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
    `}
        >
            <div
                style={`
            position: absolute;
            display: ${showVectors ? "block" : "none"};
            top: ${radius}px;
            left: ${radius - speedLength / 2}px;
            width: ${speedLength}px;
            height: 1px;
            background: linear-gradient(to right, transparent, transparent 50%, green 50%);
            transform: rotate(${speedAngle}rad);
        `}
            />
            <div
                style={`
            position: absolute;
            display: ${showVectors ? "block" : "none"};
            top: ${radius}px;
            left: ${radius - accelerationLength / 2}px;
            width: ${accelerationLength}px;
            height: 1px;
            background: linear-gradient(to right, transparent, transparent 50%, red 50%);
            transform: rotate(${accelerationAngle}rad);
        `}
            />
            <div
                style={`
            background-color: ${color};
            position: absolute;
            top: 0;
            left: 0;
            width: ${size}px;
            height: ${size}px;
            box-shadow: ${mass > 500 ? `0 0 20px ${color}` : 'none'};
            border-radius: 50%;
        `}
            />
            <div
                style={`
            position: absolute;
            display: ${showMass ? "block" : "none"};
            top: ${size}px;
            left: ${size}px;
            font-size: 9px;
        `}
            >
                {mass}
            </div>
        </div>
    );
};

const Space = Component<{ metrika?: Metrika; list: () => Body[] }>(
    "Space",
    ({ props, state }) => {
        const [animation, setAnimation] = state(false);
        const [flag, setFlag] = state(true);
        const [showVectors, setShowVectors] = state(false);
        const [showMass, setShowMass] = state(false);
        const [list, setList] = state(props().list());

        let requestId: number;

        function step() {
            const { metrika } = props();
            const bodyList = list();
            positionStep(bodyList, metrika);
            const needStep = animation();
            setFlag(NOT);
            if (needStep) {
                requestId = window.requestAnimationFrame(step);
            } else {
                requestId && window.cancelAnimationFrame(requestId);
            }
        }

        return () => {
            return (
                <div>
                    <div class={b("controls")}>
                        <Button
                            on:click={() => {
                                setAnimation(NOT);
                                requestId = window.requestAnimationFrame(step);
                            }}
                        >
                            <div
                                title={animation() ? "Pause" : "Play"}
                                class={b("play")}
                            >
                                {animation() ? <Icon.Pause /> : <Icon.Play />}
                            </div>
                        </Button>
                        <Button on:click={() => setShowVectors(NOT)}>
                            {showVectors() ? "Hide" : "Show"}{" "}
                            <ruby style={`color: green;`}>
                                v <rt>⟶</rt>
                            </ruby>
                            <ruby style={`color: red;`}>
                                a <rt>⟶</rt>
                            </ruby>
                        </Button>
                        <Button on:click={() => setShowMass(NOT)}>
                            {showMass() ? "Hide" : "Show"} mass
                        </Button>
                        <Button
                            on:click={() => {
                                setList(props().list());
                                setAnimation(false);
                            }}
                        >
                            Reset
                        </Button>
                    </div>
                    <div class={b("space")}>
                        {list().map((body) =>
                            getBodyObject({
                                body,
                                showVectors: showVectors(),
                                showMass: showMass(),
                            })
                        )}
                    </div>
                </div>
            );
        };
    }
);

const v1 = () => [
    {
        color: "orange",
        mass: 1000,
        coords: { x: 250, y: 250 },
        speed: { x: 0, y: 0 },
    },
    {
        color: "royalblue",
        mass: 1,
        coords: { x: 140, y: 70 },
        speed: { x: -1, y: 1 },
    },
    {
        color: "brown",
        mass: 5,
        coords: { x: 140, y: 150 },
        speed: { x: 1, y: -1 },
    },
];

const v2 = () => [
    {
        color: "orange",
        mass: 1000,
        coords: { x: 300, y: 300 },
        speed: { x: -2, y: 0 },
    },
    {
        color: "orange",
        mass: 1000,
        coords: { x: 300, y: 200 },
        speed: { x: 2, y: 0 },
    },
    {
        color: "royalblue",
        mass: 2,
        coords: { x: 120, y: 250 },
        speed: { x: 0, y: 3 },
    },
];

const v3 = () => [
    {
        color: "orange",
        mass: 1000,
        coords: { x: 300, y: 200 },
        speed: { x: 0, y: 0 },
    },
    ...Array(50)
        .fill(0)
        .map(() => ({
            color: "royalblue",
            mass: 0,
            coords: { x: r500(), y: r500() },
            speed: { x: (r500() - 250) / 100, y: (r500() - 250) / 100 },
        }))
        .filter(
            (body) =>
                (body.coords.x > 320 || body.coords.x < 280) &&
                (body.coords.y > 220 || body.coords.y < 180)
        ),
];

const v4 = memo((mass) => () => [
    {
        color: "green",
        mass,
        coords: { x: 300, y: 100 },
        speed: { x: 0, y: 0 },
    },
    {
        color: "orange",
        mass,
        coords: { x: 300, y: 310 },
        speed: { x: 0, y: 0 },
    },
    {
        color: "red",
        mass,
        coords: { x: 200, y: 207 },
        speed: { x: 0, y: 0 },
    },
]);

const SIZE = 500;
const N = 22;
const P = Math.trunc(SIZE / N);
const v5 = memo(
    (mass) => () =>
        Array.from({ length: N - 1 }, (_, i) => i + 1).flatMap((x) =>
            Array.from({ length: N - 1 }, (_, i) => i + 1).map((y) => ({
                color: "green",
                mass: +mass + Math.trunc(+mass * Math.random()),
                coords: {
                    x: x * P + (Math.random() * P) / 2,
                    y: y * P + (Math.random() * P) / 2,
                },
                speed: {
                    x: Math.trunc(3 * (0.5 - Math.random())),
                    y: Math.trunc(3 * (0.5 - Math.random())),
                },
            }))
        )
);

export const Gravitation = Component("Gravitation", () => {
    return () => {
        return (
            <div>
                <Breadcrumbs
                    items={[
                        [<Lang token={`menu/physics`} />, "physics"],
                        [<Lang token={`tile/gravitation`} />],
                    ]}
                />
                <div style={`padding: 16px;`}>
                    <p>
                        Читайте{" "}
                        <RouteLink href={"blog/20"}>
                            подробное описание
                        </RouteLink>{" "}
                        реализации в блоге
                    </p>
                    <br />
                    <PageGrid itemWidth={550}>
                        <div>
                            <h3>1 звезда, 2 планеты</h3>
                            <Space list={v1} />
                        </div>
                        <div>
                            <h3>2 звезды, 1 планета</h3>
                            <Space list={v2} />
                        </div>
                        <div>
                            <h3>Массивная звезда, много планет</h3>
                            <p>
                                Планеты со случайным расположениями и
                                скоростями, их массы бесконечно малы по
                                сравнению с центральной звездой
                            </p>
                            <Space list={v3} />
                        </div>
                    </PageGrid>
                    <br />
                    <h3>Задача трёх тел</h3>
                    <PageGrid itemWidth={550}>
                        <div>
                            <p>
                                Классическая иллюстрация, 3 тела с нулевыми
                                скоростями
                            </p>
                            <br />
                            <Space list={v4(200)} />
                        </div>

                        <div>
                            <p>
                                Гравитация на плоскости, свёрнутой в тор (концы
                                склеены), где сила притяжения обратно
                                пропорциональна не квадрату расстояния, а просто
                                расстоянию.
                            </p>
                            <br />
                            <Space
                                list={v4(1)}
                                metrika={finiteToroidMetrika}
                            />
                        </div>
                    </PageGrid>
                    <h3>N тел</h3>
                    <PageGrid itemWidth={550}>
                        <div>
                            <p>
                                N тел со случайными скоростями. После первого схлопывания некоторые тела разлетаются, другие образуют плотное облако.
                            </p>
                            <br />
                            <Space list={v5(2)} />
                        </div>
                    </PageGrid>
                </div>
            </div>
        );
    };
});
