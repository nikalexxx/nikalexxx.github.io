var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { counterKeys, registerCounter, registerHeaders } from './elements.js';
import chapter1 from './1/index.js';
import chapter2 from './2/index.js';
import lib from './lib.js';
import names from './names.js';
import prefaceAuthors from './preface-authors.js';
import prefaceEbook from './preface-ebook.js';
export default (function (api) {
    var book = api.book, text = api.text, meta = api.meta;
    var author = meta.author;
    var h = text.h, a = text.a;
    registerCounter(counterKeys.problem);
    registerCounter(counterKeys.theorem);
    registerHeaders();
    return book.root(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n\n\u041B\u0415\u041A\u0426\u0418\u0418 \u041F\u041E \u041C\u0410\u0422\u0415\u041C\u0410\u0422\u0418\u0427\u0415\u0421\u041A\u041E\u0419 \u041B\u041E\u0413\u0418\u041A\u0415 \u0418 \u0422\u0415\u041E\u0420\u0418\u0418 \u0410\u041B\u0413\u041E\u0420\u0418\u0422\u041C\u041E\u0412\n\n\n", ",\n", "\n\n\n", "\n\n\n", "\n\n\n", "\n\n\n", "\n\n\n", "\n\n\n", "\n\n\n", "\n\n\n\n"], ["\n\n\u041B\u0415\u041A\u0426\u0418\u0418 \u041F\u041E \u041C\u0410\u0422\u0415\u041C\u0410\u0422\u0418\u0427\u0415\u0421\u041A\u041E\u0419 \u041B\u041E\u0413\u0418\u041A\u0415 \u0418 \u0422\u0415\u041E\u0420\u0418\u0418 \u0410\u041B\u0413\u041E\u0420\u0418\u0422\u041C\u041E\u0412\n\n\n", ",\n", "\n\n\n", "\n\n\n", "\n\n\n", "\n\n\n", "\n\n\n", "\n\n\n", "\n\n\n", "\n\n\n\n"])), author(a.href('http://lpcs.math.msu.su/~ver/')(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\u041D. \u041A. \u0412\u0435\u0440\u0435\u0449\u0430\u0433\u0438\u043D"], ["\u041D. \u041A. \u0412\u0435\u0440\u0435\u0449\u0430\u0433\u0438\u043D"])))), author(a.href('https://ru.wikipedia.org/wiki/Шень,_Александр_Ханиевич')(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\u0410.\u0428\u0435\u043D\u044C"], ["\u0410.\u0428\u0435\u043D\u044C"])))), h(1)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\u041D\u0430\u0447\u0430\u043B\u0430 \u0442\u0435\u043E\u0440\u0438\u0438 \u043C\u043D\u043E\u0436\u0435\u0441\u0442\u0432"], ["\u041D\u0430\u0447\u0430\u043B\u0430 \u0442\u0435\u043E\u0440\u0438\u0438 \u043C\u043D\u043E\u0436\u0435\u0441\u0442\u0432"]))), prefaceEbook(api), prefaceAuthors(api), chapter1(api), chapter2(api), lib(api), names(api));
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
