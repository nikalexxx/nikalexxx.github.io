// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"utils/bem.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var block = function block(blockName) {
  var block = String(blockName);
  return function (element, modifiers, mixin) {
    var cssStack = [];
    var elementName = block + (element ? "__".concat(element) : '');
    cssStack.push(elementName);

    for (var mod in modifiers) {
      var value = modifiers[mod];

      if (typeof value === 'boolean') {
        if (value) {
          cssStack.push("".concat(elementName, "_").concat(mod));
        }
      } else {
        cssStack.push("".concat(elementName, "_").concat(mod, "_").concat(value));
      }
    }

    return cssStack.join(' ');
  };
};

var _default = block;
exports.default = _default;
},{}],"utils/style.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var cssProps = [];

  for (var prop in props) {
    var name = prop.replace(/[A-Z]/g, function (x) {
      return '-' + x.toLowerCase();
    });
    cssProps.push("".concat(name, ": ").concat(props[prop], ";"));
  }

  return cssProps.join(' ');
}
},{}],"utils/symbols.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.componentSymbol = exports.elementSymbol = void 0;
var elementSymbol = Symbol('element');
exports.elementSymbol = elementSymbol;
var componentSymbol = Symbol('component');
exports.componentSymbol = componentSymbol;
},{}],"utils/clone.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getClone = void 0;

var _symbols = require("./symbols.js");

