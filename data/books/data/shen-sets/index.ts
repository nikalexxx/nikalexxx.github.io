import chapter1 from './1/index.js';
import chapter2 from './2/index.js';
import lib from './lib.js';
import prefaceAuthors from './preface-authors.js';

export default (api) => {
    const { book, _, text, block, meta, math, control } = api;
    const { h, label } = text;
    const {$, $$} = math;
    const {area} = block;
    const {start, end} = control;
    return _`
${h(1)`Начала теории множеств`}

${prefaceAuthors(api)}


${chapter1(api)}


${chapter2(api)}


${lib(api)}



`;
};
