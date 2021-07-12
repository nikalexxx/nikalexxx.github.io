var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
export var ttt = '\\mathellipsis';
function counter(start, step) {
    if (start === void 0) { start = 0; }
    if (step === void 0) { step = 1; }
    var current = start;
    return function () { return (current += step); };
}
function container(getFunc) {
    var getFuncProxy = function (props) {
        return new Proxy(function (t) {
            var list = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                list[_i - 1] = arguments[_i];
            }
            return getFunc(props).apply(void 0, __spreadArray([t], list));
        }, {
            get: function (target, name) {
                return function (value) {
                    var _a;
                    return getFuncProxy(__assign(__assign({}, props), (_a = {}, _a[name] = value, _a)));
                };
            }
        });
    };
    return getFuncProxy({});
}
var counters = new Map();
export var counterKeys;
(function (counterKeys) {
    counterKeys["problem"] = "problem";
    counterKeys["theorem"] = "theorem";
    counterKeys["chapter"] = "chapter";
    counterKeys["paragraph"] = "paragraph";
})(counterKeys || (counterKeys = {}));
export function registerCounter(key, start, step) {
    if (start === void 0) { start = 0; }
    if (step === void 0) { step = 1; }
    counters.set(key, counter(start, step));
}
function getCounter(key) {
    if (counters.has(key)) {
        return counters.get(key);
    }
    throw new Error("Counter for " + key + " does not exist");
}
function getProblem(api) {
    var control = api.control, book = api.book, text = api.text, block = api.block;
    var start = control.start, end = control.end;
    var b = text.b;
    var area = block.area, small = block.small;
    var problemCounter = getCounter(counterKeys.problem);
    return container(function (_a) {
        var key = _a.key;
        return function (t) {
            var list = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                list[_i - 1] = arguments[_i];
            }
            var n = problemCounter();
            var problemKey = "problem_" + (key !== null && key !== void 0 ? key : n);
            return book(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n        ", "\n        ", "\n        ", "\n        "], ["\n        ", "\n        ", "\n        ", "\n        "])), start(area.key(problemKey).meta({ n: n })), small(templateObject_1 || (templateObject_1 = __makeTemplateObject(["", ". ", ""], ["", ". ", ""])), b(n), book.apply(void 0, __spreadArray([t], list))), end(area));
        };
    });
}
function getTheorem(api) {
    var control = api.control, book = api.book, text = api.text, block = api.block;
    var start = control.start, end = control.end;
    var b = text.b;
    var area = block.area;
    var theoremCounter = getCounter(counterKeys.theorem);
    return container(function (_a) {
        var key = _a.key, name = _a.name;
        return function (t) {
            var list = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                list[_i - 1] = arguments[_i];
            }
            var n = theoremCounter();
            var theoremKey = "theorem_" + (key !== null && key !== void 0 ? key : n);
            return book(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n        ", "\n        ", ". ", "\n        ", "\n        "], ["\n        ", "\n        ", ". ", "\n        ", "\n        "])), start(area.key(theoremKey).meta({ n: n })), b("\u0422\u0435\u043E\u0440\u0435\u043C\u0430 " + n + (name ? " (" + name + ")" : '')), book.apply(void 0, __spreadArray([t], list)), end(area));
        };
    });
}
var headerLevels = [];
var headerOrder = [counterKeys.chapter, counterKeys.paragraph];
function addHeaderLevel(tree, name, n) {
    var lastLevel = tree[tree.length - 1];
    if (!lastLevel || lastLevel.name === name) {
        tree.push({ name: name, n: n, children: [] });
    }
    else {
        addHeaderLevel(lastLevel.children, name, n);
    }
}
function getLevels(tree, name) {
    var lastLevel = tree[tree.length - 1];
    if (!lastLevel) {
        return [];
    }
    if (lastLevel.name === name) {
        return [];
    }
    var levels = [
        {
            name: lastLevel.name,
            n: lastLevel.n
        },
    ];
    levels.push.apply(levels, getLevels(lastLevel.children, name));
    return levels;
}
function getCustomHeader(api, level, name) {
    var control = api.control, book = api.book, text = api.text, block = api.block;
    var start = control.start, end = control.end;
    var b = text.b, h = text.h;
    var area = block.area;
    var levels = getLevels(headerLevels, name);
    var levelKey = levels.map(function (e) { return e.n; }).join('.');
    var headerCounter = getCounter("header_" + levelKey);
    return container(function (_a) {
        var key = _a.key, noIndex = _a.noIndex;
        return function (t) {
            var list = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                list[_i - 1] = arguments[_i];
            }
            if (noIndex) {
                return book(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n            ", "\n            ", "\n            ", "\n            "], ["\n            ", "\n            ", "\n            ", "\n            "])), start(key ? area.key(key) : area), h(level)(book.apply(void 0, __spreadArray([t], list))), end(area));
            }
            var n = headerCounter();
            var longN = "" + levelKey + (levelKey === '' ? '' : '.') + n;
            var headerKey = name + "_" + (key !== null && key !== void 0 ? key : n);
            registerCounter("header_" + longN);
            addHeaderLevel(headerLevels, name, n);
            return book(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n        ", "\n        ", "\n        ", "\n        "], ["\n        ", "\n        ", "\n        ", "\n        "])), start(area.key(headerKey).meta({ n: n, longN: longN })), h(level)(book(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n        ", ". ", "\n        "], ["\n        ", ". ", "\n        "])), b("" + longN), book.apply(void 0, __spreadArray([t], list)))), end(area));
        };
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
            end: api.math.$('\\vartriangleright')
        },
        enote: api.text.tooltip.text('Примечание к электронному изданию')(templateObject_7 || (templateObject_7 = __makeTemplateObject(["@"], ["@"]))),
        n: {
            problem: function (key) { return api.use(templateObject_8 || (templateObject_8 = __makeTemplateObject(["problem_", ""], ["problem_", ""])), key)(function (e) { return e.n; }); },
            theorem: function (key) { return api.use(templateObject_9 || (templateObject_9 = __makeTemplateObject(["theorem_", ""], ["theorem_", ""])), key)(function (e) { return e.n; }); },
            chapter: function (key) { return api.use(templateObject_10 || (templateObject_10 = __makeTemplateObject(["chapter_", ""], ["chapter_", ""])), key)(function (e) { return e.longN; }); },
            paragraph: function (key) { return api.use(templateObject_11 || (templateObject_11 = __makeTemplateObject(["paragraph_", ""], ["paragraph_", ""])), key)(function (e) { return e.longN; }); }
        },
        A: api.math.$(templateObject_12 || (templateObject_12 = __makeTemplateObject(["A"], ["A"]))),
        B: api.math.$(templateObject_13 || (templateObject_13 = __makeTemplateObject(["B"], ["B"]))),
        C: api.math.$(templateObject_14 || (templateObject_14 = __makeTemplateObject(["C"], ["C"]))),
        X: api.math.$(templateObject_15 || (templateObject_15 = __makeTemplateObject(["X"], ["X"]))),
        Y: api.math.$(templateObject_16 || (templateObject_16 = __makeTemplateObject(["Y"], ["Y"]))),
        Z: api.math.$(templateObject_17 || (templateObject_17 = __makeTemplateObject(["Z"], ["Z"]))),
        M: api.math.$(templateObject_18 || (templateObject_18 = __makeTemplateObject(["M"], ["M"]))),
        printNote: container(function () { return function (t) {
            return api.text.tooltip.text("\u041E\u0440\u0438\u0433\u0438\u043D\u0430\u043B\u044C\u043D\u044B\u0439 \u0442\u0435\u043A\u0441\u0442 \u043F\u0440\u0438\u0432\u043E\u0434\u0438\u0442\u0441\u044F \u0431\u0435\u0437 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0439.\n\n\n                \u041D\u043E \u0432 \u044D\u043B\u0435\u043A\u0442\u0440\u043E\u043D\u043D\u043E\u043C \u0438\u0437\u0434\u0430\u043D\u0438\u0438 \u043D\u0435\u0442 \u043D\u0443\u043C\u0435\u0440\u0430\u0446\u0438\u0438 \u0441\u0442\u0440\u0430\u043D\u0438\u0446.\n\n\n                \u0412\u043E\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0439\u0442\u0435\u0441\u044C \u0441\u0441\u044B\u043B\u043A\u043E\u0439 \u0440\u044F\u0434\u043E\u043C \u0434\u043B\u044F \u043D\u0430\u0432\u0438\u0433\u0430\u0446\u0438\u0438.")(t);
        }; })
    };
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18;
