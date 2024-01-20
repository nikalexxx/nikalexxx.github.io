type Axes = 'x' | 'y';
type Vector<T> = Record<Axes, T>;

// const getGetters = <K extends string>(
//     ...keys: K[]
// ): Record<K, <T>(v: Record<K, T>) => T> => {
//     return Object.fromEntries(
//         keys.map((key) => [key, (v) => v[key]])
//     ) as ReturnType<typeof getGetters>;
// };

// const GV = getGetters('x', 'y');

type S = number;
export type Coords = Vector<S>;

type V = number;
export type Speed = Vector<V>;

type A = number;
export type Acceleration = Vector<A>;

export type Body = {
    coords: Coords;
    speed?: Speed;
    acceleration?: Acceleration;
    mass: number;
    color: string;
};

function sum<T extends number>(acc: number, current: T): number {
    return acc + current;
}

export type Metrika = {
    getX(c1: Coords, c2: Coords): S;
    getY(c1: Coords, c2: Coords): S;
    normalizeX(c: Coords): S;
    normalizeY(c: Coords): S;
    powerK(l: number): number;
};

// плоское пространство
const defaultMetrika: Metrika = {
    getX: (c1, c2) => c2.x - c1.x,
    getY: (c1, c2) => c2.y - c1.y,
    normalizeX: (c) => c.x,
    normalizeY: (c) => c.y,
    powerK: (l) => l,
};

export function getPosition(
    current: Body,
    bodyList: Body[],
    metrika: Metrika = defaultMetrika
): { coords: Coords; speed: Speed; acceleration: Acceleration } {
    const accelerationVectors: Acceleration[] = bodyList.map(
        ({ mass, coords }) => {
            const localX = metrika.getX(current.coords, coords);
            const localY = metrika.getY(current.coords, coords);
            let L2 = localX ** 2 + localY ** 2;
            const r = mass ** (1 / 3);
            let L = Math.sqrt(L2);
            L2 = (L + Math.max(r, 1)) ** 2;
            L = Math.sqrt(L2);
            const vX = localX / L;
            const vY = localY / L;
            const a = mass / metrika.powerK(L2);

            return {
                x: vX * a,
                y: vY * a,
            };
        }
    );

    const sumAcceleration: Acceleration = {
        x: accelerationVectors.map((v) => v.x).reduce(sum),
        y: accelerationVectors.map((v) => v.y).reduce(sum),
    };

    const speed = {
        x: (current.speed?.x ?? 0) + sumAcceleration.x,
        y: (current.speed?.y ?? 0) + sumAcceleration.y,
    };

    const coords = {
        x: current.coords.x + speed.x,
        y: current.coords.y + speed.y,
    };

    return {
        speed,
        coords: {
            x: metrika.normalizeX(coords),
            y: metrika.normalizeY(coords),
        },
        acceleration: sumAcceleration,
    };
}

function updatePosition(
    current: Body,
    newData: ReturnType<typeof getPosition>
): void {
    if (!current.acceleration) {
        current.acceleration = { x: 0, y: 0 };
    }
    if (!current.speed) {
        current.speed = { x: 0, y: 0 };
    }
    const { coords, speed, acceleration } = newData;
    current.coords.x = coords.x;
    current.coords.y = coords.y;
    current.speed.x = speed.x;
    current.speed.y = speed.y;
    current.acceleration.x = acceleration.x;
    current.acceleration.y = acceleration.y;
}

export function positionStep(list: Body[], metrika = defaultMetrika) {
    const newPositions = list.map((body, i) =>
        getPosition(
            body,
            list.filter((_, j) => i !== j),
            metrika
        )
    );

    list.forEach((body, i) => updatePosition(body, newPositions[i]));
}

// метрика на торе
export const finiteToroidMetrika: Metrika = {
    getX: (c1, c2) => {
        const l = c2.x - c1.x;
        if (Math.abs(l) <= 250) {
            return l;
        }
        if (c1.x < c2.x) {
            return c2.x - (500 + c1.x);
        }
        return 500 + c2.x - c1.x;
    },

    getY: (c1, c2) => {
        const l = c2.y - c1.y;
        if (Math.abs(l) <= 250) {
            return l;
        }
        if (c1.y < c2.y) {
            return c2.y - (500 + c1.y);
        }
        return 500 + c2.y - c1.y;
    },
    normalizeX: (c) => (500 + c.x) % 500,
    normalizeY: (c) => (500 + c.y) % 500,
    powerK: (l) => Math.sqrt(l),
};
