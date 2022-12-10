import { BookApi } from "@bookbox/preset-web";

export const ttt = '\\mathellipsis';

function counter(start: number = 0, step: number = 1) {
    let current = start;
    return () => (current += step);
}

function container<P, R>(getFunc: (A: P) => (t: any, ...list: any[]) => R) {
    const getFuncProxy = (props: P) =>
        new Proxy((t: any, ...list: any[]) => getFunc(props)(t, ...list) as any, {
            get(target, name) {
                return (value: any) => getFuncProxy({ ...props, [name]: value });
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

function getProblem(api: BookApi) {
    const { book, format, area, start, end } = api;
    const { b, small } = format;
    const problemCounter = getCounter(counterKeys.problem)!;
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

function getTheorem(api: BookApi) {
    const { start, end, book, format, area } = api;
    const { b } = format;
    const theoremCounter = getCounter(counterKeys.theorem)!;
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

function getCustomHeader(api: any, level: any, name: any) {
    const { start, end, book, header, area, format } = api;
    const { b } = format;
    const levels = getLevels(headerLevels, name);
    const levelKey = levels.map((e) => e.n).join('.');
    const headerCounter = getCounter(`header_${levelKey}`)!;
    return container<{ key: string; noIndex: boolean }, any>(
        ({ key, noIndex }) => (t, ...list) => {
            if (noIndex) {
                return book`
            ${start(key ? area.key(key) : area)}
            ${header.level(level)(book(t, ...list))}
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
        ${header.level(level)(book`
        ${b(`${longN}`)}. ${book(t, ...list)}
        `)}
        ${end(area)}
        `;
        }
    );
}

export function registerHeaders() {
    registerCounter('header_');
    headerLevels = [];
}

export function getCustomElements(api: BookApi) {
    return {
        problem: getProblem(api),
        theorem: getTheorem(api),
        chapter: getCustomHeader(api, 2, 'chapter'),
        paragraph: getCustomHeader(api, 3, 'paragraph'),
        proof: {
            start: api.math('\\vartriangleleft'),
            end: api.math('\\vartriangleright'),
        },
        enote: api.tooltip.content('Примечание к электронному изданию')`@`,
        n: {
            problem: (key: string) => api.use.ref(`problem_${key}`).path`n`,
            theorem: (key: string) => api.use.ref(`theorem_${key}`).path`n`,
            chapter: (key: string) => api.use.ref(`chapter_${key}`).path`longN`,
            paragraph: (key: string) => api.use.ref(`paragraph_${key}`).path`longN`,
        },
        A: api.math`A`,
        B: api.math`B`,
        C: api.math`C`,
        X: api.math`X`,
        Y: api.math`Y`,
        Z: api.math`Z`,
        M: api.math`M`,
        printNote: container(() => (t) => {
            return api.tooltip.content(
                `Оригинальный текст приводится без изменений.


                Но в электронном издании нет нумерации страниц.


                Воспользуйтесь ссылкой рядом для навигации.`
            )(t);
        }),
    };
}
