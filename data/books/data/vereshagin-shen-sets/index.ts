import type { BookApi } from '@bookbox/preset-web';
import { counterKeys, registerCounter, registerHeaders } from './elements.js';

import chapter1 from './1/index.js';
import chapter2 from './2/index.js';
import lib from './lib.js';
import names from './names.js';
import prefaceAuthors from './preface-authors.js';
import prefaceEbook from './preface-ebook.js';

export default (api: BookApi) => {
    const { book, link, authors, title } = api;
    registerCounter(counterKeys.problem);
    registerCounter(counterKeys.theorem);
    registerHeaders();
    return book.root`

ЛЕКЦИИ ПО МАТЕМАТИЧЕСКОЙ ЛОГИКЕ И ТЕОРИИ АЛГОРИТМОВ


${authors`
${link.href('http://lpcs.math.msu.su/~ver/')`Н. К. Верещагин`},
${link.href('https://ru.wikipedia.org/wiki/Шень,_Александр_Ханиевич')`А.Шень`}
`}
${title`Начала теории множеств`}


${prefaceEbook(api)}


${prefaceAuthors(api)}


${chapter1(api)}


${chapter2(api)}


${lib(api)}


${names(api)}

`;
};