var _element = require("./element.js");

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var getClone = function getClone(element) {
  // console.log('clone', element);
  if (!element.cloneNode) {
    throw new Error('clone не удался');
    return element;
  } // console.log({element});


  if (element.nodeType === 3) {
    return element.cloneNode(false);
  }

  var clone = _element.E[element.tagName.toLowerCase()];

  if (_symbols.elementSymbol in element) {
    clone = clone[Symbol('props')](element[_symbols.elementSymbol].props)(); // clone[elementSymbol] = element[elementSymbol];
  } else {
    clone = clone();
  }

  if (_symbols.componentSymbol in element) {
    clone[_symbols.componentSymbol] = element[_symbols.componentSymbol];
    clone[_symbols.componentSymbol].element = clone; // element[componentSymbol].element = clone;
  }

  if (element[_symbols.elementSymbol] && Object.keys(element[_symbols.elementSymbol].eventListeners).length > 0) {
    for (var _i = 0, _Object$keys = Object.keys(element[_symbols.elementSymbol].eventListeners); _i < _Object$keys.length; _i++) {
      var eventName = _Object$keys[_i];
      var listeners = element[_symbols.elementSymbol].eventListeners[eventName];

      var _iterator = _createForOfIteratorHelper(listeners),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var listener = _step.value;
          clone.addEventListener(eventName, listener, false);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }

  for (var _i2 = 0, _Array$from = Array.from(element.childNodes); _i2 < _Array$from.length; _i2++) {
    var child = _Array$from[_i2];
    var cloneChild = getClone(child);
    clone.append(cloneChild);
  }

  return clone;
};

exports.getClone = getClone;
},{"./symbols.js":"utils/symbols.js","./element.js":"utils/element.js"}],"utils/diff.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.diff = diff;
exports.raw = exports.isPrimitive = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _templateObject4() {
  var data = _taggedTemplateLiteral(["?"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral(["?"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["?"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["?"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var diffObject = function diffObject(t) {
  var _ref;

  return [t.delete, // Symbol('delete') для удаления примитива
  t.primitive, (_ref = {}, _defineProperty(_ref, t.array, t(_templateObject())(true)), _defineProperty(_ref, t.raw, t(_templateObject2())(true)), _defineProperty(_ref, t(String), t(_templateObject3())(diffObject)), _defineProperty(_ref, t(Symbol), t(_templateObject4())(diffObject)), _ref)];
};

var D = {
  delete: Symbol('delete'),
  array: Symbol('array'),
  raw: Symbol('raw'),
  meta: Symbol('meta'),
  new: Symbol('new')
};

var isPrimitive = function isPrimitive(value) {
  return value !== new Object(value);
};

exports.isPrimitive = isPrimitive;

var raw = function raw(value) {
  if (isPrimitive(value)) {
    return value;
  } // return {
  //     ...value,
  //     [D.raw]: true,
  //     [D.new]: value
  // }


  value[D.raw] = true;
  value[D.new] = value;
  return value;
}; // TODO: добавить поддержку циклических ссылок


exports.raw = raw;

function diff(A, B) {
  if (A === B) {
    // равенство по значению(для примитивов), либо по ссылке(для объектов)
    return {};
  }

  if (isPrimitive(A)) {
    if (isPrimitive(B)) {
      return B;
    } else {
      return raw(B);
    }
  } else {
    if (isPrimitive(B)) {
      return B;
    } else {
      if (typeof A === 'function') {
        // для функций заменяем всё, возможно стоит добавить другую проверку
        if (A === B) {
          return {};
        } else if (A.toString() === B.toString()) {
          return {};
        }

        return raw(B);
      } else if (Array.isArray(A)) {
        if (Array.isArray(B)) {
          // сравнение массивов
          var lA = A.length;
          var lB = B.length;
          var max = lA > lB ? lA : lB;
          var min = lA < lB ? lA : lB;
          var result = {};

          for (var i = 0; i < max; i++) {
            if (i < min) {
              // сравниваем общую часть
              var indexDiff = diff(A[i], B[i]); // сравниваем элементы

              if (isPrimitive(indexDiff) || indexDiff === D.delete || Object.keys(indexDiff).length > 0 || indexDiff[D.raw]) {
                result[String(i)] = indexDiff; // добавляем только отличия
              }
            } else if (lA < lB) {
              result[String(i)] = B[i]; // новые элементы
            } else {
              result[String(i)] = D.delete; // удаляем лишние
            }
          }

          if (Object.keys(result).length > 0) {
            result[D.array] = true;
          }

          return result;
        } else {
          // просто всё затираем
          return raw(B);
        }
      } else {
        // обычный объект
        if (typeof B === 'function' || Array.isArray(B)) {
          // не обычный объект
          return raw(B);
        } else {
          // сравнение объектов
          var _result = {};

          for (var _i = 0, _Object$keys = Object.keys(B); _i < _Object$keys.length; _i++) {
            var key = _Object$keys[_i];

            if (!(key in A)) {
              _result[key] = raw(B[key]); // новые ключи добавляем как есть
            }
          }

          for (var _i2 = 0, _Object$keys2 = Object.keys(A); _i2 < _Object$keys2.length; _i2++) {
            var _key = _Object$keys2[_i2];

            if (_key in B) {
              var keyDiff = diff(A[_key], B[_key]); // сравниваем рекурсивно

              if (isPrimitive(keyDiff) || keyDiff === D.delete || Object.keys(keyDiff).length > 0 || keyDiff[D.raw]) {
                _result[_key] = keyDiff; // добавляем только отличия
              }
            } else {
              _result[_key] = D.delete; // удаляем старые ключи
            }
          }

          return _result;
        }
      }
    }
  }
}

diff.symbols = D; // console.log(diff([1,2,3,6,8], [1,4,3,2]));
// console.log(diff({a:[1]}, {a:[2]}));
// console.log(diff({a:1,b:2, c:{}}, {a:2, c: {a:{s:{}}}}));
// console.log(document.head);
// console.log(document.body);
// console.log(diff(document.head, document.body));
},{}],"utils/element.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNode = getNode;
exports.patchDOM = patchDOM;
exports.diffElements = diffElements;
exports.M = exports.S = exports.E = exports.DOM = void 0;

var _clone = require("./clone.js");

var _symbols = require("./symbols.js");

var _diff = require("./diff.js");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _templateObject22() {
  var data = _taggedTemplateLiteral(["?"]);

  _templateObject22 = function _templateObject22() {
    return data;
  };

  return data;
}

function _templateObject21() {
  var data = _taggedTemplateLiteral(["?"]);

  _templateObject21 = function _templateObject21() {
    return data;
  };

  return data;
}

function _templateObject20() {
  var data = _taggedTemplateLiteral(["?"]);

  _templateObject20 = function _templateObject20() {
    return data;
  };

  return data;
}

function _templateObject19() {
  var data = _taggedTemplateLiteral(["?"]);

  _templateObject19 = function _templateObject19() {
    return data;
  };

  return data;
}

function _templateObject18() {
  var data = _taggedTemplateLiteral(["?"]);

  _templateObject18 = function _templateObject18() {
    return data;
  };

  return data;
}

function _templateObject17() {
  var data = _taggedTemplateLiteral(["?"]);

  _templateObject17 = function _templateObject17() {
    return data;
  };

  return data;
}

function _templateObject16() {
  var data = _taggedTemplateLiteral(["?"]);

  _templateObject16 = function _templateObject16() {
    return data;
  };

  return data;
}

function _templateObject15() {
  var data = _taggedTemplateLiteral(["?"]);

  _templateObject15 = function _templateObject15() {
    return data;
  };

  return data;
}

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _templateObject14() {
  var data = _taggedTemplateLiteral(["?"]);

  _templateObject14 = function _templateObject14() {
    return data;
  };

  return data;
}

function _templateObject13() {
  var data = _taggedTemplateLiteral(["red", ""]);

  _templateObject13 = function _templateObject13() {
    return data;
  };

  return data;
}

function _templateObject12() {
  var data = _taggedTemplateLiteral(["color: red;"]);

  _templateObject12 = function _templateObject12() {
    return data;
  };

  return data;
}

function _templateObject11() {
  var data = _taggedTemplateLiteral(["color: red;"]);

  _templateObject11 = function _templateObject11() {
    return data;
  };

  return data;
}

function _templateObject10() {
  var data = _taggedTemplateLiteral(["red ", ""]);

  _templateObject10 = function _templateObject10() {
    return data;
  };

  return data;
}

function _templateObject9() {
  var data = _taggedTemplateLiteral(["color: red;"]);

  _templateObject9 = function _templateObject9() {
    return data;
  };

  return data;
}

function _templateObject8() {
  var data = _taggedTemplateLiteral(["red"]);

  _templateObject8 = function _templateObject8() {
    return data;
  };

  return data;
}

function _templateObject7() {
  var data = _taggedTemplateLiteral(["color: red;"]);

  _templateObject7 = function _templateObject7() {
    return data;
  };

  return data;
}

function _templateObject6() {
  var data = _taggedTemplateLiteral(["color: red;"]);

  _templateObject6 = function _templateObject6() {
    return data;
  };

  return data;
}

function _templateObject5() {
  var data = _taggedTemplateLiteral(["text v = ", ""]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = _taggedTemplateLiteral(["text"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral(["example"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["ex"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["1"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var namespaceKeys = {
  'http://www.w3.org/1999/xhtml': 0,
  'http://www.w3.org/2000/svg': 1,
  'http://www.w3.org/1998/Math/MathML': 2
};
var namespaces = {
  '0': 'http://www.w3.org/1999/xhtml',
  '1': 'http://www.w3.org/2000/svg',
  '2': 'http://www.w3.org/1998/Math/MathML'
};

function getNode(node) {
  if (Array.isArray(node)) {
    var result = [];

    var _iterator = _createForOfIteratorHelper(node),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var elem = _step.value;

        if (Array.isArray(elem)) {
          result.push.apply(result, _toConsumableArray(getNode(elem)));
        } else {
          result.push(getNode(elem));
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    return result;
  } else if (typeof node === 'function') {
    return getNode(node());
  } else {
    return node;
  }
}

var strToArray = function strToArray(strings) {
  var list = [strings[0]];

  for (var _i = 1; _i < strings.length; _i++) {
    list.push(_i - 1 + 1 < 1 || arguments.length <= _i - 1 + 1 ? undefined : arguments[_i - 1 + 1], strings[_i]);
  }

  return list;
};

var DOM = function DOM(elementObject) {
  if ((0, _diff.isPrimitive)(elementObject)) {
    return document.createTextNode(elementObject);
  }

  var namespace = elementObject.namespace,
      tagName = elementObject.tagName,
      props = elementObject.props,
      children = elementObject.children,
      eventListeners = elementObject.eventListeners;
  var element = document.createElementNS(namespaces[String(namespace)], tagName);
  element[_symbols.elementSymbol] = {};

  for (var prop in props) {
    if (prop.startsWith('_')) {
      element[_symbols.elementSymbol][prop] = props[prop];
    } else {
      element.setAttribute(prop, String(props[prop]));
    }
  }

  for (var _i2 = 0, _Object$keys = Object.keys(eventListeners); _i2 < _Object$keys.length; _i2++) {
    var eventName = _Object$keys[_i2];
    var listener = eventListeners[eventName];
    element.addEventListener(eventName, listener, false);
  }

  if (Object.keys(children).length) {
    element.append.apply(element, _toConsumableArray(Object.values(children).map(function (e) {
      var dom = DOM(e);

      if (!(0, _diff.isPrimitive)(e)) {
        e.dom.parent = element;
      }

      return dom;
    })));
  }

  elementObject.dom = {
    ref: element
  };
  element[_symbols.elementSymbol] = elementObject;
  return element;
};

exports.DOM = DOM;

function patchDOM(dom, diffObject) {
  var upd = dom.parentNode;

  if (diffObject === _diff.diff.symbols.delete) {
    if (upd) {
      delete dom[_symbols.elementSymbol];
      dom.remove();
      return;
    } else {
      return undefined;
    }
  }

  if ((0, _diff.isPrimitive)(diffObject)) {
    if (dom.nodeType === 3) {
      // текстовый узел
      if (dom.nodeValue === String(diffObject)) {
        return undefined; // строки совпали
      } else {
        if (upd) {
          dom.nodeValue = String(diffObject); // обновляем текст

          return;
        } else {
          return document.createTextNode(diffObject);
        }
      }
    } else {
      if (upd) {
        dom.replaceWith(document.createTextNode(diffObject));
        return;
      } else {
        return document.createTextNode(diffObject);
      }
    }
  }

  var _diffObject$props = diffObject.props,
      props = _diffObject$props === void 0 ? {} : _diffObject$props,
      _diffObject$children = diffObject.children,
      children = _diffObject$children === void 0 ? {} : _diffObject$children,
      _diffObject$eventList = diffObject.eventListeners,
      eventListeners = _diffObject$eventList === void 0 ? {} : _diffObject$eventList,
      raw = diffObject[_diff.diff.symbols.raw];

  if (raw) {
    if (upd) {
      var newDom = DOM(diffObject);
      dom.replaceWith(newDom);

      if (!diffObject[_diff.diff.symbols.new].dom) {
        diffObject[_diff.diff.symbols.new].dom = {};
      }

      diffObject[_diff.diff.symbols.new].dom.ref = newDom;
      return;
    } else {
      return DOM(diffObject);
    }
  } // обновление свойств


  for (var prop in props) {
    if (props[prop] === _diff.diff.symbols.delete) {
      if (prop.startsWith('_')) {
        delete dom[_symbols.elementSymbol][prop];
      } else {
        dom.removeAttribute(prop);
      }
    } else {
      if (prop.startsWith('_')) {
        dom[_symbols.elementSymbol][prop] = props[prop];
      } else {
        dom.setAttribute(prop, props[prop]);
      }
    }
  } // обновление перехватчиков событий


  for (var _i3 = 0, _Object$keys2 = Object.keys(eventListeners); _i3 < _Object$keys2.length; _i3++) {
    var eventName = _Object$keys2[_i3];
    var listener = eventListeners[eventName];

    if (listener === _diff.diff.symbols.delete) {
      dom.removeEventListener(eventName, eventListeners[_diff.diff.symbols.meta].deleteListeners[eventName]);
    } else {
      if (!listener[_diff.diff.symbols.raw]) {
        dom.removeEventListener(eventName, eventListeners[_diff.diff.symbols.meta].deleteListeners[eventName]);
      }

      dom.addEventListener(eventName, listener, false);
    }
  } // обновление существующих потомков


  var list = Array.from(dom.childNodes);
  var updatedChildKeys = {};

  for (var _i4 = 0; _i4 < list.length; _i4++) {
    var child = list[_i4];
    var key = (child[_symbols.elementSymbol] || {})._key || String(_i4);

    if (key in children) {
      if (children[key] === _diff.diff.symbols.delete) {
        dom.removeChild(child);
      } else {
        patchDOM(child, children[key]);
        updatedChildKeys[key] = true;
      }
    }
  } // добавление новых потомков


  var newChildren = [];

  for (var _key in children) {
    if (!children[_key][_diff.diff.symbols.raw] && !(0, _diff.isPrimitive)(children[_key]) || children[_key] === _diff.diff.symbols.delete) {
      continue;
    }

    if (!(_key in updatedChildKeys)) {
      newChildren.push(DOM(children[_key]));
    }
  }

  if (newChildren.length > 0) {
    dom.append.apply(dom, newChildren);
  }

  if (!diffObject[_diff.diff.symbols.new].dom) {
    diffObject[_diff.diff.symbols.new].dom = {};
  }

  diffObject[_diff.diff.symbols.new].dom.ref = dom;

  if (!upd) {
    return dom;
  }
}

var example = function example(E) {
  return E.div.class(_templateObject3()).id(_templateObject2()).style(style)['data-value'](_templateObject()).apply(void 0, ['string', E.span(_templateObject4()), E.p('str'), E(_templateObject5(), E.span(2)), [// Fragment analog
  E.div.style(_templateObject6()), E.div.style(_templateObject7())('red'), E.div.style(_templateObject9())(_templateObject8()), E.div.style(_templateObject11())(_templateObject10(), E.span(1)), // red [Function]
  E.div.style(_templateObject12())(E(_templateObject13(), E.span(1))) // red 1
  ]].concat(_toConsumableArray([1, 2, 3].map(function (i) {
    return E.i._key(i)(i);
  })), [[1, 2, 3].map(function (i) {
    return E.i._key(i)(i);
  })]));
};

var elementStructure = function elementStructure(T) {
  return {
    nodeType: T(Number),
    namespace: T(String),
    tagName: T(String),
    props: T(_templateObject14())(_defineProperty({}, T(String), T(String))),
    children: T(_templateObject15())(Object)(T(elementStructure)),
    data: T(String)
  };
};

var diffStructure = function diffStructure(t) {
  return {
    nodeType: t(_templateObject16())(Number),
    // перезаписывает тип узла
    namespace: t(_templateObject17())(String),
    // новое пространство имён
    tagName: t(_templateObject18())(String),
    // новый тег
    props: t(_templateObject19())(_defineProperty({}, t(String), [t(String), t(null)])),
    children: t(_templateObject20())(Object)(t(diffStructure)),
    // рекурсивно повторить для потомков, лишние удалить, недостающие добавить, в будущем сопоставлять по ключу
    data: t(_templateObject21())(String),
    // поменять текстовый узел
    delete: t(_templateObject22())(true) // удалить элемент

  };
};

var diffFunctionStructure = function diffFunctionStructure(t) {
  return t(Function)(function (_ref) {
    var params = _ref.params;
    return t({
      params: {
        A: t(elementStructure),
        // старый элемент
        B: t(elementStructure) // новый элемент

      }
    })(t(diffStructure));
  });
};
/*
Использовать хэши от пропсов и потомков
в случае тектсовых нод - от значений
можно вычислить уже на этапе создания элемента из кода
хэш используем в качестве ключа элемента
рассмотреть случай коллизий
*/


var i = 0;

function diffElements(A, B) {
  // console.log({A, B});
  if (!B) {
    return _diff.diff.symbols.delete;
  }

  if ((0, _diff.isPrimitive)(A)) {
    if ((0, _diff.isPrimitive)(B)) {
      if (A !== B) {
        return (0, _diff.raw)(B);
      } else {
        return {};
      }
    } else {
      return (0, _diff.raw)(B);
    }
  }

  if ((0, _diff.isPrimitive)(B)) {
    return (0, _diff.raw)(B);
  }

  if (A.nodeType !== B.nodeType) {
    return (0, _diff.raw)(B);
  }

  if (A.namespace !== B.namespace) {
    return (0, _diff.raw)(B);
  }

  if (A.tagName !== B.tagName) {
    return (0, _diff.raw)(B);
  }

  if (B.props._forceUpdate) {
    return (0, _diff.raw)(B);
  }

  if ('_update' in B.props && !B.props._update) {
    return {};
  } // console.time('diff props');


  var diffProps = (0, _diff.diff)(A.props, B.props); // console.timeEnd('diff props');
  // console.time('diff events');

  var diffEventListeners = (0, _diff.diff)(A.eventListeners, B.eventListeners);

  for (var _i5 = 0, _Object$keys3 = Object.keys(diffEventListeners); _i5 < _Object$keys3.length; _i5++) {
    var eventName = _Object$keys3[_i5];

    if (diffEventListeners[eventName] === _diff.diff.symbols.delete) {
      if (!diffEventListeners[_diff.diff.symbols.meta]) {
        diffEventListeners[_diff.diff.symbols.meta] = {
          deleteListeners: {}
        };
      }

      diffEventListeners[_diff.diff.symbols.meta].deleteListeners[eventName] = A.eventListeners[eventName];
    }
  } // console.timeEnd('diff events');
  // const kc = 'diff children' + i;
  // console.time(kc);


  var diffChildren = {};

  for (var _i6 = 0, _Object$keys4 = Object.keys(B.children); _i6 < _Object$keys4.length; _i6++) {
    var key = _Object$keys4[_i6];

    if (!(key in A.children)) {
      diffChildren[key] = (0, _diff.raw)(B.children[key]); // новые ключи добавляем как есть
    }
  }

  for (var _i7 = 0, _Object$keys5 = Object.keys(A.children); _i7 < _Object$keys5.length; _i7++) {
    var _key2 = _Object$keys5[_i7];

    if (_key2 in B.children) {
      i++;
      var k = 'children diff for key ' + _key2 + i; // console.time(k);

      var diffItems = diffElements(A.children[_key2], B.children[_key2]); // сравниваем рекурсивно

      if ((0, _diff.isPrimitive)(diffItems) || diffItems === _diff.diff.symbols.delete || Object.keys(diffItems).length > 0) {
        diffChildren[_key2] = diffItems; // непустые добавляем
      } // console.timeEnd(k);

    } else {
      diffChildren[_key2] = _diff.diff.symbols.delete; // удаляем старые ключи
    }
  } // console.timeEnd(kc);
  // console.time('diff result');


  var result = {};

  if (Object.keys(diffProps).length > 0) {
    result.props = diffProps;
  }

  if (Object.keys(diffEventListeners).length > 0) {
    result.eventListeners = diffEventListeners;
  }

  if (Object.keys(diffChildren).length > 0) {
    result.children = diffChildren;
  }

  result[_diff.diff.symbols.new] = B; // console.timeEnd('diff result');

  return result;
}

function getProps(attributes) {
  if (!attributes) {
    return {};
  }

  var attrs = Array.from(attributes);
  var result = {};

  for (var _i8 = 0, _attrs = attrs; _i8 < _attrs.length; _i8++) {
    var _attrs$_i = _attrs[_i8],
        name = _attrs$_i.name,
        value = _attrs$_i.value;
    result[name] = value;
  }

  return result;
}

function getChildren(childNodes) {
  if (!childNodes) {
    return {};
  }

  var children = Array.from(childNodes);
  var result = {};

  for (var _i9 = 0; _i9 < children.length; _i9++) {
    var child = children[_i9];
    var key = child.hasAttribute && child.hasAttribute('data-key') ? child.getAttribute('data-key') : String(_i9);
    result[key] = getElementFromDOM(child);
  }

  return result;
}

function getElementFromDOM(domElement) {
  return {
    nodeType: domElement.nodeType,
    namespace: namespaceKeys[domElement.namespaceURI],
    tagName: domElement.tagName,
    props: getProps(domElement.attributes),
    children: getChildren(domElement.childNodes),
    data: domElement.data
  };
} // console.log(getElementFromDOM(document.head));
// console.log(getElementFromDOM(document.body));
// console.log(diffElements(getElementFromDOM(document.head), getElementFromDOM(document.body)));


var getElement = function getElement(namespace) {
  return new Proxy(strToArray, {
    get: function get(target, tag) {
      var create = function create() {
        var tagName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'div';
        var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var children = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
        var element = {
          namespace: namespaceKeys[namespace],
          tagName: tagName,
          props: {},
          children: {},
          eventListeners: {}
        };

        for (var prop in props) {
          if (prop.length > 2 && prop.startsWith('on') && prop[2] === prop[2].toUpperCase()) {
            var eventName = prop[2].toLowerCase() + prop.slice(3);
            var listener = props[prop];

            if (typeof listener !== 'function') {
              console.error(new Error("".concat(eventName, " listener is not function")));
              continue;
            }

            element.eventListeners[eventName] = listener;
          } else {
            element.props[prop] = props[prop];
          }
        }

        var nodes = [];

        var _iterator2 = _createForOfIteratorHelper(children.filter(function (e) {
          return e;
        })),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var _node = _step2.value;
            _node = getNode(_node);

            if (Array.isArray(_node)) {
              nodes.push.apply(nodes, _toConsumableArray(_node.filter(function (e) {
                return e;
              })));
            } else {
              nodes.push(_node);
            }
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }

        var dublicatedKeys = new Set();

        for (var _i10 = 0; _i10 < nodes.length; _i10++) {
          var node = nodes[_i10];
          var key = node.props && node.props._key && String(node.props._key);
          var index = String(_i10);

          if (key && !(key in element.children)) {
            element.children[key] = node;
          } else {
            if (key in element.children) {
              dublicatedKeys.add(key);
            }

            element.children[index] = node; // TODO: рекурсивно выбрать уникальное значение
          }
        }

        if (dublicatedKeys.size > 0) {
          console.error(new Error("keys ".concat(_toConsumableArray(dublicatedKeys), " have been dublicated")));
        }

        return element;
      };

      function stableElement(name, props) {
        return new Proxy(function () {
          for (var _len = arguments.length, children = new Array(_len), _key3 = 0; _key3 < _len; _key3++) {
            children[_key3] = arguments[_key3];
          }

          if (Array.isArray(children[0]) && 'raw' in children[0]) {
            return create(name, props, strToArray.apply(void 0, children));
          }

          return create(name, props, children);
        }, {
          get: function get(target, prop) {
            return function (value) {
              if (prop === '_props') {
                return stableElement(name, _objectSpread({}, props, {}, value));
              }

              if (Array.isArray(value) && 'raw' in value) {
                for (var _len2 = arguments.length, items = new Array(_len2 > 1 ? _len2 - 1 : 0), _key4 = 1; _key4 < _len2; _key4++) {
                  items[_key4 - 1] = arguments[_key4];
                }

                return stableElement(name, _objectSpread({}, props, _defineProperty({}, prop, strToArray.apply(void 0, [value].concat(items)).join(''))));
              }

              return stableElement(name, _objectSpread({}, props, _defineProperty({}, prop, value)));
            };
          },
          apply: function apply(target, thisArg, argArray) {
            if (Array.isArray(argArray[0]) && 'raw' in argArray[0]) {
              return create(name, props, strToArray.apply(void 0, _toConsumableArray(argArray)));
            }

            return create(name, props, argArray);
          }
        });
      }

      return stableElement(tag, {});
    }
  });
};

var E = getElement('http://www.w3.org/1999/xhtml');
exports.E = E;
var S = getElement('http://www.w3.org/2000/svg');
exports.S = S;
var M = getElement('http://www.w3.org/1998/Math/MathML'); // console.log(E.div(2));
// const onHover = () => console.log('hover!');
// console.log(E.div.id`text`.onclick('alert(2)').onHover(onHover).onClick(() => alert('hi!'))(2, [3,4,[5,6,[7,8, () => 11, {props:{_key: 'a'}, v: 444}]]]));
// const a = (E.div.class`example`.id`ex`.onHover(onHover).onClick(() => alert('hi!!')).style(`style`)['data-value']`1`(
//     'string',
//     E.span`text`,
//     E.p('str'),
//     E`text v = ${E.span(2)}`,
//     [ // Fragment analog
//         E.div.style`color: red;`,
//         E.div.style`color: red;`('red'),
//         E.div.style`color: red;``red`,
//         E.div.style`color: red;``red ${E.span(1)}`, // red [Function]
//         E.div.style`color: red;`(E`red${E.span(1)}`) // red 1
//     ],
//     ...[1,2,3].map(i => E.i._key(i+'2')(i)),
//     [1,2,3].map(i => E.i._key(i+'3')(i))
// ));
// const b = E.div.onHover(onHover)(55);
// const c = E.article(
//     E.span`222${E.span(1+11)}`
// );
// console.log({a});
// console.log({b});
// console.log(DOM(a));
// console.log(DOM(b));
// console.log(diffElements(a, b));
// const domA = DOM(a);
// console.log(DOM(a));
// patchDOM(domA, diffElements(a, b));
// console.log(domA);
// const domA2 = DOM(a);
// const block = DOM(E.div());
// block.append(domA2);
// patchDOM(domA2, diffElements(a, b));
// console.log(diffElements(b, c));
// patchDOM(domA2, diffElements(b, c));
// console.log(block);
// console.dir(block);
// E.a
// E['a']
// E[Symbol('a')]
// E[Symbol('props')]
// E[Symbol('ref')]
// // E[E.$`ref`]
// // E[E.$`props`]
// // E[E.$({a:1, b:2})]
// E.$ // внутри []
// E`a` // firstArg.raw - возвратит массив
// E('a'), E([1, 2]), E(1, 2, E.span(1)) // преобразует в DOM
// // резерв
// E.$a
// E._
// E._a
// E.A

exports.M = M;
},{"./clone.js":"utils/clone.js","./symbols.js":"utils/symbols.js","./diff.js":"utils/diff.js"}],"utils/css.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _element = require("./element.js");

var getDirPath = function getDirPath(fileUrl) {
  return new URL(fileUrl).pathname.split('/').slice(0, -1).join('/');
};

function _default(sourceUrl, relativePath) {
  var type = relativePath.split('.').slice(-1)[0];

  if (!['css', 'less'].includes(type)) {
    throw new Error("Import file type is ".concat(type, ", but 'css' or 'less' types are available only."));
  }

  var pathRelative = /^\.\.?\//.test(relativePath);
  var sourcePath = getDirPath(sourceUrl).split('/').slice(1).join('/');
  var fullPath = sourcePath + (pathRelative ? relativePath.replace(/^\.\.?/, '') : '/' + relativePath);
  return new Promise(function (resolve) {
    var link = (0, _element.DOM)(_element.E.link.rel("stylesheet".concat(type === 'less' ? '/less' : '')).type('text/css').href(fullPath)());

    if (type === 'less') {
      if (!document.head.querySelector('script[src="less.js"]')) {
        var less = _element.E.script.src('less.js')();

        document.head.append((0, _element.DOM)(less));
      }

      document.head.append(link);

      function update() {
        var style = document.head.querySelector("style[id$=\"".concat(fullPath.split('.')[0].replace(/\//g, '-'), "\"]")); // console.log(1);

        if (style) {
          window.setTimeout(resolve, 100);
        } else {
          window.setTimeout(update, 10);
        }
      }

      update();
    } else {
      document.head.append(link);
      link.addEventListener('load', function () {
        return resolve();
      });
    }
  });
}
},{"./element.js":"utils/element.js"}],"utils/children.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getChildren = void 0;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var getChildren = function getChildren(children) {
  var nodes = [];

  var _iterator = _createForOfIteratorHelper(children),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var node = _step.value;

      if (Array.isArray(node)) {
        nodes.push.apply(nodes, _toConsumableArray(node));
      } else if (typeof node === 'function') {
        nodes.push(node());
      } else {
        nodes.push(node);
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return nodes;
};

exports.getChildren = getChildren;
},{}],"utils/logger.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.log = exports.setLogger = exports.logAllLevels = void 0;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var _log = function _log(condition) {
  return function (f) {
    if (condition) {
      if (typeof f === 'function') {
        f();
      } else {
        console.log(f);
      }
    }
  };
};

var loggerSymbol = Symbol('logger');
var logAllLevels = Symbol('all');
exports.logAllLevels = logAllLevels;
window[loggerSymbol] = {};

var setLogger = function setLogger(settings) {
  window[loggerSymbol] = settings;
};

exports.setLogger = setLogger;

function getCondition(levels) {
  var current = window[loggerSymbol];

  var _iterator = _createForOfIteratorHelper(levels),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var level = _step.value;

      if (current && logAllLevels in current) {
        return true;
      }

      if (!(current && level in current)) {
        return false;
      }

      current = current[level];
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return true;
}

function createLogProxy(levels) {
  return new Proxy(function (f) {
    return _log(getCondition(levels))(f);
  }, {
    get: function get(target, level) {
      return createLogProxy([].concat(_toConsumableArray(levels), [level]));
    }
  });
}

var log = createLogProxy([]);
exports.log = log;
},{}],"utils/component.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _element = require("./element.js");

var _clone = require("./clone.js");

var _children = require("./children.js");

var _style = _interopRequireDefault(require("./style.js"));

var _logger = require("./logger.js");

var _symbols = require("./symbols.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var set = function set(state) {
  return function (arg) {
    var newObject;

    if (_typeof(arg) === 'object') {
      newObject = arg;
    } else if (typeof arg === 'function') {
      newObject = arg(state);
    }

    return Object.assign({}, state, newObject);
  };
};

function getProps(element) {
  if (element.nodeType === 3) {
    // textNode
    return {};
  }

  var props = {};

  for (var i = 0; i < element.attributes.length; i++) {
    var attr = element.attributes[i];
    props[attr.name] = attr.value;
  }

  return props;
}

function logAdd(element) {
  console.log('%c + ', (0, _style.default)({
    color: 'green',
    backgroundColor: '#dfd'
  }), element);
}

function logRemove(element) {
  console.log('%c - ', (0, _style.default)({
    color: 'red',
    backgroundColor: '#fdd'
  }), element);
}

function getElem(component) {
  if (Array.isArray(component)) {
    var fragment = document.createDocumentFragment();
    fragment.append.apply(fragment, _toConsumableArray(component.map(function (e) {
      return getElem(e);
    })));
    return fragment;
  }

  return typeof component === 'function' ? component() : component;
}

function isTypeChanged(element, newElement) {
  if (element && !newElement) {
    return true;
  }

  if (element.nodeType !== newElement.nodeType) {
    return true;
  }

  if (element.nodeName !== newElement.nodeName) {
    return true;
  }

  return false;
}

function componentConstructor(componentName) {
  var handlerErrors = new Proxy({}, {
    get: function get(target, name) {
      if (!(name in target)) {
        target[name] = {};
      }

      return target[name];
    }
  });
  return function (makeComponent) {
    var create = function create() {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var children = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      // уникальный идентификатор для созданного элемента
      var componentNameSymbol = Symbol(componentName);

      function didMountEvent(element, source) {
        // console.group(`didMount[${source}]`);
        // console.log(element);
        // console.groupEnd();
        window.dispatchEvent(new CustomEvent('didMount', {
          detail: {
            componentNameSymbol: element[_symbols.componentSymbol].componentNameSymbol
          }
        }));
      }

      function willUnmountEvent(element, source) {
        // console.group(`willUnmount[${source}]`);
        // console.log(element);
        // console.groupEnd();
        window.dispatchEvent(new CustomEvent('willUnmount', {
          detail: {
            componentNameSymbol: element[_symbols.componentSymbol].componentNameSymbol
          }
        }));
      } // состояние компонента


      var state = {}; // предыдущее состояние

      var prevState = {}; // элемент DOM, который будет возвращён
      // TODO: инлайн компоненты, вложенные в одном узле, у списка это родитель
      // структура цепочки компонентов в элементе
      // [компонент, который возвращает массив] > [аналогично, только вложенный] > возвращает компонент > который возвращает этот элемент

      var element = {}; // вызванные обработчики

      var handlerIndex = 0;
      var handlers = new Proxy({}, {
        get: function get(target, name) {
          if (!(name in target)) {
            target[name] = {
              count: 0,
              indexes: []
            };

            target[name].bump = function () {
              handlerIndex++;
              target[name].count++;
              target[name].indexes.push(handlerIndex);
            };
          }

          return target[name];
        }
      }); // TODO: отслеживать вызовы и гарантировать порядок

      function initState(startState) {
        if (handlers.initState.count !== 0) {
          if (!handlerErrors.initState.count) {
            handlerErrors.initState.count = 1;
            console.error(new Error('Повторный вызов инициализации состояния'));
          }
        }

        handlers.initState.bump();
        state = startState;
      }

      var changedStateFields = {};

      function setState(newState) {
        prevState = state;
        var newStateObject = typeof newState === 'function' ? newState(state) : newState;
        var change = {};

        for (var _i = 0, _Object$keys = Object.keys(newStateObject); _i < _Object$keys.length; _i++) {
          var field = _Object$keys[_i];
          change[field] = true;
        }

        changedStateFields = change; // console.log({changedStateFields});

        state = set(state)(newState);
        rerender();
      }

      var changeState = function changeState() {
        for (var _len = arguments.length, names = new Array(_len), _key = 0; _key < _len; _key++) {
          names[_key] = arguments[_key];
        }

        for (var _i2 = 0, _names = names; _i2 < _names.length; _i2++) {
          var name = _names[_i2];

          if (changedStateFields[name]) {
            return true;
          }
        }

        return false;
      };

      var stateClass = function stateClass() {
        return state;
      };

      stateClass.set = setState;
      stateClass.init = initState;
      stateClass.onChange = changeState; // позволит писать _update(state.onChange('name', 'age'))
      // в перспективе что-то вроде _related(['name', 'age'])
      // идея - писать в метаинформации объектов state данные о своём state - имя, компонент и т.д.
      // тогда при обновлении мы посмотрим, и если поля из state.set не имеют отношения к полям, от котрых зависит обновление, то элемент не обновляется
      // более общий вопрос, как отследить зависимость от некоторого значения из состояния?
      // можно связать свойство элемента со значением свойства, если передавать не само значение, а функцию, что передаёт значение. То есть не Person.age(state.age+1) а Person.age(() => state.age+1). До вызова функции мы посмотрим мету у элемента, а при вызове у значения. Но так будет не так удобно писать, поэтому это может сделать препроцессор? нежелательно!!! к тожу же если передавать просто функцию, профит исчезнет. Не пойдёт!
      // в общем случае задача почти неразрешима
      // можно проксировать хоть насквозь, но передай в другую функцию и ничего не выйдет
      // опять же можно немного подхачить и использовать препроцессор для отслеживания явного применения, он должен быть достаточно умным, чтобы отслеживать зависимости применения переменных;
      // но можно сделать зависимость от ввода или слуйность и препроцессор такое не поймает

      element[componentNameSymbol] = true;

      var didMount = function didMount(callback) {
        function onDidMount(event) {
          // console.log('DIDMOUNT', event);
          if (event.detail.componentNameSymbol === componentNameSymbol) {
            _logger.log.component(function () {// console.group('didMount -- event!!!');
              // console.log(element[componentSymbol].element);
              // console.log(componentName);
              // console.log(event);
              // console.log(callback);
              // console.groupEnd();
            });

            callback(); // window.removeEventListener(didMountListener);
          }
        }

        handlers.didMount.bump();
        var didMountListener = window.addEventListener('didMount', onDidMount, false); // element[elementSymbol].props.onDidMount = onDidMount;
        // element[elementSymbol].eventListeners.didMount = [onDidMount];
      };

      var firstAppend = true;
      var storage = {};
      var elements = [];
      var mo = new MutationObserver(function (mutations, observer) {
        // console.info('Observer');
        // console.log({mutations, observer});
        // console.log('didMount', firstAppend, componentName, element);
        // console.log(handlers);
        if (element.dom && element.dom.ref.closest('html')) {
          // element = false;
          // const componentDOMSymbol = Symbol('componentDOMSymbol');
          // if(!storage[componentDOMSymbol]) { // первый рендер
          //     storage[componentDOMSymbol] = {first: true};
          elements[Object.keys(elements).length] = {
            first: true,
            element: element.innerHTML
          }; // console.log(elements);
          // }
          // if (storage[componentDOMSymbol].first) {
          // console.log('есть', element);
          // console.log({storage});
          // storage[componentDOMSymbol].first = false;

          if (firstAppend) {
            window.dispatchEvent(new CustomEvent('didMount', {
              detail: {
                componentNameSymbol: componentNameSymbol
              }
            }));
            firstAppend = false;
            mo.disconnect();
          } // }

        } else {
          // console.log('нет', element);
          firstAppend = true;
          mo.disconnect();
        }
      });
      mo.observe(document, {
        attributes: true,
        childList: true,
        subtree: true
      });
      props.children = children;
      var render = makeComponent({
        props: props,
        state: stateClass,
        hooks: {
          didMount: didMount
        }
      });

      function rerender() {
        // console.time('get node');
        var newElement = (0, _element.getNode)(render()); // console.timeEnd('get node');

        var dom = element.dom;
        var componentData = element.component; // console.time('diff');

        var diffElement = (0, _element.diffElements)(element, newElement); // console.log({diffElement});
        // console.timeEnd('diff');
        // новые элементы создаются без привязки к странице

        element = newElement; // BUG: не сохраняется новый вид элемента

        element.component = componentData; // console.log('update:', componentName, {element, dom});

        if (dom) {
          // есть dom
          // получить их diff, TODO: учитывая static
          // console.log({dom, diffElement});
          element.dom = dom; // надо перепривязать к dom всех потомков
          // console.time('patch DOM');

          (0, _element.patchDOM)(dom.ref, diffElement); // console.timeEnd('patch DOM');
        }
      }

      element = (0, _element.getNode)(render()); // первый рендер

      if (Array.isArray(element)) {
        var _iterator = _createForOfIteratorHelper(element),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var item = _step.value;
            setComponentData(item, {
              array: true
            });
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      } else {
        setComponentData(element);
      }

      function setComponentData(element) {
        var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            _ref$array = _ref.array,
            array = _ref$array === void 0 ? false : _ref$array;

        if (!element.component) {
          element.component = {
            level: 0
          };
        }

        var level = element.component.level;
        element.component[String(level)] = {
          array: array,
          name: componentName,
          props: props,
          state: state
        };
        element.component.level++;
      } // первое присоединение dom
      // if (!element.dom) {
      // element.dom = {};
      // }
      // const dom = DOM(element);
      // element.dom.ref = dom;
      // if (element.dom.parent) {
      //     element.dom.parent.append(dom);
      // }
      // console.log('render:', componentName, {element});


      return function () {
        return element;
      };
    };

    function stableElement(props) {
      return new Proxy(function () {
        for (var _len2 = arguments.length, children = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          children[_key2] = arguments[_key2];
        }

        return create({}, children);
      }, {
        get: function get(target, prop) {
          return function (value) {
            // console.log(`added prop ${prop} = ${value}`)
            return stableElement(_objectSpread({}, props, _defineProperty({}, prop, value)));
          };
        },
        apply: function apply(target, thisArg, argArray) {
          return create(props, argArray);
        }
      });
    }

    return stableElement({});
  };
}

var Component = new Proxy({}, {
  get: function get(target, componentName) {
    return componentConstructor(componentName);
  }
});
var _default = Component;
exports.default = _default;
},{"./element.js":"utils/element.js","./clone.js":"utils/clone.js","./children.js":"utils/children.js","./style.js":"utils/style.js","./logger.js":"utils/logger.js","./symbols.js":"utils/symbols.js"}],"utils/router.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Switch = exports.RouteLink = exports.getRouterState = void 0;

var _index = require("./index.js");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var historyUpdate = new CustomEvent('historyUpdate');

function pushState(data, title, url) {
  history.pushState(data, title, url);
  window.dispatchEvent(historyUpdate);
}

function replaceState(data, title, url) {
  history.replaceState(data, title, url);
  window.dispatchEvent(historyUpdate);
}

window.addEventListener('popstate', function () {
  return window.dispatchEvent(historyUpdate);
});

var getRouterState = function getRouterState(routes) {
  if (!document.location.search) {
    return {
      params: {},
      path: '/',
      routes: routes('')
    };
  }

  var params = new URLSearchParams(document.location.search);
  var stack = [];

  var _iterator = _createForOfIteratorHelper(params),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var _step$value = _slicedToArray(_step.value, 1),
          param = _step$value[0];

      if (param[0] === '/') {
        stack.push.apply(stack, _toConsumableArray(param.slice(1).split('/')));
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  var resultParams = {};
  var resultPath = null;

  for (var path in routes({})) {
    var pathStack = path.split('/');
    var _params = {};
    var equal = true;

    for (var i = 0; i < pathStack.length; i++) {
      if (i === stack.length) {
        equal = false;
        break;
      }

      var level = pathStack[i];

      if (level[0] === ':') {
        _params[level.slice(1)] = stack[i];
      } else if (level !== stack[i]) {
        equal = false;
        break;
      }
    }

    if (equal) {
      resultParams = _params;
      resultPath = path;
    }
  }

  return {
    params: resultParams,
    path: resultPath,
    routes: routes(resultParams)
  };
};

exports.getRouterState = getRouterState;

var RouteLink = _index.Component.RouteLink(function (_ref) {
  var _ref$props = _ref.props,
      href = _ref$props.href,
      children = _ref$props.children;
  return function () {
    var onLinkClick = function onLinkClick(event) {
      event.preventDefault();

      if (href === '/') {
        pushState({
          stack: []
        }, '', '/');
        return;
      }

      if (((window.history.state || {}).stack || []).join('/') === href) {
        return;
      }

      pushState({
        stack: href.split('/')
      }, '', '?/' + href);
    };

    return _index.E.a.href(href).onClick(onLinkClick)(children);
  };
});

exports.RouteLink = RouteLink;

var Switch = _index.Component.Switch(function (_ref2) {
  var props = _ref2.props,
      state = _ref2.state;
  state.init(getRouterState(props.routes));
  window.addEventListener('historyUpdate', function () {
    state.set(getRouterState(props.routes));
  });
  return function () {
    var _state = state(),
        path = _state.path,
        routes = _state.routes;

    return routes[path];
  };
});

exports.Switch = Switch;
},{"./index.js":"utils/index.js"}],"utils/custom.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _index = require("./index.js");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var count = 0;

function getCustom(name, elements, didMount) {
  var CustomElement = /*#__PURE__*/function (_HTMLElement) {
    _inherits(CustomElement, _HTMLElement);

    var _super = _createSuper(CustomElement);

    function CustomElement() {
      var _this;

      _classCallCheck(this, CustomElement);

      _this = _super.call(this);

      var shadow = _this.attachShadow({
        mode: 'open'
      });

      shadow.append(_index.E.slot.name('element-slot')());
      return _this;
    }

    _createClass(CustomElement, [{
      key: "connectedCallback",
      value: function connectedCallback() {
        didMount(elements);
      }
    }]);

    return CustomElement;
  }( /*#__PURE__*/_wrapNativeSuper(HTMLElement));

  count++;
  var customName = "custom-".concat(name, "-").concat(count);
  customElements.define(customName, CustomElement);
  return _index.E[customName](_index.E.div.slot('element-slot')(elements));
}

var _default = _index.Component.Custom(function () {
  return function (_ref) {
    var name = _ref.name,
        children = _ref.children,
        didMount = _ref.didMount;
    return getCustom(name, children, didMount);
  };
});

exports.default = _default;
},{"./index.js":"utils/index.js"}],"utils/consoleStyle.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.consoleStyle = consoleStyle;
exports._h = exports._pre = exports._i = exports._b = exports.mix = exports.color = exports.css = void 0;

function _templateObject5() {
  var data = _taggedTemplateLiteral(["", "\nsee http://127.0.0.1:5500/?/blog/1\n", " and ", " and ", "\n"]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = _taggedTemplateLiteral(["consoleStyle"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral(["function"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["export"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n", " ", " ", "(", ", ...", ") {\n    ", " ", " ", " [];\n    ", " ", " ", " [];\n    ", " (", " ", " ", " ", "; ", " ", " ", ".", " ", " ", "; ", "", ") {\n        ", " ", " ", " ", "[", "];\n        ", " ", " ", " ", "[", "][", "];\n        ", ".", "(", ", ", ");\n        ", ".", "(", "[", "][", "], ", "[", "][", "]);\n    }\n    ", ".", "(", "[", ".", " ", " ", "]);\n    ", " [", ".", "(", "), ", "];\n}\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var css = new Proxy({}, {
  get: function get(target, name) {
    return function (text) {
      return ["%c".concat(text, "%c"), name, ''];
    };
  }
});
exports.css = css;
var color = new Proxy({}, {
  get: function get(target, name) {
    return function (text) {
      return css["color:".concat(name)](text);
    };
  }
});
exports.color = color;

function consoleStyle(textList) {
  var styles = [];
  var text = [];

  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key2 = 1; _key2 < _len; _key2++) {
    args[_key2 - 1] = arguments[_key2];
  }

  for (var i = 0; i < textList.length - 1; i++) {
    var s = textList[i];
    var v = args[i][0];
    text.push(s, v);
    var local = args[i][1];
    styles.push.apply(styles, _toConsumableArray(Array.isArray(local) ? local : [local, args[i][2]]));
  }

  text.push(textList[textList.length - 1]);
  return [text.join(''), styles];
}

var mix = new Proxy({}, {
  get: function get(target, name) {
    return function (styles) {
      return styles.map(function (e) {
        return "".concat(e, ";").concat(name);
      });
    };
  }
});
exports.mix = mix;

var background = function background(color) {
  return function (e) {
    return mix["background-color:".concat(color)](e);
  };
};

var _key = function _key(text) {
  return color['#a53bbb'](text);
};

var _func = function _func(text) {
  return color['#35a0ed'](text);
};

var _var = function _var(text) {
  return color['#de4d57'](text);
};

var _const = function _const(text) {
  return color['#e0994a'](text);
};

var _op = function _op(text) {
  return color['#4ba6b1'](text);
};

var S = {
  key: _key,
  func: _func
};

var _ref = consoleStyle(_templateObject(), S.key(_templateObject2()), S.key(_templateObject3()), S.func(_templateObject4()), _var('textList'), _var('args'), _key('const'), _var('styles'), _op('='), _key('const'), _var('text'), _op('='), _key('for'), _key('let'), _var('i'), _op('='), _const('0'), _var('i'), _op('<'), _var('textList'), _var('length'), _op('-'), _const('1'), _var('i'), _op('++'), _key('const'), _var('s'), _op('='), _var('textList'), _var('i'), _key('const'), _var('v'), _op('='), _var('args'), _var('i'), _const('0'), _var('text'), _op('push'), _var('s'), _var('v'), _var('styles'), _op('push'), _var('args'), _var('i'), _const('1'), _var('args'), _var('i'), _const('2'), _var('text'), _op('push'), _var('textList'), _var('textList'), _var('length'), _op('-'), _const('1'), _key('return'), _var('text'), _op('join'), _var("''"), _var('styles')),
    _ref2 = _slicedToArray(_ref, 2),
    text = _ref2[0],
    styles = _ref2[1]; // console.log(text, ...styles);


var _b = function _b(text) {
  return css['font-weight: bold'](text);
};

exports._b = _b;

var _i = function _i(text) {
  return css['font-style: italic'](text);
};

exports._i = _i;

var _pre = function _pre(text) {
  return css['font-family: monospace'](text);
};

exports._pre = _pre;

var _h = function _h(l) {
  return function (text) {
    return css["font-size: ".concat(21 - l, "px")](text);
  };
};

exports._h = _h;

var _ref3 = consoleStyle(_templateObject5(), _h(1)('Документация'), _b('bold'), _i('italic'), _pre('pre')),
    _ref4 = _slicedToArray(_ref3, 2),
    text1 = _ref4[0],
    styles1 = _ref4[1]; // console.log(text1, ...styles1);
},{}],"utils/class.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Class = Class;

function Class(createClass) {
  var fields = {};
  var field = new Proxy({}, {
    get: function get(target, prop) {
      return function (getter) {
        fields[prop] = getter;
      };
    }
  });
  return function (initialValues) {
    var constructor = function constructor(create) {
      return create(initialValues);
    };

    createClass({
      field: field,
      constructor: constructor
    });
    return new Proxy({}, {
      get: function get(target, prop) {
        return prop in fields ? fields[prop]() : undefined;
      }
    });
  };
} // const Count = Class(({constructor, field}) => {
//     let a = 0; // private field
//     constructor(x => {
//         a = x;
//     });
//     field.a(() => a); // public field
//     const add = () => a++; // private method
//     field.add(() => add); // public method
// });
// const counter1 = Count(1);
// console.log(counter1.a); // 1
// counter1.add();
// counter1.add();
// console.log(counter1.a); // 3
// class PrefixTree {
//     constructor(...values) {
//         this.tree = [[]];
//         for (const [name, value] of values) {
//             this.set(name, value);
//         }
//     }
//     getTree() {
//         return this.tree;
//     }
//     set(name, value) {
//         name = String(name);
//         let current = this.tree;
//         if (name === '') {
//             current[1] = value;
//             return;
//         }
//         const list = name.split('');
//         for (let i = 0; i < list.length; i++) {
//             const char = list[i];
//             if (i === list.length - 1) {
//                 current[1] = value;
//             } else {
//                 let exist = false;
//                 const l = current[0].length;
//                 for (let j = 0; j < l; j++) {
//                     const [c, sub] = current[0][j];
//                     if (c === char) {
//                         current = sub;
//                         exist = true;
//                         break;
//                     }
//                 }
//                 if (!exist) {
//                     current[0][l] = [char, [[]]];
//                     current = current[0][l][1];
//                 }
//             }
//         }
//     }
//     get(name) {
//         let current = this.tree;
//         const list = name.split('');
//         for (let i = 0; i < list.length; i++) {
//             const char = list[i];
//             for (let j = 0; j < current[0].length; j++) {
//                 const [c, sub] = current[0][j];
//                 if (c === char) {
//                     current = sub;
//                     break;
//                 }
//                 if (j === current[0].length - 1) {
//                     return undefined;
//                 }
//             }
//         }
//         return current[1];
//     }
// }
// const tree = new PrefixTree();
// const obj = {};
// const map = new Map();
// console.time('Prefix Tree');
// for (let j = 0; j < 17; j++) {
//     for (let i = 0; i < 10000; i++) {
//         tree.set(String(Math.random()).slice(2, j), Math.random());
//     }
// }
// console.timeEnd('Prefix Tree');
// console.time('Native object');
// for (let j = 0; j < 17; j++) {
//     for (let i = 0; i < 10000; i++) {
//         obj[String(Math.random()).slice(2, j)] = Math.random();
//     }
// }
// console.timeEnd('Native object');
// console.time('Native Map');
// for (let j = 0; j < 17; j++) {
//     for (let i = 0; i < 10000; i++) {
//         map.set(String(Math.random()).slice(2, j), Math.random());
//     }
// }
// console.timeEnd('Native Map');
// console.log(tree.getTree());
// console.log(obj);


var o = {
  a: 1
};

function e(object) {}

e(o);
},{}],"utils/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "block", {
  enumerable: true,
  get: function () {
    return _bem.default;
  }
});
Object.defineProperty(exports, "style", {
  enumerable: true,
  get: function () {
    return _style.default;
  }
});
Object.defineProperty(exports, "css", {
  enumerable: true,
  get: function () {
    return _css.default;
  }
});
Object.defineProperty(exports, "E", {
  enumerable: true,
  get: function () {
    return _element.E;
  }
});
Object.defineProperty(exports, "S", {
  enumerable: true,
  get: function () {
    return _element.S;
  }
});
Object.defineProperty(exports, "M", {
  enumerable: true,
  get: function () {
    return _element.M;
  }
});
Object.defineProperty(exports, "Component", {
  enumerable: true,
  get: function () {
    return _component.default;
  }
});
Object.defineProperty(exports, "Switch", {
  enumerable: true,
  get: function () {
    return _router.Switch;
  }
});
Object.defineProperty(exports, "RouteLink", {
  enumerable: true,
  get: function () {
    return _router.RouteLink;
  }
});
Object.defineProperty(exports, "getRouterState", {
  enumerable: true,
  get: function () {
    return _router.getRouterState;
  }
});
Object.defineProperty(exports, "Custom", {
  enumerable: true,
  get: function () {
    return _custom.default;
  }
});
Object.defineProperty(exports, "log", {
  enumerable: true,
  get: function () {
    return _logger.log;
  }
});
Object.defineProperty(exports, "setLogger", {
  enumerable: true,
  get: function () {
    return _logger.setLogger;
  }
});
Object.defineProperty(exports, "logAllLevels", {
  enumerable: true,
  get: function () {
    return _logger.logAllLevels;
  }
});
Object.defineProperty(exports, "consoleStyle", {
  enumerable: true,
  get: function () {
    return _consoleStyle.consoleStyle;
  }
});
Object.defineProperty(exports, "Class", {
  enumerable: true,
  get: function () {
    return _class.Class;
  }
});
Object.defineProperty(exports, "diff", {
  enumerable: true,
  get: function () {
    return _diff.diff;
  }
});

var _bem = _interopRequireDefault(require("./bem.js"));

var _style = _interopRequireDefault(require("./style.js"));

var _css = _interopRequireDefault(require("./css.js"));

var _element = require("./element.js");

var _component = _interopRequireDefault(require("./component.js"));

var _router = require("./router.js");

var _custom = _interopRequireDefault(require("./custom.js"));

var _logger = require("./logger.js");

var _consoleStyle = require("./consoleStyle.js");

var _class = require("./class.js");

var _diff = require("./diff.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./bem.js":"utils/bem.js","./style.js":"utils/style.js","./css.js":"utils/css.js","./element.js":"utils/element.js","./component.js":"utils/component.js","./router.js":"utils/router.js","./custom.js":"utils/custom.js","./logger.js":"utils/logger.js","./consoleStyle.js":"utils/consoleStyle.js","./class.js":"utils/class.js","./diff.js":"utils/diff.js"}],"node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"components/Breadcrumbs/Breadcrumbs.less":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"node_modules/parcel-bundler/src/builtins/css-loader.js"}],"components/Breadcrumbs/Breadcrumbs.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _index = require("../../utils/index.js");

require("./Breadcrumbs.less");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var b = (0, _index.block)('breadcrumbs');

var Breadcrumbs = _index.Component.Breadcrumbs(function (_ref) {
  var props = _ref.props;
  return function () {
    return _index.E.div.class(b())(props.items.map(function (_ref2, i) {
      var _ref3 = _slicedToArray(_ref2, 2),
          name = _ref3[0],
          href = _ref3[1];

      var last = i === props.items.length - 1;
      return _index.E.span(_index.E.div.style('display: inline-block')(last ? name : _index.RouteLink.href(href)(name)), last ? '' : ' / ');
    }));
  };
});

var _default = Breadcrumbs;
exports.default = _default;
},{"../../utils/index.js":"utils/index.js","./Breadcrumbs.less":"components/Breadcrumbs/Breadcrumbs.less"}],"data/blog/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  0: {
    type: 'js',
    creationTime: '2020-01-15T17:31:44',
    title: 'Я создал этот сайт',
    tags: ['web', 'site']
  },
  1: {
    type: 'html',
    creationTime: '2020-03-09T14:09:41',
    title: 'Создаём приложение на Filemaker',
    tags: ['filemaker', 'tutorial']
  },
  2: {
    type: 'js',
    creationTime: '2020-03-28T22:01:49',
    title: 'Отказ от нативных es6 модулей в пользу Parcel',
    tags: ['es6', 'parcel']
  },
  3: {
    type: 'js',
    creationTime: '2020-04-04T19:38:53',
    title: 'Переписал движок сайта на virtual DOM',
    tags: ['js', 'virtual dom']
  }
};
exports.default = _default;
},{}],"blocks/Button/Button.less":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"node_modules/parcel-bundler/src/builtins/css-loader.js"}],"blocks/Button/Button.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _index = require("../../utils/index.js");

