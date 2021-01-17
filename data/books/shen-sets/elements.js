var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
export function getHeaders(h) {
    return {
        chapter: h(2),
        paragraph: h(3)
    };
}
export var enote = function (api) {
    return api.text.tooltip.text('Примечание к электронному изданию')(templateObject_1 || (templateObject_1 = __makeTemplateObject([" @"], [" @"])));
};
export var set = {
    N: function (api) {
        return api.book(templateObject_4 || (templateObject_4 = __makeTemplateObject(["", " \u2014 \u043C\u043D\u043E\u0436\u0435\u0441\u0442\u0432\u043E \u043D\u0430\u0442\u0443\u0440\u0430\u043B\u044C\u043D\u044B\u0445 \u0447\u0438\u0441\u0435\u043B ", ""], ["", " \u2014 \u043C\u043D\u043E\u0436\u0435\u0441\u0442\u0432\u043E \u043D\u0430\u0442\u0443\u0440\u0430\u043B\u044C\u043D\u044B\u0445 \u0447\u0438\u0441\u0435\u043B ",
            ""])), api.math.$(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\\N"], ["\\\\N"]))), api.math
            .$(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\\{0, 1, 2, ...\\}"], ["\\\\{0, 1, 2, ...\\\\}"]))));
    }
};
export var teor_start = '\\vartriangleleft';
export var teor_end = '\\vartriangleright';
export var ttt = '\\mathellipsis';
var problemIndex = 1;
export var problem = function (api) { return api.text.b(templateObject_5 || (templateObject_5 = __makeTemplateObject(["", "."], ["", "."])), problemIndex++); };
function counter(start, step) {
    if (step === void 0) { step = 1; }
    var current = start;
    return function () { return (current += step); };
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
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
