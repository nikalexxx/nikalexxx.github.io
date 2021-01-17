export function getHeaders(h) {
    return {
        chapter: h(2),
        paragraph: h(3),
    };
}

export const enote = (api) =>
    api.text.tooltip.text('Примечание к электронному изданию')` @`;

export const set = {
    N: (api) =>
        api.book`${api.math.$`\\N`} — множество натуральных чисел ${api.math
            .$`\\{0, 1, 2, ...\\}`}`,
};

export const teor_start = '\\vartriangleleft';
export const teor_end = '\\vartriangleright';
export const ttt = '\\mathellipsis';

let problemIndex = 1;
export const problem = (api) => api.text.b`${problemIndex++}.`;

function counter(start: number, step: number = 1) {
    let current = start;
    return () => (current += step);
}

// function container<P, R>(getFunc: (A: P) => R) {
//     const getFuncProxy = (props: P) =>
//         new Proxy(getFunc(props) as any, {
//             get(target, name) {
//                 return (value) => getFuncProxy({ ...props, [name]: value });
//             },
//         });

//     return getFuncProxy({} as P);
// }
// function problem1(api) {
//     const {start, end} = api.control;
//     return container<{key: string}, any>(({ key }) => {

//     });
// }