require("./Button.less");

var b = (0, _index.block)('button');

var Button = _index.Component.Button(function (_ref) {
  var _ref$props = _ref.props,
      children = _ref$props.children,
      size = _ref$props.size;
  return function () {
    return _index.E.button.class(b())(children);
  };
});

var _default = Button;
exports.default = _default;
},{"../../utils/index.js":"utils/index.js","./Button.less":"blocks/Button/Button.less"}],"blocks/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Button", {
  enumerable: true,
  get: function () {
    return _Button.default;
  }
});

var _Button = _interopRequireDefault(require("./Button/Button.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./Button/Button.js":"blocks/Button/Button.js"}],"utils/book.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createBook = createBook;

var _element = require("./element.js");

var _consoleStyle = require("./consoleStyle.js");

var _index = require("./index.js");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function createBook(f) {
  return {
    to: function to(type) {
      var types = {
        html: function html() {
          return {
            V: function V(strings) {
              var stringElements = strings.map(function (s) {
                var result = [];
                var brs = s.match(/\n\n+/g);

                if (!brs) {
                  return s;
                }

                var tail = s;
                var i;

                var _iterator = _createForOfIteratorHelper(brs),
                    _step;

                try {
                  for (_iterator.s(); !(_step = _iterator.n()).done;) {
                    var br = _step.value;
                    i = tail.indexOf(br);
                    var subbrs = [];

                    if (br.length === 2) {
                      subbrs.push(_element.E.br());
                    } else {
                      for (var j = 0; j < 2 * br.length - 4; j++) {
                        subbrs.push(_element.E.br());
                      }
                    }

                    result.push.apply(result, [tail.slice(0, i)].concat(subbrs));
                    tail = tail.slice(i + br.length);
                  }
                } catch (err) {
                  _iterator.e(err);
                } finally {
                  _iterator.f();
                }

                result.push(tail);
                return result;
              });

              var list = _toConsumableArray(stringElements[0]);

              for (var i = 1; i < strings.length; i++) {
                list.push.apply(list, [i - 1 + 1 < 1 || arguments.length <= i - 1 + 1 ? undefined : arguments[i - 1 + 1]].concat(_toConsumableArray(stringElements[i])));
              }

              return list;
            },
            b: function b(t) {
              return _element.E.b(t);
            },
            i: function i(t) {
              return _element.E.i(t);
            },
            code: function code(t) {
              return _element.E.code(t);
            },
            pre: function pre(t) {
              return _element.E.pre(t);
            },
            h: function h(l) {
              return function (t) {
                return _element.E["h".concat(l)](t);
              };
            },
            n: _element.E.br,
            p: function p(t) {
              return _element.E.p(t);
            },
            img: function img(src, alt) {
              return _element.E.img.src(src).alt(alt);
            },
            a: function a(href) {
              return function (text) {
                return _element.E.a.href(href)(text);
              };
            },
            external: function external(f) {
              return f(_element.E, _index.Component);
            }
          };
        },
        markdown: function markdown() {
          return {
            V: function V(strings) {
              var list = [strings[0]];

              for (var i = 1; i < strings.length; i++) {
                list.push(i - 1 + 1 < 1 || arguments.length <= i - 1 + 1 ? undefined : arguments[i - 1 + 1], strings[i]);
              }

              return list.join('');
            },
            b: function b(t) {
              return "**".concat(t, "**");
            },
            i: function i(t) {
              return "_".concat(t, "_");
            },
            code: function code(t) {
              return "`".concat(t, "`");
            },
            h: function h(l) {
              return function (t) {
                return "".concat('#'.repeat(l), " ").concat(t);
              };
            },
            n: '  \n',
            p: function p(t) {
              return "\n\n".concat(t, "\n\n");
            },
            img: function img(src, alt) {
              return "![".concat(alt || '', "](").concat(src, ")");
            },
            a: function a(href) {
              return function (text) {
                return "[".concat(text || '', "](").concat(href, ")");
              };
            }
          };
        },
        browserConsole: function browserConsole() {
          return {
            V: _consoleStyle.consoleStyle,
            b: _consoleStyle._b,
            i: _consoleStyle._i,
            code: _consoleStyle._pre,
            h: _consoleStyle._h,
            n: '\n',
            p: function p(t) {
              return t;
            },
            img: function img(src, alt) {
              return ["IMG[".concat(src || '', "]: ").concat(alt || ''), []];
            },
            a: function a(href) {
              return function (text) {
                return ["".concat(href, " (").concat(text, ")"), []];
              };
            }
          };
        }
      };

      if (type && type in types) {
        return f(types[type]());
      } else {
        throw new Error("Invalid type. Available types: ".concat(Object.keys(types).join()));
      }
    }
  };
} // const bookTemplate = createBook(({b, i, h, code, n, p, img, a, V}) =>
// V`
// ${h(1)('Header')}
// ${p(V`
// ${b('жирный')} текст ${n}
// ${i('курсивный')} текст
// ${img('../assets/images/favicon/favicon-32x32.png', 'favicon')}
// `)}
// блок ${code('программного кода')} ${n}
// ${a('https://github.com')('Гитхаб')} - ссылка
// `);
// export const book = bookTemplate.to('html');
// console.log(bookTemplate.to('markdown'));
// const [text, styles] = bookTemplate.to('browserConsole');
// console.log(text, ...styles);
},{"./element.js":"utils/element.js","./consoleStyle.js":"utils/consoleStyle.js","./index.js":"utils/index.js"}],"components/Post/Post.less":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"node_modules/parcel-bundler/src/builtins/css-loader.js"}],"components/Post/Post.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _index = require("../../utils/index.js");

