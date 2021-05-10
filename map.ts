type MapParams = {
    id: '$id';
    name: '$name';
    elem: '$elem';
};

const mapSymbol = Symbol.for('map');

const mapBuilder: MapParams = (new Proxy(
    { [mapSymbol]: '' },
    {
        get(_, name: string) {
            return `:${name}`;
        },
    }
) as any) as MapParams;

type MapProxy<T> = (() => string) &
    {
        [K in keyof T]: T[K] extends MapParams ? () => string : MapProxy<T[K]>;
    };

const mapModel = <T>(e: MapParams) => ({
    '/': e,
    about: e,
    design: {
        colors: e,
        themes: e,
        components: e,
    },
    blog: {
        [e.id]: e,
    },
    books: {
        [e.name]: {
            [e.elem]: e,
        },
    },
    projects: {
        unicode: e,
        'game-of-life': e,
    },
    physics: {
        'standart-model': e,
    },
    travels: {
        altai: e,
    },
    catalog: e,
});

function getMap<T>(obj: T, path: string): MapProxy<T> {
    return new Proxy(() => path, {
        get(_, name: string) {
            const value = obj[name];
            const newPath = `${path}/${name}`;
            console.log({value});
            return value[Symbol.for('map')]
                ? () => newPath
                : getMap(value, newPath);
        },
    }) as MapProxy<T>;
}

export const map2 = getMap(mapModel(mapBuilder), '');

