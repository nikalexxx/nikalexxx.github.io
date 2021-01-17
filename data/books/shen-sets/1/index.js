var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { getHeaders } from '../elements.js';
import paragraph1 from './1/index.js';
import paragraph2 from './2/index.js';
import paragraph3 from './3/index.js';
import paragraph4 from './4/index.js';
import paragraph5 from './5/index.js';
import paragraph6 from './6/index.js';
import paragraph7 from './7/index.js';
import paragraph8 from './8/index.js';
export default (function (api) {
    var book = api.book, _ = api._, text = api.text, block = api.block, meta = api.meta;
    var h = text.h;
    var _a = getHeaders(h), chapter = _a.chapter, paragraph = _a.paragraph;
    return _(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n", "\n\n\n", "\n\n\n", "\n\n\n", "\n\n\n", "\n\n\n", "\n\n\n", "\n\n\n", "\n\n\n", "\n"], ["\n", "\n\n\n", "\n\n\n", "\n\n\n", "\n\n\n", "\n\n\n", "\n\n\n", "\n\n\n", "\n\n\n", "\n"])), chapter('1. Множества и мощности'), paragraph1(api), paragraph2(api), paragraph3(api), paragraph4(api), paragraph5(api), paragraph6(api), paragraph7(api), paragraph8(api));
});
var templateObject_1;