var _index2 = _interopRequireDefault(require("../../data/blog/index.js"));

var _index3 = require("../../blocks/index.js");

var _index4 = require("../index.js");

var _book = require("../../utils/book.js");

require("./Post.less");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var b = (0, _index.block)('post');

var Post = _index.Component.Post(function (_ref) {
  var props = _ref.props,
      state = _ref.state,
      didMount = _ref.hooks.didMount;
  state.init({
    text: null
  });
  didMount(function () {
    var id = props.id;
    var type = _index2.default[id].type;
    var path = "../data/blog/data/".concat(id, "/index.").concat(type);

    if (type === 'html') {
      fetch(path).then(function (e) {
        // console.log(e.clone().blob());
        return e.blob();
      }).then(function (data) {
        return 'html' || data.text();
      }).then(function (text) {
        // console.log(text);
        state.set({
          text: text
        });
      });
    } else if (type === 'js') {
      import(path).then(function (data) {
        // console.log(data);
        state.set({
          text: (0, _book.createBook)(data.default).to('html')
        });
      }).catch(function (e) {
        console.error(e);
        state.set({
          text: 'Ошибка загрузки контента'
        });
      });
    }
  });
  return function () {
    var id = props.id;
    var type = _index2.default[id].type;

    var _state = state(),
        text = _state.text;

    var _blog$id = _index2.default[id],
        title = _blog$id.title,
        creationTime = _blog$id.creationTime;

    var template = _index.E.div.class(b('content'));

    var elem;

    if (type === 'html') {
      var iframe = _index.E.iframe.id("iframe-post-".concat(id)).src("/data/blog/data/".concat(id, "/index.").concat(type)).style('width: 100%; border:none; object-fit: fill; height: 100vh;');

      setTimeout(function () {
        var iframeElem = document.getElementById("iframe-post-".concat(id));
        iframeElem.style.height = iframeElem.contentWindow.document.body.clientHeight + 100 + 'px';
      }, 300);
      elem = template(iframe);
    } else if (type === 'js') {
      elem = template(text);
    } else {
      elem = 'Ошибка несоответствия типа контента';
    }

    return _index.E.div.class(b())(_index4.Breadcrumbs.items([['Блог', 'blog'], [title, "blog/".concat(id)]]), _index.E.h2(title), _index.E.em(new Date(creationTime).toLocaleString('ru', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timezone: 'UTC',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    })), _index.E.div(elem));
  };
});

