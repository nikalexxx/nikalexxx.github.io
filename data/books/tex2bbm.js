import fs from 'node:fs';

function mathlines(str) {
    return str;
    // .replace(/\n\s*\$\s*\n/g, '\n$\n')
    // .replace(/\n\s*\$\$\s*\n/g, '\n$$\n');
}

function math(str) {
    return str
        .split('\n')
        .map((r) =>
            r
                .replace(/\$\$([^\$]+)\$\$/g, `{{\n$1\n}}`)
                .replace(/\$([^\$]+)\$/g, `{{$1}}`)
        )
        .join('\n')
        .replaceAll('}}}', '} }}');
}

function removeSpace(str) {
    return str.replace(/~/g, ' ');
}

function signs(str) {
    return str
        .replace(/\\т/g, ' —')
        .replace(/\\ /g, ' ')
        .replace(/\\,/g, '')
        .replace(/\\-/g, '')
        .replace(/\\лк\s*/g, '«')
        .replace(/\\пк/g, '»')
        .replace(/\\итд/g, 'и т.д.')
        .replace(/\\д\s?/g, '-');
}

const knownDefs = [
    'index',
    'theorem',
    'proof',
    'problem',
    'glossary',
    'section',
    'chapter',
    'cite',
];
function knownDef(str) {
    let result = str;
    for (const name of knownDefs) {
        result = result
            .replaceAll(`\\${name}{`, `{def:${name} `)
            .replaceAll(`\\begin{${name}}`, `{#start:def:${name}}`)
            .replaceAll(`\\end{${name}}`, `{#end:def:${name}}`);
    }
    return result;
}

function format(str) {
    return str
        .replaceAll('\\textbf{', '{format:b ')
        .replaceAll('\\textsf{', '{format:pre ')
        .replaceAll('\\emph{', '{em ')
        .replaceAll('\\И ', '{format:b И}')
        .replaceAll('\\Л ', '{format:b Л}');
}

function ref(str) {
    return str.replace(/\\ref\{/g, '{def:link ');
}

function emptycomment(str) {
    return str.replaceAll('%\n', '\n');
}

function lines(str) {
    return str
        .replace(/([a-zA-Zа-яА-ЯёЁ,])\n/g, '$1 ')
        .replace(/\. ([a-zA-Zа-яА-ЯёЁ])/g, '.\n$1');
}

const pipe =
    (...list) =>
    (v) =>
        list.reduce((r, f) => f(r), v);

const getBbm = pipe(
    emptycomment,
    removeSpace,
    signs,
    format,
    knownDef,
    ref,
    mathlines,
    lines,
    math
);

const path = process.argv[2];
const text = fs.readFileSync(path + '.tex', { encoding: 'utf-8' });

fs.writeFileSync(path + '.bbm', getBbm(text));
