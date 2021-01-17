var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import chapter1 from './1/index.js';
import chapter2 from './2/index.js';
import lib from './lib.js';
import prefaceAuthors from './preface-authors.js';
export default (function (api) {
    var book = api.book, _ = api._, text = api.text, block = api.block, meta = api.meta, math = api.math, control = api.control;
    var h = text.h, label = text.label;
    var $ = math.$, $$ = math.$$;
    var area = block.area;
    var start = control.start, end = control.end;
    return _(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n", "\n\n", "\n\n\n", "\n\n\n", "\n\n\n", "\n\n\n\n"], ["\n", "\n\n", "\n\n\n", "\n\n\n", "\n\n\n", "\n\n\n\n"])), h(1)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\u041D\u0430\u0447\u0430\u043B\u0430 \u0442\u0435\u043E\u0440\u0438\u0438 \u043C\u043D\u043E\u0436\u0435\u0441\u0442\u0432"], ["\u041D\u0430\u0447\u0430\u043B\u0430 \u0442\u0435\u043E\u0440\u0438\u0438 \u043C\u043D\u043E\u0436\u0435\u0441\u0442\u0432"]))), prefaceAuthors(api), chapter1(api), chapter2(api), lib(api));
});
var templateObject_1, templateObject_2;