var _default = Post;
exports.default = _default;
},{"../../utils/index.js":"utils/index.js","../../data/blog/index.js":"data/blog/index.js","../../blocks/index.js":"blocks/index.js","../index.js":"components/index.js","../../utils/book.js":"utils/book.js","./Post.less":"components/Post/Post.less"}],"components/Blog/Blog.less":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"node_modules/parcel-bundler/src/builtins/css-loader.js"}],"components/Blog/Blog.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _index = require("../../utils/index.js");

var _index2 = _interopRequireDefault(require("../../data/blog/index.js"));

var _index3 = require("../../blocks/index.js");

require("./Blog.less");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var b = (0, _index.block)('blog');

var Blog = _index.Component.Blog(function () {
  var total = Object.keys(_index2.default).length; // console.log(`total ${total}`);

  return function () {
    return _index.E.div.class(b())(Object.keys(_index2.default).sort(function (keyA, keyB) {
      var getMs = function getMs(key) {
        return Number(new Date(_index2.default[key].creationTime));
      };

      return getMs(keyB) - getMs(keyA);
    }).map(function (key) {
      var _blog$key = _index2.default[key],
          type = _blog$key.type,
          creationTime = _blog$key.creationTime,
          title = _blog$key.title,
          tags = _blog$key.tags;
      return _index.E.div.class(b('post-card'))(_index.E.h3.class(b('title'))(title, _index.E.div.class(b('read-button'))(_index.RouteLink.href("blog/".concat(key))((0, _index3.Button)('Читать')))), _index.E.p(_index.E.span.class(b('time'))(new Date(creationTime).toLocaleString('ru', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timezone: 'UTC',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
      }))), _index.E.p(tags.map(function (tag) {
        return _index.E.div.class(b('tag'))(tag);
      })));
    }));
  };
});

