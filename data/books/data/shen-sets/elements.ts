export const ttt = '\\mathellipsis';


function counter(start: number = 0, step: number = 1) {
    let current = start;
    return () => (current += step);
}

function container<P, R>(getFunc: (A: P) => (t: any, ...list: any[]) => R) {
    const getFuncProxy = (props: P) =>
        new Proxy((t, ...list) => getFunc(props)(t, ...list) as any, {
            get(target, name) {
                return (value) => getFuncProxy({ ...props, [name]: value });
            },
        });

    return getFuncProxy({} as P) as any;
}

const counters = new Map<string, () => number>();

export enum counterKeys {
    problem = 'problem',
    theorem = 'theorem',
    chapter = 'chapter',
    paragraph = 'paragraph',
}

export function registerCounter(
    key: string,
    start: number = 0,
    step: number = 1
) {
    counters.set(key, counter(start, step));
}

function getCounter(key: string) {
    if (counters.has(key)) {
        return counters.get(key);
    }
    throw new Error(`Counter for ${key} does not exist`);
}

function getProblem(api) {
    const { control, book, text, block } = api;
    const { start, end } = control;
    const { b } = text;
    const { area, small } = block;
    const problemCounter = getCounter(counterKeys.problem);
    return container<{ key: string }, any>(({ key }) => (t, ...list) => {
        const n = problemCounter();
        const problemKey = `problem_${key ?? n}`;
        return book`
        ${start(area.key(problemKey).meta({ n }))}
        ${small`${b(n)}. ${book(t, ...list)}`}
        ${end(area)}
        `;
    });
}

function getTheorem(api) {
    const { control, book, text, block } = api;
    const { start, end } = control;
    const { b } = text;
    const { area } = block;
    const theoremCounter = getCounter(counterKeys.theorem);
    return container<{ key: string; name: string }, any>(
        ({ key, name }) => (t, ...list) => {
            const n = theoremCounter();
            const theoremKey = `theorem_${key ?? n}`;
            return book`
        ${start(area.key(theoremKey).meta({ n }))}
        ${b(`Теорема ${n}${name ? ` (${name})` : ''}`)}. ${book(t, ...list)}
        ${end(area)}
        `;
        }
    );
}

type HeaderTree = HeaderItem[];
type HeaderItem = {
    name: string;
    n: number;
    children: HeaderTree;
};

let headerLevels = [] as HeaderTree;

const headerOrder = [counterKeys.chapter, counterKeys.paragraph];

function addHeaderLevel(tree: HeaderTree, name: string, n: number) {
    const lastLevel = tree[tree.length - 1];
    if (!lastLevel || lastLevel.name === name) {
        tree.push({ name, n, children: [] });
    } else {
        addHeaderLevel(lastLevel.children, name, n);
    }
}

interface HeaderLevel {
    name: string;
    n: number;
}

function getLevels(tree: HeaderTree, name: string): HeaderLevel[] {
    const lastLevel = tree[tree.length - 1];
    if (!lastLevel) {
        return [];
    }
    if (lastLevel.name === name) {
        return [];
    }
    const levels = [
        {
            name: lastLevel.name,
            n: lastLevel.n,
        },
    ];
    levels.push(...getLevels(lastLevel.children, name));
    return levels;
}

function getCustomHeader(api, level, name) {
    const { control, book, text, block } = api;
    const { start, end } = control;
    const { b, h } = text;
    const { area } = block;
    const levels = getLevels(headerLevels, name);
    const levelKey = levels.map((e) => e.n).join('.');
    const headerCounter = getCounter(`header_${levelKey}`);
    return container<{ key: string, noIndex: boolean }, any>(({ key, noIndex }) => (t, ...list) => {
        if (noIndex) {
            return book`
            ${start(key ? area.key(key) : area)}
            ${h(level)(book(t, ...list))}
            ${end(area)}
            `;
        }
        const n = headerCounter();
        const longN = `${levelKey}${levelKey === '' ? '' : '.'}${n}`;
        const headerKey = `${name}_${key ?? n}`;
        registerCounter(`header_${longN}`);
        addHeaderLevel(headerLevels, name, n);
        return book`
        ${start(area.key(headerKey).meta({ n, longN }))}
        ${h(level)(book`
        ${b(`${longN}`)}. ${book(t, ...list)}
        `)}
        ${end(area)}
        `;
    });
}

export function registerHeaders() {
    registerCounter('header_');
    headerLevels = [];
}

export function getCustomElements(api) {
    return {
        problem: getProblem(api),
        theorem: getTheorem(api),
        chapter: getCustomHeader(api, 2, 'chapter'),
        paragraph: getCustomHeader(api, 3, 'paragraph'),
        proof: {
            start: api.math.$('\\vartriangleleft'),
            end: api.math.$('\\vartriangleright'),
        },
        enote: api.text.tooltip.text('Примечание к электронному изданию')`@`,
        n: {
            problem: (key) => api.use`problem_${key}`((e) => e.n),
            theorem: (key) => api.use`theorem_${key}`((e) => e.n),
            chapter: (key) => api.use`chapter_${key}`((e) => e.longN),
            paragraph: (key) => api.use`paragraph_${key}`((e) => e.longN),
        },
        A: api.math.$`A`,
        B: api.math.$`B`,
        C: api.math.$`C`,
        X: api.math.$`X`,
        Y: api.math.$`Y`,
        Z: api.math.$`Z`,
        M: api.math.$`M`,
    };
}