var _default = Blog;
exports.default = _default;
},{"../../utils/index.js":"utils/index.js","../../data/blog/index.js":"data/blog/index.js","../../blocks/index.js":"blocks/index.js","./Blog.less":"components/Blog/Blog.less"}],"components/Projects/Projects.less":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"node_modules/parcel-bundler/src/builtins/css-loader.js"}],"components/Projects/Projects.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _index = require("../../utils/index.js");

var _index2 = require("../../blocks/index.js");

require("./Projects.less");

function _templateObject() {
  var data = _taggedTemplateLiteral(["font-size: 72px"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var b = (0, _index.block)('projects');

var Projects = _index.Component.Projects(function () {
  return function () {
    return _index.E.div.class(b())(_index.E.h2('Проекты'), _index.RouteLink.href('projects/unicode')((0, _index2.Button)(_index.E.div.style((0, _index.style)({
      padding: '16px 64px'
    }))('Юникод', _index.E.br, _index.E.span.style(_templateObject())('✍')))));
  };
});

var _default = Projects;
exports.default = _default;
},{"../../utils/index.js":"utils/index.js","../../blocks/index.js":"blocks/index.js","./Projects.less":"components/Projects/Projects.less"}],"components/Colors/Colors.less":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"node_modules/parcel-bundler/src/builtins/css-loader.js"}],"components/Colors/Colors.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _index = require("../../utils/index.js");

var _index2 = require("../index.js");

require("./Colors.less");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var colors = ['area', 'menu', 'menu-active', 'menu-hover', 'menu-folder', 'element-active', 'string-number', 'syntax-variable', 'syntax-number', 'syntax-operator', 'syntax-gray', 'syntax-dark-gray', 'syntax-keyword', 'syntax-class', 'syntax-function', 'syntax-string', 'syntax-inline', 'input-text', 'input-area', 'md-link', 'atom-link', 'atom-button', 'atom-button-hover', 'atom-black-line'];
var b = (0, _index.block)('colors');

var Colors = _index.Component.Colors(function () {
  return function () {
    return _index.E.div(_index2.Breadcrumbs.items([['Дизайн', 'design'], ['Цвета']]), _index.E.div.class(b())(colors.map(function (color) {
      var code = getComputedStyle(document.documentElement).getPropertyValue("--color-".concat(color)).trim();

      var rgb = function (s) {
        return [s.slice(0, 2), s.slice(2, 4), s.slice(4)].map(function (hex) {
          return parseInt(hex, 16);
        });
      }(code.slice(1));

      var v = Math.max.apply(Math, _toConsumableArray(rgb));
      var contrast = v > 162 ? 'black' : 'white';
      var border = v > 38 && v < 78 ? 'solid 1px #abb2de' : '';

      var colorNode = _index.E.div(_index.E.div.class(b('area', {
        color: color
      })).style((0, _index.style)({
        border: border,
        color: contrast
      }))(_index.E.div.class(b('name'))(code)), _index.E.div(color));

      return colorNode;
    })));
  };
});

var _default = Colors;
exports.default = _default;
},{"../../utils/index.js":"utils/index.js","../index.js":"components/index.js","./Colors.less":"components/Colors/Colors.less"}],"components/Unicode/Unicode.less":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"node_modules/parcel-bundler/src/builtins/css-loader.js"}],"components/Unicode/Unicode.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _index = require("../../utils/index.js");

var _index2 = require("../../blocks/index.js");

var _index3 = require("../index.js");

require("./Unicode.less");

function _templateObject() {
  var data = _taggedTemplateLiteral(["\u041F\u043E\u043A\u0430 \u043F\u0440\u0435\u0434\u0441\u0442\u0430\u0432\u043B\u0435\u043D\u0430 \u0442\u043E\u043B\u044C\u043A\u043E ", ""]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var b = (0, _index.block)('unicode');
var limit = 5000;
var max = 65535;
var count = (max - max % limit) / limit + 1;

function getUnicodeList(start, end) {
  var table = [];

  for (var i = start; i < end; i++) {
    table.push(_index.E.div.title(i)(String.fromCharCode(i)));
  }

  return table;
}

var Unicode = _index.Component.Unicode(function (_ref) {
  var state = _ref.state;
  state.init({
    i: 0
  });
  return function () {
    var start = state().i;
    var startI = start * limit;
    var end = start * limit + limit;
    var endI = end > max ? max : end;
    return _index.E.div(_index3.Breadcrumbs.items([['Проекты', 'projects'], ['Юникод']]), _index.E.div.class(b())._forceUpdate(true)(_index.E.div.class(b('menu'))(_toConsumableArray(new Array(count).keys()).map(function (i) {
      return _index.E.div.class(b('button-container')).onClick(function () {
        return state.set({
          i: i
        });
      })((0, _index2.Button)(_index.E.span.class(b('button', {
        active: i === start
      }))("".concat(i))));
    })), _index.E.div(_index.E.h2('Юникод'), _index.E.p((0, _index.E)(_templateObject(), _index.E.a.href('https://en.wikipedia.org/wiki/Plane_(Unicode)#Basic_Multilingual_Plane')('основная многоязычная плоскость'))), _index.E.br, _index.E.p("C\u0438\u043C\u0432\u043E\u043B\u044B ".concat(startI, " - ").concat(endI)), _index.E.br, _index.E.div._forceUpdate(true).class(b('table'))(getUnicodeList(startI, endI)))));
  };
});

var _default = Unicode;
exports.default = _default;
},{"../../utils/index.js":"utils/index.js","../../blocks/index.js":"blocks/index.js","../index.js":"components/index.js","./Unicode.less":"components/Unicode/Unicode.less"}],"components/Design/Design.less":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"node_modules/parcel-bundler/src/builtins/css-loader.js"}],"components/Design/Design.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _index = require("../../utils/index.js");

var _index2 = require("../../blocks/index.js");

require("./Design.less");

var b = (0, _index.block)('design');

var Design = _index.Component.Design(function () {
  return function () {
    return _index.E.div.class(b())(_index.E.h2('Дизайн'), _index.RouteLink.href('design/colors')((0, _index2.Button)(_index.E.div.style((0, _index.style)({
      padding: '24px',
      fontSize: '64px',
      fontWeight: '500'
    }))(_index.E.span.style('color: #bc514a')('Ц'), _index.E.span.style('color: #99c27c')('в'), _index.E.span.style('color: #65b0ed')('е'), _index.E.span.style('color: #c57bdb')('т'), _index.E.span.style('color: #d0996a')('а')))));
  };
});

var _default = Design;
exports.default = _default;
},{"../../utils/index.js":"utils/index.js","../../blocks/index.js":"blocks/index.js","./Design.less":"components/Design/Design.less"}],"components/GameOfLife/GameOfLife.less":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"node_modules/parcel-bundler/src/builtins/css-loader.js"}],"components/GameOfLife/GameOfLife.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _index = require("../../utils/index.js");

require("./GameOfLife.less");

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var b = (0, _index.block)('game-of-life'); // console.log('game of life!!!!!!!!!')

var range = function range(start, end) {
  var result = [];

  for (var i = start; i <= end; i++) {
    result.push(i);
  }

  return result;
};

var Game = _index.Component.Game(function (_ref) {
  var props = _ref.props,
      getState = _ref.getState,
      setState = _ref.setState,
      initState = _ref.initState,
      didMount = _ref.didMount;
  var _props$H = props.H,
      H = _props$H === void 0 ? 200 : _props$H,
      _props$W = props.W,
      W = _props$W === void 0 ? 400 : _props$W;
  initState({
    i: 0,
    size: 0,
    stop: true,
    H: H,
    W: W
  });
  var canvas,
      img_data,
      data,
      ctx,
      rule = {
    new: [2, 3],
    old: [3]
  },
      fieldState,
      fieldStateNext;
  didMount(function () {
    var startFieldState = props.startFieldState;

    var _getState = getState(),
        H = _getState.H,
        W = _getState.W;

    fieldState = new Array(H * W);
    fieldStateNext = new Array(H * W);

    for (var i = 0; i < H * W; i++) {
      fieldState[i] = false;
      fieldStateNext[i] = false;
    }

    if (startFieldState) {
      set_life(startFieldState);
    }

    canvas = document.getElementById('field');
    ctx = canvas.getContext('2d', {
      alpha: false
    });
    img_data = ctx.getImageData(0, 0, W, H);
    data = img_data.data;

    for (var k = 0; k < H * W * 4; k++) {
      data[k] = (k + 1) % 4 == 0 ? 255 : 0;
    } // paint();
    // rules();


    draw();
    life();
  });

  function torsum(i, j) {
    var _getState2 = getState(),
        H = _getState2.H,
        W = _getState2.W,
        state = _getState2.fieldState; // положение строки над текущей клеткой


    var i_top_W = (i ? i - 1 : H - 1) * W; // положение строки под текущей клеткой

    var i_down_W = (H - 1 - i ? i + 1 : 0) * W; // положение строки текущей клетки

    var i_W = i * W; // столбец слева от текущей клетки

    var j_l = j ? j - 1 : W - 1; // столбец справа от текущей клетки

    var j_r = W - 1 - j ? j + 1 : 0;
    return +state[i_top_W + j_l] + state[i_top_W + j] + state[i_top_W + j_r] + state[i_W + j_l] + state[i_W + j_r] + state[i_down_W + j_l] + state[i_down_W + j] + state[i_down_W + j_r];
  }

  function set_life(array) {
    var _getState3 = getState(),
        W = _getState3.W;

    var _iterator = _createForOfIteratorHelper(array),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var e = _step.value;
        fieldState[(e[1] + 50) * W + e[0] + 50] = true;
        fieldStateNext[(e[1] + 50) * W + e[0] + 50] = true;
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }

  function clear() {
    var _getState4 = getState(),
        W = _getState4.W,
        H = _getState4.H;

    for (var k = 0; k < H * W * 4; k++) {
      data[k] = (k + 1) % 4 === 0 ? 255 : 0;
    }

    for (var _k = 0; _k < H * W; _k++) {
      fieldState[_k] = data[_k * 4] === 255;
    }

    ctx.putImageData(img_data, 0, 0);
    setState({
      stop: true,
      i: 0
    });
  }

  function draw() {
    var _getState5 = getState(),
        H = _getState5.H,
        W = _getState5.W;

    console.log(ctx);

    for (var k = 0; k < H * W; k++) {
      if (+fieldState[k] !== !data[k * 4 + 1]) {
        data[k * 4] = fieldState[k] ? 255 : 0;
      }
    }

    ctx.putImageData(img_data, 0, 0);
  }

  function step() {
    var i,
        j,
        sum,
        k = 0;

    for (i = 0; i < H; i++) {
      for (j = 0; j < W; j++) {
        sum = torsum(i, j);

        if (fieldState[k]) {
          fieldStateNext[k] = rule.new.includes(sum);
        } else {
          fieldStateNext[k] = rule.old.includes(sum);
        }

        k++;
      }
    }

    for (k = 0; k < H * W; k++) {
      fieldState[k] = fieldStateNext[k];
    }
  }

  function one_step() {
    step();
    draw();
    setState(function (prevState) {
      return {
        i: prevState.i + 1
      };
    });
  }

  function life() {
    var _getState6 = getState(),
        stop = _getState6.stop;

    if (!stop) {
      one_step();
    }

    setState({
      size: fieldState.reduce(function (sum, x) {
        return sum += x;
      })
    });
    setTimeout(life, 1000);
  }

  function rules() {
    document.getElementById('cells_new').addEventListener('click', update_rule);
    document.getElementById('cells_old').addEventListener('click', update_rule);
    update(document.getElementById('cells_new').querySelector('input'));
    update(document.getElementById('cells_old').querySelector('input'));

    function update_rule(e) {
      var elem = e.target;
      if (elem.tagName !== 'INPUT') return;
      update(elem);
    }

    function update(elem) {
      type = elem.name;
      list = elem.closest("#cells_".concat(type)).querySelectorAll('input');
      list = Array.from(list).filter(function (x) {
        return x.checked;
      }).map(function (x) {
        return +x.id;
      });
      rule[type] = list;
    }
  }

  function update(elem) {
    type = elem.name;
    list = elem.closest("#cells_".concat(type)).querySelectorAll('input');
    list = Array.from(list).filter(function (x) {
      return x.checked;
    }).map(function (x) {
      return +x.id;
    });
    rule[type] = list;
  }

  return function () {
    var _getState7 = getState(),
        stop = _getState7.stop,
        H = _getState7.H,
        W = _getState7.W,
        i = _getState7.i,
        size = _getState7.size;

    return _index.E.div.class(b())(_index.E.canvas.id('field').width(W).height(H), _index.E.p('Поколение ', _index.E.span.id('old')(i)), _index.E.p('Популяция ', _index.E.span.id('size')(size)), _index.E.input.type('button').value(stop ? '>' : '||').onClick(function () {
      setState(function (prevState) {
        return {
          stop: !prevState.stop
        };
      });
    }).id('play'), _index.E.input.type('button').value('1>').onClick(function () {
      return one_step();
    }), _index.E.input.type('button').value('X').onClick(function () {
      return clear();
    }).id('btn_clear'), _index.E.br, _index.E.div.id('cells_new')(_index.E.p('Рождение'), range(0, 8).map(function (i) {
      return _index.E.label(_index.E.input.type('checkbox').name('new').id(i), i);
    })), _index.E.br, _index.E.div.id('cells_old')(_index.E.p('Смерть'), range(0, 8).map(function (i) {
      return _index.E.label(_index.E.input.type('checkbox').name('old').id(i), i);
    })));
  };
}).startFieldState([[3, 0], [4, 1], [0, 2], [4, 2], [1, 3], [2, 3], [3, 3], [4, 3], [0, 7], [1, 8], [2, 8], [2, 9], [2, 10], [1, 11], [3, 14], [4, 15], [0, 16], [4, 16], [1, 17], [2, 17], [3, 17], [4, 17]]);

function initGame() {
  function paint() {
    canvas.onmousedown = startDrawing;
    canvas.onmouseup = stopDrawing;
    canvas.onmouseout = stopDrawing;
    canvas.onmousemove = draw;
    var context = ctx;
    var isDrawing;
    context.strokeStyle = 'rgb(255,0,0)';
    context.lineWidth = 1;
    var pause = false;

    function startDrawing(e) {
      // Начинаем рисовать
      isDrawing = true;

      if (!stop) {
        stop = true;
        pause = true;
      } // Создаем новый путь (с текущим цветом и толщиной линии)


      context.beginPath(); // Нажатием левой кнопки мыши помещаем "кисть" на холст

      context.moveTo(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop);
    }

    function draw(e) {
      if (isDrawing == true) {
        // Определяем текущие координаты указателя мыши
        var x = e.pageX - canvas.offsetLeft;
        var y = e.pageY - canvas.offsetTop; // Рисуем линию до новой координаты

        context.lineTo(x, y);
        context.stroke();
      }
    }

    function stopDrawing() {
      isDrawing = false;

      if (pause) {
        stop = false;
        pause = false;
      }

      img_data = ctx.getImageData(0, 0, W, H);
      data = img_data.data;

      for (var k = 0; k < H * W; k++) {
        state[k] = data[k * 4] == 255;
      }
    }
  }

  function rules() {
    document.getElementById('cells_new').addEventListener('click', update_rule);
    document.getElementById('cells_old').addEventListener('click', update_rule);
    update(document.getElementById('cells_new').querySelector('input'));
    update(document.getElementById('cells_old').querySelector('input'));

    function update_rule(e) {
      var elem = e.target;
      if (elem.tagName !== 'INPUT') return;
      update(elem);
    }

    function update(elem) {
      type = elem.name;
      list = elem.closest("#cells_".concat(type)).querySelectorAll('input');
      list = Array.from(list).filter(function (x) {
        return x.checked;
      }).map(function (x) {
        return +x.id;
      });
      rule[type] = list;
    }
  }
}

var _default = Game;
exports.default = _default;
},{"../../utils/index.js":"utils/index.js","./GameOfLife.less":"components/GameOfLife/GameOfLife.less"}],"components/About/About.less":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"node_modules/parcel-bundler/src/builtins/css-loader.js"}],"components/About/About.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _index = require("../../utils/index.js");

var _index2 = require("../../blocks/index.js");

require("./About.less");

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\u041C\u043E\u0439 ", ""]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\u0420\u0430\u0431\u043E\u0442\u0430\u044E \u0432 ", ""]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var b = (0, _index.block)('about');

var about = _index.E.div.class(b())(_index.E.p('Программирую'), _index.E.p((0, _index.E)(_templateObject(), _index.E.a.href('https://yandex.ru')('Яндексе'))), _index.E.p('Люблю математику'), _index.E.p((0, _index.E)(_templateObject2(), _index.E.a.href('https://github.com/nikalexxx')('Github'))));

var _default = about;
exports.default = _default;
},{"../../utils/index.js":"utils/index.js","../../blocks/index.js":"blocks/index.js","./About.less":"components/About/About.less"}],"MyComponent.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _index = require("./utils/index.js");

var _index2 = require("./blocks/index.js");

var b = (0, _index.block)('my-component');

var MyComponent = _index.Component.MyComponent(function (_ref) {
  var props = _ref.props,
      state = _ref.state;
  state.init({
    show: true
  });
  return function () {
    var visible = props.state;

    var _state = state(),
        show = _state.show;

    var elem = show ? _index.E.span('elem') : null;
    return _index.E.div.class(b())(elem, _index.E.span.style((0, _index.style)({
      color: {
        ok: 'green',
        error: 'red'
      }[visible]
    })).class(b('state'))(visible), _index.E.span.onClick(function (e) {
      // console.log({show});
      state.set(function (prevState) {
        return {
          show: !prevState.show
        };
      });
    })(show ? 'hide' : 'show'));
  };
});

var _default = MyComponent;
exports.default = _default;
},{"./utils/index.js":"utils/index.js","./blocks/index.js":"blocks/index.js"}],"map.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var map = {
  "": {},
  "design": {
    "colors": {
      ":color": {}
    }
  },
  "sandbox": {
    ":id": {}
  },
  "games": {
    "gameOfLife": {}
  }
};
var _default = map;
exports.default = _default;
},{}],"components/Page/Page.less":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"node_modules/parcel-bundler/src/builtins/css-loader.js"}],"components/Page/Page.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _index = require("../../utils/index.js");

var _index2 = require("../index.js");

var _index3 = require("../../blocks/index.js");

var _MyComponent = _interopRequireDefault(require("../../MyComponent.js"));

var _map = _interopRequireDefault(require("../../map.js"));

var _book = require("../../utils/book.js");

require("./Page.less");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var b = (0, _index.block)('page');

var routes = function routes(params) {
  return {
    '/': _index2.Blog,
    'about': _index2.About,
    'book': _index.E.div(_book.book),
    'design': _index2.Design,
    'design/colors': _index2.Colors,
    // 'my/:state': E.div(
    //     MyComponent.state(params.state),
    //     MyComponent.state('ok'),
    //     MyComponent.state('error'),
    //     E.ul(
    //         E.li`Карта кода`,
    //         E.li`Доделать движок`,
    //         E.li`Задизайнить юникод`,
    //         E.li`Меню для мобильной версии`,
    //         E.li`Таблица стандартной модели`,
    //         E.li`Игра Жизнь`,
    //         E.li`Светлая тема`,
    //         E.li`Формат электронной книги`,
    //         E.li`Калькулятор`,
    //         E.li`Построитель графиков`,
    //         E.li`Схема метро(позже интерактивная)`
    //     )
    // ),
    'gameOfLife': _index2.GameOfLife,
    'blog': _index2.Blog,
    'blog/:id': _index2.Post.id(params.id),
    'projects': _index2.Projects,
    'projects/unicode': _index2.Unicode
  };
};

var Menu = _index.Component.Menu(function (_ref) {
  var state = _ref.state;

  var path = function path() {
    return (0, _index.getRouterState)(routes).path;
  };

  state.init({
    i: 0
  });
  window.addEventListener('historyUpdate', function () {
    return state.set(function (prev) {
      return {
        i: prev.i++
      };
    });
  });

  function renderLink(href, title) {
    var current = href === path(); // console.log(href, path());

    return _index.RouteLink.href(href)(_index.E.div.class(b('menu-link', {
      current: current
    }))(title));
  }

  return function () {
    return _index.E.div(renderLink('blog', 'Блог'), renderLink('about', 'Кто я?'), // renderLink('book', 'Книга'),
    renderLink('design', 'Дизайн'), renderLink('projects', 'Проекты') // renderLink('gameOfLife', 'Игра Жизнь'),
    // renderLink('my/ok', 'тест')
    );
  };
});

var Page = _index.E.div.class(b())( // E.div.class(b('header-menu'))(
//     E.div('Alexandr Nikolaichev'),
//     E.div.class(b('scroll-top')).onClick(() => window.scrollTo({top: 0}))('▲ ▲ ▲')
// ),
_index.E.header.class(b('header'))(_index.RouteLink.href('/')(_index.E.h1.style((0, _index.style)({
  textAlign: 'center'
}))('Александр Николаичев'))), _index.E.nav.class(b('menu'))(Menu), _index.E.main.class(b('content'))(_index.Switch.routes(routes)), _index.E.footer.class(b('footer'))('© 2019-2020 Alexandr Nikolaichev'));

var _default = Page;
exports.default = _default;
},{"../../utils/index.js":"utils/index.js","../index.js":"components/index.js","../../blocks/index.js":"blocks/index.js","../../MyComponent.js":"MyComponent.js","../../map.js":"map.js","../../utils/book.js":"utils/book.js","./Page.less":"components/Page/Page.less"}],"components/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Breadcrumbs", {
  enumerable: true,
  get: function () {
    return _Breadcrumbs.default;
  }
});
Object.defineProperty(exports, "Post", {
  enumerable: true,
  get: function () {
    return _Post.default;
  }
});
Object.defineProperty(exports, "Blog", {
  enumerable: true,
  get: function () {
    return _Blog.default;
  }
});
Object.defineProperty(exports, "Projects", {
  enumerable: true,
  get: function () {
    return _Projects.default;
  }
});
Object.defineProperty(exports, "Colors", {
  enumerable: true,
  get: function () {
    return _Colors.default;
  }
});
Object.defineProperty(exports, "Unicode", {
  enumerable: true,
  get: function () {
    return _Unicode.default;
  }
});
Object.defineProperty(exports, "Design", {
  enumerable: true,
  get: function () {
    return _Design.default;
  }
});
Object.defineProperty(exports, "GameOfLife", {
  enumerable: true,
  get: function () {
    return _GameOfLife.default;
  }
});
Object.defineProperty(exports, "About", {
  enumerable: true,
  get: function () {
    return _About.default;
  }
});
Object.defineProperty(exports, "Page", {
  enumerable: true,
  get: function () {
    return _Page.default;
  }
});

var _Breadcrumbs = _interopRequireDefault(require("./Breadcrumbs/Breadcrumbs.js"));

var _Post = _interopRequireDefault(require("./Post/Post.js"));

var _Blog = _interopRequireDefault(require("./Blog/Blog.js"));

var _Projects = _interopRequireDefault(require("./Projects/Projects.js"));

var _Colors = _interopRequireDefault(require("./Colors/Colors.js"));

var _Unicode = _interopRequireDefault(require("./Unicode/Unicode.js"));

var _Design = _interopRequireDefault(require("./Design/Design.js"));

var _GameOfLife = _interopRequireDefault(require("./GameOfLife/GameOfLife.js"));

var _About = _interopRequireDefault(require("./About/About.js"));

var _Page = _interopRequireDefault(require("./Page/Page.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./Breadcrumbs/Breadcrumbs.js":"components/Breadcrumbs/Breadcrumbs.js","./Post/Post.js":"components/Post/Post.js","./Blog/Blog.js":"components/Blog/Blog.js","./Projects/Projects.js":"components/Projects/Projects.js","./Colors/Colors.js":"components/Colors/Colors.js","./Unicode/Unicode.js":"components/Unicode/Unicode.js","./Design/Design.js":"components/Design/Design.js","./GameOfLife/GameOfLife.js":"components/GameOfLife/GameOfLife.js","./About/About.js":"components/About/About.js","./Page/Page.js":"components/Page/Page.js"}],"index.js":[function(require,module,exports) {
"use strict";

var _index = require("./components/index.js");

var _logger = require("./utils/logger.js");

var _element = require("./utils/element.js");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

(0, _logger.setLogger)({
  component: {
    props: _defineProperty({}, _logger.logAllLevels, true)
  }
});
(0, _logger.setLogger)(false); // for production

document.getElementById('root').append((0, _element.DOM)(_index.Page));
},{"./components/index.js":"components/index.js","./utils/logger.js":"utils/logger.js","./utils/element.js":"utils/element.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "64860" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=index.1.1.0.js.map