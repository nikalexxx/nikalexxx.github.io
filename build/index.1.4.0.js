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
      delete eventListeners[_diff.diff.symbols.meta].deleteListeners[eventName];
    } else {
      if (!listener[_diff.diff.symbols.raw]) {
        dom.removeEventListener(eventName, eventListeners[_diff.diff.symbols.meta].deleteListeners[eventName]);
        delete eventListeners[_diff.diff.symbols.meta].deleteListeners[eventName];
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
          } else if (props[prop]) {
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

      function setState(newState, callback) {
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

        if (callback) {
          callback();
        }
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
  },
  4: {
    type: 'js',
    creationTime: '2020-04-11T09:52:02',
    title: 'Стандартная модель элементарных частиц — верстаем с CSS Grid',
    tags: ['css', 'grid', 'physics', 'standard model']
  },
  5: {
    type: 'js',
    creationTime: '2020-04-20T02:13:59',
    title: 'Добавляем светлую тему с CSS переменными',
    tags: ['css', 'css variables']
  },
  6: {
    type: 'js',
    creationTime: '2020-05-09T04:09:09',
    title: 'Игра «Жизнь» и клеточные автоматы в браузере',
    tags: ['js', 'game of life', 'cellular automaton']
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
      size = _ref$props.size,
      onClick = _ref$props.onClick,
      c = _ref$props.class,
      disabled = _ref$props.disabled;
  return function () {
    return _index.E.button.disabled(disabled).onClick(onClick || function () {}).class(b() + (c ? " ".concat(c) : ''))(children);
  };
});

var _default = Button;
exports.default = _default;
},{"../../utils/index.js":"utils/index.js","./Button.less":"blocks/Button/Button.less"}],"blocks/Checkbox/Checkbox.less":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"node_modules/parcel-bundler/src/builtins/css-loader.js"}],"blocks/Checkbox/Checkbox.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _index = require("../../utils/index.js");

require("./Checkbox.less");

function _templateObject() {
  var data = _taggedTemplateLiteral(["checkbox"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var b = (0, _index.block)('checkbox');

var Checkbox = _index.Component.Checkbox(function (_ref) {
  var props = _ref.props;
  return function () {
    return _index.E.label.class(b())(_index.E.input.type(_templateObject()).class(b('input'))._props(props), _index.E.div.class(b('box'))(_index.E.div('✓')), props.children);
  };
});

var _default = Checkbox;
exports.default = _default;
},{"../../utils/index.js":"utils/index.js","./Checkbox.less":"blocks/Checkbox/Checkbox.less"}],"blocks/Select/Select.less":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"node_modules/parcel-bundler/src/builtins/css-loader.js"}],"blocks/Select/Select.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _index = require("../../utils/index.js");

require("./Select.less");

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var b = (0, _index.block)('select');

var Select = _index.Component.Select(function (_ref) {
  var props = _ref.props;
  var heap = Symbol('heap');

  function getPreparedValues() {
    var groups = _defineProperty({}, heap, []);

    var _iterator = _createForOfIteratorHelper(props.values),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var option = _step.value;

        if (option.group) {
          if (!groups[option.group]) {
            groups[option.group] = [];
          }

          groups[option.group].push(option);
        } else {
          groups[heap].push(option);
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    return groups;
  }

  return function () {
    var groups = getPreparedValues(props.values);
    return _index.E.div.class(b())(_index.E.select.class(b('native')).onChange(props.onChange)(Object.keys(groups).map(function (name) {
      var options = groups[name];
      return _index.E.optgroup.label(name)(options.map(function (e) {
        return _index.E.option.value(e.value).selected(e.selected)(e.title);
      }));
    }), groups[heap].map(function (e) {
      return _index.E.option.value(e.value).selected(e.selected)(e.title);
    })), _index.E.div.class(b('expand'))('▾'));
  };
});

var _default = Select;
exports.default = _default;
},{"../../utils/index.js":"utils/index.js","./Select.less":"blocks/Select/Select.less"}],"blocks/index.js":[function(require,module,exports) {
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
Object.defineProperty(exports, "Checkbox", {
  enumerable: true,
  get: function () {
    return _Checkbox.default;
  }
});
Object.defineProperty(exports, "Select", {
  enumerable: true,
  get: function () {
    return _Select.default;
  }
});

var _Button = _interopRequireDefault(require("./Button/Button.js"));

var _Checkbox = _interopRequireDefault(require("./Checkbox/Checkbox.js"));

var _Select = _interopRequireDefault(require("./Select/Select.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./Button/Button.js":"blocks/Button/Button.js","./Checkbox/Checkbox.js":"blocks/Checkbox/Checkbox.js","./Select/Select.js":"blocks/Select/Select.js"}],"utils/book.js":[function(require,module,exports) {
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
    var path = "../data/blog/data/".concat(id, "/index.").concat(type, "?r=").concat(window.appVersion);

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
},{"../../utils/index.js":"utils/index.js","../../data/blog/index.js":"data/blog/index.js","../../blocks/index.js":"blocks/index.js","./Blog.less":"components/Blog/Blog.less"}],"components/Physics/Physics.less":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"node_modules/parcel-bundler/src/builtins/css-loader.js"}],"components/Physics/Physics.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _index = require("../../utils/index.js");

var _index2 = require("../../blocks/index.js");

require("./Physics.less");

function _templateObject() {
  var data = _taggedTemplateLiteral(["font-size: 4em; font-family: serif;"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var b = (0, _index.block)('physics');

var Physics = _index.Component.Physics(function () {
  return function () {
    return _index.E.div.class(b())(_index.E.h2('Физика'), _index.RouteLink.href('physics/standard-model')((0, _index2.Button)(_index.E.div.style((0, _index.style)({
      padding: '16px 64px'
    }))('Стандартная модель', _index.E.br, _index.E.span.style(_templateObject())('e', _index.E.sup('–'), ', γ, H')))));
  };
});

var _default = Physics;
exports.default = _default;
},{"../../utils/index.js":"utils/index.js","../../blocks/index.js":"blocks/index.js","./Physics.less":"components/Physics/Physics.less"}],"components/StandardModel/StandardModel.less":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"node_modules/parcel-bundler/src/builtins/css-loader.js"}],"components/StandardModel/StandardModel.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _index = require("../../utils/index.js");

var _index2 = require("../index.js");

require("./StandardModel.less");

function _templateObject14() {
  var data = _taggedTemplateLiteral([". \u041F\u0440\u0438 \u043D\u0430\u0436\u0430\u0442\u0438\u0438 \u043D\u0430 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 \u0447\u0430\u0441\u0442\u0438\u0446 \u0431\u043E\u0437\u043E\u043D\u043E\u0432 \u2014 \u043A\u0432\u0430\u043D\u0442\u043E\u0432 \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0443\u044E\u0449\u0438\u0445 \u043F\u043E\u043B\u0435\u0439, \u0431\u0443\u0434\u0443\u0442 \u043F\u043E\u0434\u0441\u0432\u0435\u0447\u0435\u043D\u044B \u0432\u0441\u0435 \u0447\u0430\u0441\u0442\u0438\u0446\u044B, \u043D\u0430 \u043A\u043E\u0442\u043E\u0440\u044B\u0435 \u0434\u0435\u0439\u0441\u0442\u0432\u0443\u0435\u0442 \u043F\u043E\u043B\u0435. \u0417\u043D\u0430\u0447\u0435\u043D\u0438\u044F \u043C\u0430\u0441\u0441 \u0434\u043B\u044F \u0447\u0430\u0441\u0442\u0438\u0446 \u0432\u0437\u044F\u0442\u044B \u0441\u043E \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u044B ", " \u0432 \u0432\u0438\u043A\u0438\u043F\u0435\u0434\u0438\u0438. \u0412\u044B\u0434\u0435\u043B\u0435\u043D\u0438\u0435 \u0430\u043D\u0442\u0438\u043D\u0435\u0439\u0442\u0440\u0438\u043D\u043E \u043A\u0430\u043A \u043E\u0442\u0434\u0435\u043B\u044C\u043D\u044B\u0445 \u0447\u0430\u0441\u0442\u0438\u0446 \u0432 \u0442\u0430\u0431\u043B\u0438\u0446\u0435 \u043D\u0435 \u0437\u043D\u0430\u0447\u0438\u0442, \u0447\u0442\u043E \u043E\u043D\u0438 \u044F\u0432\u043B\u044F\u044E\u0442\u0441\u044F \u0444\u0435\u0440\u043C\u0438\u043E\u043D\u0430\u043C\u0438 \u0414\u0438\u0440\u0430\u043A\u0430, \u0430 \u0441\u0434\u0435\u043B\u0430\u043D\u043E \u0438\u0441\u043A\u043B\u044E\u0447\u0438\u0442\u0435\u043B\u044C\u043D\u043E \u0434\u043B\u044F \u0432\u0438\u0437\u0443\u0430\u043B\u044C\u043D\u043E\u0433\u043E \u0443\u0434\u043E\u0431\u0441\u0442\u0432\u0430."]);

  _templateObject14 = function _templateObject14() {
    return data;
  };

  return data;
}

function _templateObject13() {
  var data = _taggedTemplateLiteral(["grid-column: 2 / 8; text-align: center"]);

  _templateObject13 = function _templateObject13() {
    return data;
  };

  return data;
}

function _templateObject12() {
  var data = _taggedTemplateLiteral(["display: flex; justify-content: flex-end; align-items: flex-start; height: 100%"]);

  _templateObject12 = function _templateObject12() {
    return data;
  };

  return data;
}

function _templateObject11() {
  var data = _taggedTemplateLiteral(["display: flex; justify-content: flex-end; align-items: flex-end; height: 100%"]);

  _templateObject11 = function _templateObject11() {
    return data;
  };

  return data;
}

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _templateObject10() {
  var data = _taggedTemplateLiteral(["display:grid;grid-template-columns: 1fr auto"]);

  _templateObject10 = function _templateObject10() {
    return data;
  };

  return data;
}

function _templateObject9() {
  var data = _taggedTemplateLiteral(["text-decoration: overline"]);

  _templateObject9 = function _templateObject9() {
    return data;
  };

  return data;
}

function _templateObject8() {
  var data = _taggedTemplateLiteral(["text-decoration: overline"]);

  _templateObject8 = function _templateObject8() {
    return data;
  };

  return data;
}

function _templateObject7() {
  var data = _taggedTemplateLiteral(["text-decoration: overline"]);

  _templateObject7 = function _templateObject7() {
    return data;
  };

  return data;
}

function _templateObject6() {
  var data = _taggedTemplateLiteral(["text-decoration: overline"]);

  _templateObject6 = function _templateObject6() {
    return data;
  };

  return data;
}

function _templateObject5() {
  var data = _taggedTemplateLiteral(["text-decoration: overline"]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = _taggedTemplateLiteral(["text-decoration: overline"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral(["text-decoration: overline"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["text-decoration: overline"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["text-decoration: overline"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var b = (0, _index.block)('standard-model');
var particles = [{
  name: 'электронное антинейтрино',
  symbol: _index.E.span(_index.E.span.style(_templateObject())('ν'), _index.E.sub('e')),
  charge: '0',
  spin: '1/2',
  mass: _index.E.span('<1.0 eV/c', _index.E.sup('2'))
}, {
  name: 'мюонное антинейтрино',
  symbol: _index.E.span(_index.E.span.style(_templateObject2())('ν'), _index.E.sub('μ')),
  charge: '0',
  spin: '1/2',
  mass: _index.E.span('<0.17 MeV/c', _index.E.sup('2'))
}, {
  name: 'тау антинейтрино',
  symbol: _index.E.span(_index.E.span.style(_templateObject3())('ν'), _index.E.sub('τ')),
  charge: '0',
  spin: '1/2',
  mass: _index.E.span('<18.2 MeV/c', _index.E.sup('2'))
}, {
  name: 'электронное нейтрино',
  symbol: _index.E.span('ν', _index.E.sub('e')),
  charge: '0',
  spin: '1/2',
  mass: _index.E.span('<1.0 eV/c', _index.E.sup('2'))
}, {
  name: 'мюонное нейтрино',
  symbol: _index.E.span('ν', _index.E.sub('μ')),
  charge: '0',
  spin: '1/2',
  mass: _index.E.span('<0.17 MeV/c', _index.E.sup('2'))
}, {
  name: 'тау нейтрино',
  symbol: _index.E.span('ν', _index.E.sub('τ')),
  charge: '0',
  spin: '1/2',
  mass: _index.E.span('<18.2 MeV/c', _index.E.sup('2'))
}, {
  name: 'W бозон',
  symbol: _index.E.span('W'),
  charge: '±1',
  spin: '1',
  mass: _index.E.span('≃80.39 GeV/c', _index.E.sup('2')),
  group: 'SU(2)',
  interaction: 'weak'
}, {
  name: 'Z бозон',
  symbol: _index.E.span('Z'),
  charge: '0',
  spin: '1',
  mass: _index.E.span('≃91.19 GeV/c', _index.E.sup('2')),
  group: 'SU(2)',
  interaction: 'weak'
}, {
  name: 'бозон Хиггса',
  symbol: _index.E.span('H'),
  charge: '0',
  spin: '0',
  mass: _index.E.span('≃124.97 GeV/c', _index.E.sup('2')),
  interaction: 'mass'
}, {
  name: 'позитрон',
  symbol: _index.E.span('e', _index.E.sup('+')),
  charge: '+1',
  spin: '1/2',
  mass: _index.E.span('≃0.511 MeV/c', _index.E.sup('2'))
}, {
  name: 'антимюон',
  symbol: _index.E.span('μ', _index.E.sup('+')),
  charge: '+1',
  spin: '1/2',
  mass: _index.E.span('≃105.66 MeV/c', _index.E.sup('2'))
}, {
  name: 'антитау',
  symbol: _index.E.span('τ', _index.E.sup('+')),
  charge: '+1',
  spin: '1/2',
  mass: _index.E.span('≃1.7768 GeV/c', _index.E.sup('2'))
}, {
  name: 'электрон',
  symbol: _index.E.span('e', _index.E.sup('–')),
  charge: '-1',
  spin: '1/2',
  mass: _index.E.span('≃0.511 MeV/c', _index.E.sup('2'))
}, {
  name: 'мюон',
  symbol: _index.E.span('μ', _index.E.sup('–')),
  charge: '-1',
  spin: '1/2',
  mass: _index.E.span('≃105.66 MeV/c', _index.E.sup('2'))
}, {
  name: 'тау',
  symbol: _index.E.span('τ', _index.E.sup('–')),
  charge: '-1',
  spin: '1/2',
  mass: _index.E.span('≃1.7768 GeV/c', _index.E.sup('2'))
}, {
  name: 'фотон',
  symbol: _index.E.span('γ'),
  charge: '0',
  spin: '1',
  mass: _index.E.span('0'),
  modifier: 'y',
  group: 'U(1)',
  interaction: 'electromagnetic'
}, {
  name: 'верхний',
  symbol: _index.E.span(_index.E.span.style(_templateObject4())('u')),
  charge: '-2/3',
  spin: '1/2',
  mass: _index.E.span('≃2.2 MeV/c', _index.E.sup('2')),
  category: 'anti-quark',
  modifier: 'au'
}, {
  name: 'очаровательный',
  symbol: _index.E.span(_index.E.span.style(_templateObject5())('c')),
  charge: '-2/3',
  spin: '1/2',
  mass: _index.E.span('≃1.28 GeV/c', _index.E.sup('2')),
  category: 'anti-quark'
}, {
  name: 'истинный',
  symbol: _index.E.span(_index.E.span.style(_templateObject6())('t')),
  charge: '-2/3',
  spin: '1/2',
  mass: _index.E.span('≃173.1 GeV/c', _index.E.sup('2')),
  category: 'anti-quark'
}, {
  name: 'верхний',
  symbol: _index.E.span('u'),
  charge: '2/3',
  spin: '1/2',
  mass: _index.E.span('≃2.2 MeV/c', _index.E.sup('2')),
  category: 'quark'
}, {
  name: 'очаровательный',
  symbol: _index.E.span('c'),
  charge: '2/3',
  spin: '1/2',
  mass: _index.E.span('≃1.28 GeV/c', _index.E.sup('2')),
  category: 'quark'
}, {
  name: 'истинный',
  symbol: _index.E.span('t'),
  charge: '2/3',
  spin: '1/2',
  mass: _index.E.span('≃173.1 GeV/c', _index.E.sup('2')),
  category: 'quark'
}, {
  name: 'глюон',
  symbol: _index.E.span('g'),
  charge: '0',
  spin: '1',
  mass: _index.E.span('0'),
  modifier: 'g',
  group: 'SU(3)',
  interaction: 'strong'
}, {
  name: 'нижний',
  symbol: _index.E.span(_index.E.span.style(_templateObject7())('d')),
  charge: '1/3',
  spin: '1/2',
  mass: _index.E.span('≃4.7 MeV/c', _index.E.sup('2')),
  category: 'anti-quark',
  modifier: 'ad'
}, {
  name: 'странный',
  symbol: _index.E.span(_index.E.span.style(_templateObject8())('s')),
  charge: '1/3',
  spin: '1/2',
  mass: _index.E.span('≃96 MeV/c', _index.E.sup('2')),
  category: 'anti-quark'
}, {
  name: 'прелестный',
  symbol: _index.E.span(_index.E.span.style(_templateObject9())('b')),
  charge: '1/3',
  spin: '1/2',
  mass: _index.E.span('≃4.18 GeV/c', _index.E.sup('2')),
  category: 'anti-quark'
}, {
  name: 'нижний',
  symbol: _index.E.span('d'),
  charge: '-1/3',
  spin: '1/2',
  mass: _index.E.span('≃4.7 MeV/c', _index.E.sup('2')),
  category: 'quark'
}, {
  name: 'странный',
  symbol: _index.E.span('s'),
  charge: '-1/3',
  spin: '1/2',
  mass: _index.E.span('≃96 MeV/c', _index.E.sup('2')),
  category: 'quark'
}, {
  name: 'прелестный',
  symbol: _index.E.span('b'),
  charge: '-1/3',
  spin: '1/2',
  mass: _index.E.span('≃4.18 GeV/c', _index.E.sup('2')),
  category: 'quark'
}];

var StandardModel = _index.Component.StandardModel(function (_ref) {
  var state = _ref.state;

  function renderTile() {
    var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        name = _ref2.name,
        symbol = _ref2.symbol,
        charge = _ref2.charge,
        spin = _ref2.spin,
        mass = _ref2.mass,
        category = _ref2.category,
        modifier = _ref2.modifier,
        group = _ref2.group,
        interaction = _ref2.interaction;

    var i = arguments.length > 1 ? arguments[1] : undefined;
    var view = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    var _state = state(),
        current = _state.i;

    return _index.E.div.update(false).class(b('tile', modifier ? {
      mode: modifier
    } : {}))(_index.E.div.style("display: grid; grid-template-rows: auto 1fr ".concat(view ? 'auto' : '3em', ";cursor: pointer"))['data-interaction'](interaction)['data-i'](i)['data-view'](view ? 1 : 0).class(current === i ? b('current') : '').onClick(function (e) {
      var _e$target$closest$fir = e.target.closest('.' + b('tile')).firstChild.dataset,
          interaction = _e$target$closest$fir.interaction,
          i = _e$target$closest$fir.i,
          view = _e$target$closest$fir.view;

      if (+view) {
        return;
      }

      if (interaction) {
        state.set({
          interaction: state().i === +i ? undefined : interaction
        });
      }

      state.set(function (prev) {
        return {
          i: +i === prev.i ? undefined : +i
        };
      });
    })(_index.E.div.style(_templateObject10())(_index.E.div.style("font-size: ".concat(view ? '1' : '.8', "em;"))(view && 'масса: ', mass)), _index.E.div.style(view ? '' : "display:grid;grid-template-columns: auto 1fr")(_index.E.div.style("font-size: ".concat(view ? '1' : '.8', "em;"))(_index.E.div(view && 'спин: ', spin), _index.E.div(view && 'заряд: ', charge), group && _index.E.div(view && 'группа симметрии: ', group), view && interaction && interaction !== 'mass' && _index.E.div('Переносчик ' + {
      strong: 'сильного',
      'electromagnetic': 'электромагнитного',
      'weak': 'слабого'
    }[interaction] + ' взаимодействия')), _index.E.div.style("font-size: ".concat(view ? 5 : 3, "em;font-weight: 100;font-family:serif; display:flex; justify-content: center; align-items: center;margin-right: .3em; padding: .5em 0 .2em 0;").concat(view ? 'margin-top: .1em;' : ''))(_index.E.div.class(b('symbol'))(symbol))), _index.E.div.style("font-size: 1em;  display:flex; justify-content: center; align-items: center; text-align: center;  line-height: 1.1em; ".concat(view ? 'padding-bottom: 1em;' : ''))(_index.E.div(_index.E.div.style(view ? 'font-size: 2em; line-height: 1.5em;' : '')(name, view && category === 'quark' && ' кварк', view && category === 'anti-quark' && ' антикварк'), category === 'quark' && _index.E.div.class(b('colors'))(view && ['цветовой заряд:  ', _index.E.br], ['red', 'green', 'blue'].map(function (color) {
      return _index.E.div.class(b('color', _defineProperty({}, color, true)));
    })), category === 'anti-quark' && _index.E.div.class(b('colors'))(view && ['цветовой заряд: ', _index.E.br], ['antired', 'antigreen', 'antiblue'].map(function (color) {
      return _index.E.div.class(b('color', _defineProperty({}, color, true)));
    })), name === 'глюон' && _index.E.div.class(b('colors'))(view && ['цветовой заряд: ', _index.E.br], ['red-antiblue', 'blue-antigreen', 'green-antired', 'red-antigreen', 'blue-antired', 'green-antiblue', 'g3', 'g8'].map(function (color) {
      var _b3;

      return _index.E.div.class(b('color', (_b3 = {}, _defineProperty(_b3, color, true), _defineProperty(_b3, "gluon", true), _b3)))(color === 'g3' ? '3' : color === 'g8' ? '8' : null);
    }))))));
  }

  return function () {
    var _state2 = state(),
        interaction = _state2.interaction,
        i = _state2.i;

    return _index.E.div(_index2.Breadcrumbs.items([['Физика', 'physics'], ['Стандартная модель']]), _index.E.div.class(b())(_index.E.h2('Стандартная модель элементарных частиц'), _index.E.div.class(b('table'))(_index.E.div.class(b('area', {
      fermions: true
    }))('фермионы'), _index.E.div.class(b('area', {
      bosons: true
    }))('бозоны'), _index.E.div.class(b('area', {
      anti: true
    }))('античастицы'), _index.E.div.class(b('area', {
      normal: true
    }))('частицы'), _index.E.div.class(b('area', {
      vector: true
    }))('векторные'), _index.E.div.class(b('area', {
      scalar: true
    }))('скалярный'), _index.E.div.class(b('area', {
      leptons: true
    }))(_index.E.div.style(_templateObject11())('лептоны')), _index.E.div.class(b('area', {
      quarks: true
    }))(_index.E.div.style(_templateObject12())('кварки')), interaction === 'weak' && [_index.E.div.class(b('weak', {
      part: 1
    })), _index.E.div.class(b('weak', {
      part: 2
    }))], interaction === 'electromagnetic' && [_index.E.div.class(b('electromagnetic', {
      part: 1
    })), _index.E.div.class(b('electromagnetic', {
      part: 2
    })), _index.E.div.class(b('electromagnetic', {
      part: 3
    }))], interaction === 'strong' && [_index.E.div.class(b('strong', {
      part: 1
    })), _index.E.div.class(b('strong', {
      part: 2
    }))], interaction === 'mass' && [_index.E.div.class(b('higgs', {
      part: 1
    })), _index.E.div.class(b('higgs', {
      part: 2
    }))], _index.E.div.class(b('border', _defineProperty({}, 'anti-normal', true))), _index.E.div.class(b('border', _defineProperty({}, 'fermions-bosons', true))), _index.E.div.class(b('border', _defineProperty({}, 'leptons-quarks', true))), _index.E.div.class(b('border', _defineProperty({}, 'vector-scalar', true))), particles.map(function (e, i) {
      return renderTile(e, i);
    }), i !== undefined && _index.E.div.class(b('big-tile'))(renderTile(particles[i], undefined, true)), [1, 2, 3, 1, 2, 3].map(function (k, i) {
      return _index.E.div.class(b('generation', {
        start: i === 0
      }))(k);
    }), _index.E.div.style(_templateObject13())('Поколения')), _index.E.p.update(false)('Взаимодействия: ', _index.E.span.class(b('interaction', {
      type: 'strong'
    }))('сильное'), ', ', _index.E.span.class(b('interaction', {
      type: 'electromagnetic'
    }))('электромагнитное'), ' и ', _index.E.span.class(b('interaction', {
      type: 'weak'
    }))('слабое'), '. Также добавлено ', _index.E.span.class(b('higgs-field'))('поле Хиггса'), (0, _index.E)(_templateObject14(), _index.E.a.href('https://en.wikipedia.org/wiki/Standard_Model')('Стандартной модели')))));
  };
});

var _default = StandardModel;
exports.default = _default;
},{"../../utils/index.js":"utils/index.js","../index.js":"components/index.js","./StandardModel.less":"components/StandardModel/StandardModel.less"}],"components/Projects/Projects.less":[function(require,module,exports) {
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
  var data = _taggedTemplateLiteral(["font-size: 4em"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var b = (0, _index.block)('projects');

var Projects = _index.Component.Projects(function () {
  return function () {
    return _index.E.div.class(b())(_index.E.h2('Проекты'), _index.E.div.class(b('list'))(_index.RouteLink.href('projects/unicode')(_index2.Button.class(b('button'))(_index.E.div.class(b('tile'))('Юникод', _index.E.span.style(_templateObject())('✍')))), _index.RouteLink.href('projects/game-of-life')(_index2.Button.class(b('button'))(_index.E.div.class(b('tile'))('Игра «Жизнь»', _index.E.div.class(b('glider'))(_index.E.div, _index.E.div.class(b('fill')), _index.E.div, _index.E.div, _index.E.div, _index.E.div.class(b('fill')), _index.E.div.class(b('fill')), _index.E.div.class(b('fill')), _index.E.div.class(b('fill'))))))));
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

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var colors = ['black', 'dark-black', 'dark', 'dark-gray', 'gray-dark', 'gray', 'gray-light-medium', 'gray-light', 'light-gray-medium', 'light-gray', 'light', 'light-white', 'white', 'blue', 'blue-light', 'blue-dark', 'blue-sky', 'cyan', 'red', 'red-light', 'green-light', 'orange-light', 'yellow-light', 'violet-light'];
var b = (0, _index.block)('colors');
var currentListener;

var Colors = _index.Component.Colors(function (_ref) {
  var state = _ref.state,
      hooks = _ref.hooks;

  function getContrastCondition(rgb) {
    if (document.body.classList.contains('theme_light')) {
      var v = Math.min.apply(Math, _toConsumableArray(rgb));
      return v > 230;
    } else {
      var _v = Math.max.apply(Math, _toConsumableArray(rgb));

      return _v > 38 && _v < 78;
    }
  }

  state.init({
    theme: ''
  });
  hooks.didMount(function () {
    if (currentListener) {
      window.removeEventListener('theme', currentListener);
      currentListener = null;
    }

    currentListener = window.addEventListener('theme', function (e) {
      state.set({
        theme: e.detail.theme
      });
    });
  });
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
      var border = getContrastCondition(rgb) ? 'solid 1px var(--color-border-contrast)' : undefined;

      var colorNode = _index.E.div(_index.E.div.class(b('area', {
        color: color
      })).style((0, _index.style)(_objectSpread({}, border ? {
        border: border
      } : {}, {
        color: contrast,
        backgroundColor: "var(--color-".concat(color, ")")
      })))(_index.E.div.class(b('code'))(code)), _index.E.div.class(b('name'))(color));

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
},{"../../utils/index.js":"utils/index.js","../../blocks/index.js":"blocks/index.js","./Design.less":"components/Design/Design.less"}],"icons/Ban.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _index = require("../utils/index.js");

function _templateObject7() {
  var data = _taggedTemplateLiteral(["currentColor"]);

  _templateObject7 = function _templateObject7() {
    return data;
  };

  return data;
}

function _templateObject6() {
  var data = _taggedTemplateLiteral(["M256 8C119.034 8 8 119.033 8 256s111.034 248 248 248 248-111.034 248-248S392.967 8 256 8zm130.108 117.892c65.448 65.448 70 165.481 20.677 235.637L150.47 105.216c70.204-49.356 170.226-44.735 235.638 20.676zM125.892 386.108c-65.448-65.448-70-165.481-20.677-235.637L361.53 406.784c-70.203 49.356-170.226 44.736-235.638-20.676z"]);

  _templateObject6 = function _templateObject6() {
    return data;
  };

  return data;
}

function _templateObject5() {
  var data = _taggedTemplateLiteral(["true"]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = _taggedTemplateLiteral(["false"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral(["img"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["http://www.w3.org/2000/svg"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["0 0 512 512"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var _default = _index.Component.BanIcon(function (_ref) {
  var props = _ref.props;
  return function () {
    return _index.S.svg['aria-hidden'](_templateObject5()).focusable(_templateObject4()).role(_templateObject3()).xmlns(_templateObject2()).viewBox(_templateObject())._props(props)(_index.S.path.fill(_templateObject7()).d(_templateObject6()));
  };
});

exports.default = _default;
},{"../utils/index.js":"utils/index.js"}],"icons/Sun.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _index = require("../utils/index.js");

function _templateObject7() {
  var data = _taggedTemplateLiteral(["currentColor"]);

  _templateObject7 = function _templateObject7() {
    return data;
  };

  return data;
}

function _templateObject6() {
  var data = _taggedTemplateLiteral(["M256 160c-52.9 0-96 43.1-96 96s43.1 96 96 96 96-43.1 96-96-43.1-96-96-96zm246.4 80.5l-94.7-47.3 33.5-100.4c4.5-13.6-8.4-26.5-21.9-21.9l-100.4 33.5-47.4-94.8c-6.4-12.8-24.6-12.8-31 0l-47.3 94.7L92.7 70.8c-13.6-4.5-26.5 8.4-21.9 21.9l33.5 100.4-94.7 47.4c-12.8 6.4-12.8 24.6 0 31l94.7 47.3-33.5 100.5c-4.5 13.6 8.4 26.5 21.9 21.9l100.4-33.5 47.3 94.7c6.4 12.8 24.6 12.8 31 0l47.3-94.7 100.4 33.5c13.6 4.5 26.5-8.4 21.9-21.9l-33.5-100.4 94.7-47.3c13-6.5 13-24.7.2-31.1zm-155.9 106c-49.9 49.9-131.1 49.9-181 0-49.9-49.9-49.9-131.1 0-181 49.9-49.9 131.1-49.9 181 0 49.9 49.9 49.9 131.1 0 181z"]);

  _templateObject6 = function _templateObject6() {
    return data;
  };

  return data;
}

function _templateObject5() {
  var data = _taggedTemplateLiteral(["true"]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = _taggedTemplateLiteral(["false"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral(["img"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["http://www.w3.org/2000/svg"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["0 0 512 512"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var _default = _index.Component.SunIcon(function (_ref) {
  var props = _ref.props;
  return function () {
    return _index.S.svg['aria-hidden'](_templateObject5()).focusable(_templateObject4()).role(_templateObject3()).xmlns(_templateObject2()).viewBox(_templateObject())._props(props)(_index.S.path.fill(_templateObject7()).d(_templateObject6()));
  };
});

exports.default = _default;
},{"../utils/index.js":"utils/index.js"}],"icons/Moon.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _index = require("../utils/index.js");

function _templateObject7() {
  var data = _taggedTemplateLiteral(["currentColor"]);

  _templateObject7 = function _templateObject7() {
    return data;
  };

  return data;
}

function _templateObject6() {
  var data = _taggedTemplateLiteral(["M283.211 512c78.962 0 151.079-35.925 198.857-94.792 7.068-8.708-.639-21.43-11.562-19.35-124.203 23.654-238.262-71.576-238.262-196.954 0-72.222 38.662-138.635 101.498-174.394 9.686-5.512 7.25-20.197-3.756-22.23A258.156 258.156 0 0 0 283.211 0c-141.309 0-256 114.511-256 256 0 141.309 114.511 256 256 256z"]);

  _templateObject6 = function _templateObject6() {
    return data;
  };

  return data;
}

function _templateObject5() {
  var data = _taggedTemplateLiteral(["true"]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = _taggedTemplateLiteral(["false"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral(["img"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["http://www.w3.org/2000/svg"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["0 0 512 512"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var _default = _index.Component.MoonIcon(function (_ref) {
  var props = _ref.props;
  return function () {
    return _index.S.svg['aria-hidden'](_templateObject5()).focusable(_templateObject4()).role(_templateObject3()).xmlns(_templateObject2()).viewBox(_templateObject())._props(props)(_index.S.path.fill(_templateObject7()).d(_templateObject6()));
  };
});

exports.default = _default;
},{"../utils/index.js":"utils/index.js"}],"icons/Play.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _index = require("../utils/index.js");

function _templateObject7() {
  var data = _taggedTemplateLiteral(["currentColor"]);

  _templateObject7 = function _templateObject7() {
    return data;
  };

  return data;
}

function _templateObject6() {
  var data = _taggedTemplateLiteral(["M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"]);

  _templateObject6 = function _templateObject6() {
    return data;
  };

  return data;
}

function _templateObject5() {
  var data = _taggedTemplateLiteral(["true"]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = _taggedTemplateLiteral(["false"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral(["img"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["http://www.w3.org/2000/svg"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["0 0 448 512"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var _default = _index.Component.PlayIcon(function (_ref) {
  var props = _ref.props;
  return function () {
    return _index.S.svg['aria-hidden'](_templateObject5()).focusable(_templateObject4()).role(_templateObject3()).xmlns(_templateObject2()).viewBox(_templateObject())._props(props)(_index.S.path.fill(_templateObject7()).d(_templateObject6()));
  };
});

exports.default = _default;
},{"../utils/index.js":"utils/index.js"}],"icons/PencilAlt.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _index = require("../utils/index.js");

function _templateObject7() {
  var data = _taggedTemplateLiteral(["currentColor"]);

  _templateObject7 = function _templateObject7() {
    return data;
  };

  return data;
}

function _templateObject6() {
  var data = _taggedTemplateLiteral(["M497.9 142.1l-46.1 46.1c-4.7 4.7-12.3 4.7-17 0l-111-111c-4.7-4.7-4.7-12.3 0-17l46.1-46.1c18.7-18.7 49.1-18.7 67.9 0l60.1 60.1c18.8 18.7 18.8 49.1 0 67.9zM284.2 99.8L21.6 362.4.4 483.9c-2.9 16.4 11.4 30.6 27.8 27.8l121.5-21.3 262.6-262.6c4.7-4.7 4.7-12.3 0-17l-111-111c-4.8-4.7-12.4-4.7-17.1 0zM124.1 339.9c-5.5-5.5-5.5-14.3 0-19.8l154-154c5.5-5.5 14.3-5.5 19.8 0s5.5 14.3 0 19.8l-154 154c-5.5 5.5-14.3 5.5-19.8 0zM88 424h48v36.3l-64.5 11.3-31.1-31.1L51.7 376H88v48z"]);

  _templateObject6 = function _templateObject6() {
    return data;
  };

  return data;
}

function _templateObject5() {
  var data = _taggedTemplateLiteral(["true"]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = _taggedTemplateLiteral(["false"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral(["img"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["http://www.w3.org/2000/svg"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["0 0 512 512"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var _default = _index.Component.PencilAltIcon(function (_ref) {
  var props = _ref.props;
  return function () {
    return _index.S.svg['aria-hidden'](_templateObject5()).focusable(_templateObject4()).role(_templateObject3()).xmlns(_templateObject2()).viewBox(_templateObject())._props(props)(_index.S.path.fill(_templateObject7()).d(_templateObject6()));
  };
});

exports.default = _default;
},{"../utils/index.js":"utils/index.js"}],"icons/Pause.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _index = require("../utils/index.js");

function _templateObject7() {
  var data = _taggedTemplateLiteral(["currentColor"]);

  _templateObject7 = function _templateObject7() {
    return data;
  };

  return data;
}

function _templateObject6() {
  var data = _taggedTemplateLiteral(["M144 479H48c-26.5 0-48-21.5-48-48V79c0-26.5 21.5-48 48-48h96c26.5 0 48 21.5 48 48v352c0 26.5-21.5 48-48 48zm304-48V79c0-26.5-21.5-48-48-48h-96c-26.5 0-48 21.5-48 48v352c0 26.5 21.5 48 48 48h96c26.5 0 48-21.5 48-48z"]);

  _templateObject6 = function _templateObject6() {
    return data;
  };

  return data;
}

function _templateObject5() {
  var data = _taggedTemplateLiteral(["true"]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = _taggedTemplateLiteral(["false"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral(["img"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["http://www.w3.org/2000/svg"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["0 0 448 512"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var _default = _index.Component.PauseIcon(function (_ref) {
  var props = _ref.props;
  return function () {
    return _index.S.svg['aria-hidden'](_templateObject5()).focusable(_templateObject4()).role(_templateObject3()).xmlns(_templateObject2()).viewBox(_templateObject())._props(props)(_index.S.path.fill(_templateObject7()).d(_templateObject6()));
  };
});

exports.default = _default;
},{"../utils/index.js":"utils/index.js"}],"icons/StepForward.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _index = require("../utils/index.js");

function _templateObject7() {
  var data = _taggedTemplateLiteral(["currentColor"]);

  _templateObject7 = function _templateObject7() {
    return data;
  };

  return data;
}

function _templateObject6() {
  var data = _taggedTemplateLiteral(["M384 44v424c0 6.6-5.4 12-12 12h-48c-6.6 0-12-5.4-12-12V291.6l-195.5 181C95.9 489.7 64 475.4 64 448V64c0-27.4 31.9-41.7 52.5-24.6L312 219.3V44c0-6.6 5.4-12 12-12h48c6.6 0 12 5.4 12 12z"]);

  _templateObject6 = function _templateObject6() {
    return data;
  };

  return data;
}

function _templateObject5() {
  var data = _taggedTemplateLiteral(["true"]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = _taggedTemplateLiteral(["false"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral(["img"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["http://www.w3.org/2000/svg"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["0 0 448 512"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var _default = _index.Component.StepForwardIcon(function (_ref) {
  var props = _ref.props;
  return function () {
    return _index.S.svg['aria-hidden'](_templateObject5()).focusable(_templateObject4()).role(_templateObject3()).xmlns(_templateObject2()).viewBox(_templateObject())._props(props)(_index.S.path.fill(_templateObject7()).d(_templateObject6()));
  };
});

exports.default = _default;
},{"../utils/index.js":"utils/index.js"}],"icons/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Icon = void 0;

var _Ban = _interopRequireDefault(require("./Ban"));

var _Sun = _interopRequireDefault(require("./Sun"));

var _Moon = _interopRequireDefault(require("./Moon"));

var _Play = _interopRequireDefault(require("./Play"));

var _PencilAlt = _interopRequireDefault(require("./PencilAlt"));

var _Pause = _interopRequireDefault(require("./Pause"));

var _StepForward = _interopRequireDefault(require("./StepForward"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Icon = {
  Ban: _Ban.default,
  Sun: _Sun.default,
  Moon: _Moon.default,
  Play: _Play.default,
  Pause: _Pause.default,
  StepForward: _StepForward.default,
  PencilAlt: _PencilAlt.default
};
exports.Icon = Icon;
},{"./Ban":"icons/Ban.js","./Sun":"icons/Sun.js","./Moon":"icons/Moon.js","./Play":"icons/Play.js","./PencilAlt":"icons/PencilAlt.js","./Pause":"icons/Pause.js","./StepForward":"icons/StepForward.js"}],"components/GameOfLife/GameOfLife.less":[function(require,module,exports) {
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

var _index2 = require("../index.js");

var _index3 = require("../../blocks/index.js");

var _index4 = require("../../icons/index.js");

require("./GameOfLife.less");

var _this = void 0;

function _templateObject10() {
  var data = _taggedTemplateLiteral(["\n                    \u041F\u0440\u0435\u0434\u0441\u0442\u0430\u0432\u043B\u0435\u043D\u0430 \u0440\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u043D\u0430\u044F \u0432\u0435\u0440\u0441\u0438\u044F \u043A\u043B\u0435\u0442\u043E\u0447\u043D\u043E\u0433\u043E \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0430 ", ".\n                    \u041F\u0440\u0430\u0432\u0438\u043B\u0430 \u043A\u0430\u0441\u0430\u044E\u0442\u0441\u044F \u043E\u0431\u0449\u0435\u0439 \u0441\u0443\u043C\u043C\u044B \u043A\u043B\u0435\u0442\u043E\u043A \u0432 \u043E\u043A\u0440\u0435\u0441\u0442\u043D\u043E\u0441\u0442\u0438 \u041C\u0443\u0440\u0430.\n                    \u041D\u0430\u0447\u0430\u043B\u044C\u043D\u044B\u0435 \u043A\u043E\u043D\u0444\u0438\u0433\u0443\u0440\u0430\u0446\u0438\u0438 \u0432\u0437\u044F\u0442\u044B \u0441 ", ".\n                    \u041F\u043E\u0434\u0440\u043E\u0431\u043D\u0435\u0435 \u043E \u0440\u0435\u0430\u043B\u0438\u0437\u0430\u0446\u0438\u0438 \u0447\u0438\u0442\u0430\u0439\u0442\u0435 \u0432 ", ".\n                "]);

  _templateObject10 = function _templateObject10() {
    return data;
  };

  return data;
}

function _templateObject9() {
  var data = _taggedTemplateLiteral(["\u041F\u043E\u043F\u0443\u043B\u044F\u0446\u0438\u044F"]);

  _templateObject9 = function _templateObject9() {
    return data;
  };

  return data;
}

function _templateObject8() {
  var data = _taggedTemplateLiteral(["\u041F\u043E\u043A\u043E\u043B\u0435\u043D\u0438\u0435"]);

  _templateObject8 = function _templateObject8() {
    return data;
  };

  return data;
}

function _templateObject7() {
  var data = _taggedTemplateLiteral(["\n                        display: inline-grid;\n                        grid-template-columns: repeat(2, auto);\n                        margin-left: 1em; gap: 8px;\n                    "]);

  _templateObject7 = function _templateObject7() {
    return data;
  };

  return data;
}

function _templateObject6() {
  var data = _taggedTemplateLiteral(["\n                            width: 1em;\n                            height: 1em;\n                            margin: 4px 8px;\n                        "]);

  _templateObject6 = function _templateObject6() {
    return data;
  };

  return data;
}

function _templateObject5() {
  var data = _taggedTemplateLiteral(["\n                            width: 1em;\n                            height: 1em;\n                            margin: 4px 8px;\n                        "]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = _taggedTemplateLiteral(["\n                                width: 1em;\n                                height: 1em;\n                                margin: 4px 8px;\n                                margin-right: 2px;\n                                display: inline-block\n                            "]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral(["\n                            width: 1em;\n                            height: 1em;\n                            margin: 4px 8px;\n                        "]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n                            height: 4em;\n                            min-height: 4em;\n                            max-height: 50vh;\n                            width: ", "px;\n                            min-width: ", "px;\n                            max-width: ", "px;\n                        "]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n                        margin: 4px 0;\n                        margin-right: 8px;\n                        display: inline-block;\n                    "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var b = (0, _index.block)('game-of-life');

var range = function range(start, end) {
  var result = [];

  for (var i = start; i <= end; i++) {
    result.push(i);
  }

  return result;
};

var patternGroups = {
  spaceship: 'Космические корабли, скорость',
  puffer: 'Паровозы, скорость',
  gun: 'Ружья',
  oscillator: 'Осцилляторы, период',
  methuselah: 'Долгожители'
};
var patterns = {
  'glider': {
    name: 'Планер, c/4',
    code: 'bob$2bo$3o!',
    group: patternGroups.spaceship
  },
  'lightweight-spaceship': {
    name: 'Лёгкий космический корабль, c/2',
    code: 'bo2bo$o4b$o3bo$4o!',
    group: patternGroups.spaceship
  },
  'middleweight-spaceship': {
    name: 'Средний космический корабль, c/2',
    code: '3bo2b$bo3bo$o5b$o4bo$5o!',
    group: patternGroups.spaceship
  },
  'heavyweight-spaceship': {
    name: 'Тяжёлый космический корабль, c/2',
    code: '3b2o2b$bo4bo$o6b$o5bo$6o!',
    group: patternGroups.spaceship
  },
  swan: {
    name: 'Лебедь, c/4',
    code: "bo10b2o10b$5o6b2o11b$o2b2o8bo7b2ob$2b2obo5b2o6b3obo$11b2o3bob2o4b$5bob\n        o6b2o8b$10b3obo4bo4b$7b3o3bo4bo5b$8bo7bo7b$8bo6bo8b2$11bo!",
    group: patternGroups.spaceship
  },
  loafer: {
    name: 'Бездельник, c/7',
    code: "b2o2bob2o$o2bo2b2o$bobo$2bo$8bo$6b3o$5bo$6bo$7b2o!",
    group: patternGroups.spaceship
  },
  lobster: {
    name: 'Омар, c/7',
    code: "12b3o$12bo$13bo2b2o$16b2o$12b2o$13b2o$12bo2bo2$14bo2bo$14bo3bo$15b3obo\n        $20bo$2o2bobo13bo$obob2o13bo$o4bo2b2o13b2o$6bo3bo6b2o2b2o2bo$2b2o6bo6b\n        o2bo$2b2o4bobo4b2o$9bo5bo3bo3bo$10bo2bo4b2o$11b2o3bo5bobo$15bo8b2o$15b\n        o4bo$14bo3bo$14bo5b2o$15bo5bo!",
    group: patternGroups.spaceship
  },
  'weekender': {
    name: 'Отдыхающий, 2c/7',
    code: "bo12bob$bo12bob$obo10bobo$bo12bob$bo12bob$2bo3b4o3bo2b$6b4o6b$2b4o4b4o\n        2b2$4bo6bo4b$5b2o2b2o!",
    group: patternGroups.spaceship
  },
  '3-engine-cordership': {
    name: 'Трёхмоторный эсминец, c/12',
    code: "31b3o24b$32bo25b$32bo2bo22b$32bo2bo22b$33bobo22b$48b2o8b$48b2o8b3$32bo\n        25b$31bobo24b$32bo25b$49bo8b$48bo7b2o$30b4o22b2o$30b2o3bo10bo11b$31bo\n        4bo9bobo9b$33bob2o10bo10b$34bo23b3$42bobob2o10b$25bo16bobo13b$24b3o17b\n        o2bo10b$43bo3bo10b$24b3o16b4o2b2o7b$25b2ob2o14bo5b2o6b$27bo21bo8b3$b3o\n        54b$2bo55b$2bo2bo52b$2bo2bo52b$3bobo52b$18b2o38b$18b2o38b$24bo33b$23b\n        3o32b$2bo19b2ob2o31b$bobo18bobo33b$2bo19bo35b3$4o54b$2o3bo13bo38b$bo4b\n        o11bobo37b$3bob2o11bo39b$4bo15b2o36b$21bo36b$18b3o37b$19b2o37b$16bo41b\n        $16b2o40b$16b2o40b$6b2o6b2o42b$6b2o4b2o44b$12b2obo42b$14b2o42b5$14b2o\n        42b$14b2o!",
    group: patternGroups.spaceship
  },
  'p15-pre-pulsar-spaceship': {
    name: 'Допульсарный космический корабль(период 15), c/5',
    code: "3b3o10b3o23b3o10b3o3b$4bobo8bobo25bobo8bobo4b$6bo8bo29bo8bo6b$bob5o6b\n        5obo19bob5o6b5obob$bob2o3b2o2b2o3b2obo19bob2o3b2o2b2o3b2obob$2o5b3o2b\n        3o5b2o17b2o5b3o2b3o5b2o$5b2ob2o2b2ob2o27b2ob2o2b2ob2o5b2$4bo12bo25bo\n        12bo4b$5b3o6b3o27b3o6b3o5b$4b4o6b4o25b4o6b4o4b$3b2o12b2o23b2o12b2o3b$\n        4bo12bo25bo12bo4b$2b3o12b3o21b3o12b3o2b$2bo16bo21bo16bo2b$5bo10bo27bo\n        10bo5b$3bobo10bobo23bobo10bobo3b$2bo3b2o6b2o3bo21bo3b2o6b2o3bo2b$3bo5b\n        o2bo5bo23bo5bo2bo5bo3b$9bo2bo35bo2bo9b$bob2o4bo2bo4b2obo19bob2o4bo2bo\n        4b2obob$bo3b3obo2bob3o3bo19bo3b3obo2bob3o3bob$2bo6bo2bo6bo21bo6bo2bo6b\n        o2b$bo2b2o3bo2bo3b2o2bo19bo2b2o3bo2bo3b2o2bob$bo2b2obobo2bobob2o2bo19b\n        o2b2obobo2bobob2o2bob$5bo2bo4bo2bo27bo2bo4bo2bo5b$6bobo4bobo29bobo4bob\n        o6b$27bo5bo27b$4b2obob4obob2o9bo5bo9b2obob4obob2o4b$10b2o14bobo3bobo\n        14b2o10b$2bob2o10b2obo7bo5bo7bob2o10b2obo2b$2o2bo3b2o2b2o3bo2b2o5bo5bo\n        5b2o2bo3b2o2b2o3bo2b2o$b2obo12bob2o19b2obo12bob2ob$3b2obo8bob2o23b2obo\n        8bob2o3b$4bo2bo6bo2bo25bo2bo6bo2bo4b$b2o2bo2bo4bo2bo2b2o4b2o7b2o4b2o2b\n        o2bo4bo2bo2b2ob$bo5b2o4b2o5bo5bobo3bobo5bo5b2o4b2o5bob$b3o3bo6bo3b3o6b\n        o5bo6b3o3bo6bo3b3ob$3b4o8b4o23b4o8b4o3b$4bo2bo6bo2bo25bo2bo6bo2bo4b$4b\n        o12bo25bo12bo4b$4bob2o6b2obo25bob2o6b2obo4b$5bo10bo27bo10bo!",
    group: patternGroups.spaceship
  },
  'spaghetti-monster': {
    name: 'Спагетти монстр, 3c/7',
    code: "8b3o5b3o$8bobo5bobo$8bobo5bobo$6bob2o3bo3b2obo$6b2o4bobo4b2o$10b2obob\n        2o$9bo7bo$9bobo3bobo$5b5o7b5o$4bo2bo11bo2bo$5bob3o7b3obo$7bob2o5b2obo$\n        6b2obobo3bobob2o$6b3obo5bob3o2$10b2o3b2o$12bobo$9bo7bo$9b2o5b2o$6b2o\n        11b2o$4bob2o11b2obo$4b2o2b2o7b2o2b2o$4bo2bo2bo5bo2bo2bo$5bo4bo5bo4bo$\n        5bo2bo2bo3bo2bo2bo$2bo5bo9bo5bo$3bobo15bobo$7bo11bo$3bo3bobo7bobo3bo$\n        3bo2bo3bo5bo3bo2bo$4b2o2b2o7b2o2b2o$8bo9bo2$8b5ob5o$bo6b2ob2ob2ob2o6bo\n        $3o7bo5bo7b3o$o2b2o5bo5bo5b2o2bo$2bo3b5o5b5o3bo$7bob2o5b2obo$bo3bo15bo\n        3bo$bob2o2bo11bo2b2obo$bob4o13b4obo$4bo17bo2$2bo21bo$bobo19bobo$o25bo$\n        o3bo17bo3bo$5bo15bo$2o23b2o$2bo3bo2bo7bo2bo3bo$2bo3bobobo5bobobo3bo$2b\n        o5bob2o3b2obo5bo$2bo3b2obo7bob2o3bo$6b2o11b2o$4bo17bo$3bo19bo$3bo4bo9b\n        o4bo$2b2o3b2o9b2o3b2o$2b2o3bobo7bobo3b2o$2b2o3b2o3b3o3b2o3b2o$2b3o2b3o\n        bo3bob3o2b3o$6bob2obo3bob2obo$2b2o3b2obo5bob2o3b2o$3bob2o3bobobobo3b2o\n        bo$11bobobo$8bo9bo$8b3o5b3o$10b2obob2o$10b7o$8b3o5b3o$7b2obobobobob2o$\n        6bo3bo5bo3bo$11b2ob2o$5bo2bobobobobobo2bo$6b4o7b4o$9bo7bo$9bo7bo$6b2ob\n        o2bobo2bob2o2$9b2o5b2o3$9bo7bo$9b3o3b3o$8bo2bo3bo2bo$9bo7bo$8bo2bo3bo\n        2bo$11b2ob2o$12bobo$10bobobobo$9bo3bo3bo$9bo7bo$12bobo$7b2obo5bob2o$7b\n        2o2bo3bo2b2o$7bo11bo$8bo9bo$6bobo9bobo$5b4o9b4o$5b2obobo5bobob2o$4bo2b\n        o11bo2bo$9bobo3bobo$8b2obo3bob2o$4bo2bo3b2ob2o3bo2bo$9bo2bobo2bo$6bo2b\n        ob2ob2obo2bo$7bobobobobobobo$8b2o2bobo2b2o$9bobo3bobo$10b2o3b2o$7b2o9b\n        2o$7b3o7b3o$7bobo7bobo$5b2o2bo7bo2b2o$5b2o13b2o$11bo3bo$6bo4bo3bo4bo$\n        6b2o3bo3bo3b2o$7bo2bo5bo2bo$7b3o7b3o$6bobo9bobo$6b2o11b2o$6bobo4bo4bob\n        o$6b2o4b3o4b2o$6b2o3bo3bo3b2o$5b3o4b3o4b3o$3b2o17b2o$2bo5b2o2bobo2b2o\n        5bo2$2bo2bob3ob2ob2ob3obo2bo$8b3o5b3o$10b3ob3o$5bo4b2obob2o4bo$11bo3bo\n        2$11b2ob2o!",
    group: patternGroups.spaceship
  },
  'puffer-1': {
    name: 'Паровоз 1, c/2',
    code: "b3o6bo5bo6b3ob$o2bo5b3o3b3o5bo2bo$3bo4b2obo3bob2o4bo3b$3bo19bo3b$3bo2b\n        o13bo2bo3b$3bo2b2o11b2o2bo3b$2bo3b2o11b2o3bo!",
    group: patternGroups.puffer
  },
  'puffer-2': {
    name: 'Паровоз 2, c/2',
    code: "78bo26b$76b2o27b$77b2o26b2$69bobo33b$69b2o34b$70bo34b2$12bo92b$10bobo\n        29b2o28b2o31b$11b2o29b2o28b2o31b$8b2o95b$7bobo95b$9bo95b2$80b2o23b$57b\n        3o9b2o9bobo4b3o11b3ob$57bo2bo8bobo8bo6bo2bo10bo2bo$57bo11bo17bo6b3o4bo\n        3b$57bo29bo5bo2bo4bo3b$58bobo27bobo2b2obo5bobo25$60bo44b$61b2o42b$60b\n        2o43b3$4bobo98b$4b2o99b$5bo99b$34b2o28b2o39b$36bo29bo38b$2b2o29bo29bo\n        41b$3b2o29b2o21b3o4b2o5b3o13b3o11b3ob$2bo54bo2bo10bo2bo12bo2bo10bo2bo$\n        57bo13bo15bo6b3o4bo3b$5b2o50bo13bo15bo5bo2bo4bo3b$4b2o52bobo11bobo13bo\n        bo2b2obo5bobo$6bo98b4$93bo11b$94bo10b14$55bo49b$56b2o47b$55b2o48b7$5bo\n        99b$3bobo29b2o28b2o38b$4b2o29b2o28b2o38b$b2o102b$obo102b$2bo102b4$64bo\n        40b$63b3o39b$63bob2o38b$64b3o38b$64b2o39b4$57b3o11b3o13b3o11b3ob$57bo\n        2bo10bo2bo12bo2bo10bo2bo$57bo13bo15bo6b3o4bo3b$57bo13bo15bo5bo2bo4bo3b\n        $58bobo11bobo13bobo2b2obo5bobo5$93bo11b$94bo!",
    group: patternGroups.puffer
  },
  'glider-train': {
    name: 'Планерный поезд, c/2',
    code: "32b2o$31b2o$33bo17b6o6b2o$50bo5bo4bo4bo$56bo10bo$26b5o19bo4bo5bo5bo$\n        25bo4bo21b2o8b6o$30bo$18b2o5bo3bo23bo$18b2o7bo24bobo$14b3o4bo29bo5bo$\n        13bob2o5b2o11b2o15bobobobo6bo$b2o9b2obobo3b2o11bo2bo13b2o2bo3bo5b2o$o\n        2bo9b6o9b2o4bobo7b2o5b2o3b2obo4bob2o$b2o11b4o10b2o5bo8b2o7bo5bo4bobo$\n        50bobo11b2o2$50bobo11b2o$b2o11b4o10b2o5bo8b2o7bo5bo4bobo$o2bo9b6o9b2o\n        4bobo7b2o5b2o3b2obo4bob2o$b2o9b2obobo3b2o11bo2bo13b2o2bo3bo5b2o$13bob\n        2o5b2o11b2o15bobobobo6bo$14b3o4bo29bo5bo$18b2o7bo24bobo$18b2o5bo3bo23b\n        o$30bo$25bo4bo21b2o8b6o$26b5o19bo4bo5bo5bo$56bo10bo$50bo5bo4bo4bo$33bo\n        17b6o6b2o$31b2o$32b2o!",
    group: patternGroups.puffer
  },
  'space-rake': {
    name: 'Космические грабли, с/2',
    code: "11b2o5b4o$9b2ob2o3bo3bo$9b4o8bo$10b2o5bo2bob2$8bo13b$7b2o8b2o3b$6bo9bo\n        2bo2b$7b5o4bo2bo2b$8b4o3b2ob2o2b$11bo4b2o4b4$18b4o$o2bo13bo3bo$4bo16bo\n        $o3bo12bo2bob$b4o!",
    group: patternGroups.puffer
  },
  '3-engine-cordership-rake': {
    name: 'Грабли для трёхмоторного эсминца, c/2',
    code: "142b2o317b$126b2o13b2ob2o315b$125b4o13b4o315b$124b2ob2o14b2o316b$125b\n        2o334b$147bo313b$146b3o312b$130bo11bo3b2obo311b$128b4o10bo6bo311b$127b\n        ob5o14bo6bo305b$126b2o6bo18b2o306b$127b3obo3bo18b2o305b$128b3o3bo326b$\n        133bo327b$160bo5b2o293b$126b2o30b2o5b2ob3o290b$125b4o4b4o22b2o5b5o290b\n        $124b2ob2o4bo3bo3bo2bo22b3o291b$125b2o6bo6bo320b$134bo2bo2bo3bo20bo\n        295b$140b4o9b2o8b2o296b$146b3o5b2o8b2o295b$146b2ob2o6b3o301b$146b3o5b\n        2o305b$140b4o9b2o306b$140bo3bo316b$140bo320b$141bo2bo316b$159bo2bo298b\n        $158bo302b$158bo3bo298b$100b2o56b4o299b$99b4o68bo289b$98b2ob2o68bo289b\n        $82b2o15b2o58b3o3bo295b$81b2ob2o72b5o2bo7bo287b$82b4o71b2ob4obo7bo287b\n        $83b2o73b2o301b$103bo357b$97b2o3b3o356b$85b3o9b3ob5o355b$84b2o3bo9b3o\n        8bobo348b$83b2o2bobo9b3o8b2o46b4o299b$84bo5bo9bo10bo46bo3bo298b$85b2o\n        2bo11bo56bo302b$89bo34b3o32bo2bo298b$87bo27bobo5b5o333b$91bo2bo20b2o5b\n        2ob3o333b$82b2o6bo25bo6b2o336b$81b2ob2o4bo3bo366b$82b4o4b4o3b4o360b$\n        83b2o12bo3bo9bo8bobo338b$97bo11b2o9b2o14bo324b$98bo2bo2b2o5b3o7bo12bo\n        3bo322b$103b3o6b3o18bo327b$98bo2bo2b2o5b3o19bo4bo322b$97bo11b2o22b5o\n        323b$97bo3bo9bo349b$97b4o360b2$115b2o344b$114b2ob2o342b$115b4o17b2o\n        323b$116b2o17b3o323b$117bo18b2o323b$115bo3bo2b2o13bobo321b$114bo5bob2o\n        14b2o321b$114bo5b4o337b$114b6o341b2$130b2o46bo2bo279b$129b2ob2o43bo\n        283b$130b4o5b2o36bo3bo279b$131b2o5b2ob4o15b4o13b4o280b$139b6o15bo3bo\n        296b$140b4o16bo300b$161bo2bo296b$181b3o277b$165bo10bobobo3bo276b$163b\n        3o10bo7bo27bobo10bo235b$162bo3bo15b2o5bo22b2o9b2o236b$162bo4b3o19bobo\n        21bo10b2o235b$162b2obob3o8bo10b2o270b$164bo3b2o34bo256b$165bobo34bo3bo\n        254b$194bo6bo259b$194bobo4bo4bo254b$160b4o5b2o23b2o5b5o255b$160bo3bo3b\n        2ob2o4b2o282b$160bo8b4o3b4o281b$161bo2bo5b2o3b2ob2o9bo9bo261b$176b2o\n        11bo9bobo259b$182bobo4b2o2bo5b2o260b$181b2o2bo7bo267b$182bobo4b2o2bo\n        267b$176b2o11bo271b$175b2ob2o9bo271b$176b4o281b$177b2o282b$68b2o125b2o\n        264b$66bo4bo122b4o263b$65bo127b2ob2o263b$57bo2bo4bo5bo68bo2bo50b2o265b\n        $56bo8b6o68bo64bo256b$56bo3bo78bo3bo59bobo255b$56b4o62b4o13b4o55b2o2b\n        2ob3o6bo246b$42b4o76bo3bo66b12ob2o6bobo244b$41b7o4b2o68bo70bo7bo2bo9b\n        2o245b$40b2ob3ob2o2bobo69bo2bo66bo6b2o3b2o254b$41b2o3b2o2bo2b2o93bo45b\n        o266b$50bo2bo73b2o19bobo45b2o263b$44b2o4bobo72b5o18b2o311b$42bo8bo72bo\n        4bo2b3obo63b2o259b$41bo82bo2b3o3bo3b2o60b4o258b$41bo3bo78b2o2bo7bobo\n        14bo44b2ob2o258b$41b4o81b2o7b2obo14bobo10bo32b2o260b$25b2o109b2o15b2o\n        9bo3bo292b$24b4o108bo26bo297b$23b2ob2o135bo4bo292b$24b2o5b2ob3o85b4o5b\n        2o25bo4b5o293b$30bo5b2o84bo3bo3b2ob2o4b2o17bobo300b$29b2o7bo10bo72bo8b\n        4o3b4o16b2o301b$30bo5b2o9bo2bo72bo2bo5b2o3b2ob2o9bo309b$24b2o5b2ob3o\n        10b2o89b2o11bo11b2o296b$9bo2bo5b2o3b2ob2o116bobo4b2o2bo7b2o296b$8bo8b\n        4o3b4o115b2o2bo7bo18b2o285b$8bo3bo3b2ob2o4b2o16b2o99bobo4b2o2bo17b2ob\n        3o282b$8b4o5b2o24bobo3b5o84b2o11bo22b5o282b$43bo5bo4bo82b2ob2o9bo23b3o\n        283b$49bo88b4o319b$50bo3bo21b2o61b2o320b$19b2o17b2o12bo22b2ob4o73b4o\n        302b$10b3o7b2o16bobo26b2o7b6o73bo3bo14b2o285b$10bo6bo2bo17bo27b2ob2o6b\n        4o74bo19b2o284b$10bobo6bo34b2o11b4o85bo17bo286b$11b2o3b2o34bo15b2o88b\n        2o301b$33b2o16bo6bo103b3o296b$33bo17bo8bo94b2o3b2o3bo295b$9bo2bo20bo\n        17b8obo93b2ob3obo2bo296b$8bo22b2o23b2o97b9o108bobo10bo175b$8bo3bo143b\n        4o112b2o9b2o176b$8b4o13b4o118bo22b4o99bo10b2o175b$25bo3bo22b2o94b2o20b\n        o3bo286b$25bo25b2ob2o91b2o21bo8b6o276b$26bo2bo22b4o115bo2bo4bo5bo275b$\n        35bo2bo14b2o124bo281b$34bo28b2o115bo4bo275b$34bo3bo7bo15b2o118b2o277b$\n        34b4o4bo3b3o15bo396b$40b2o5b2o412b$40b3o6bo8bo402b$40b2o5b2o9b2o401b$\n        34b4o4bo3b3o9b2o401b$28bo2bo2bo3bo7bo414b$19b2o6bo6bo426b$18b2ob2o4bo\n        3bo3bo2bo22b3o397b$19b4o4b4o22b2o5b5o396b$20b2o30b2o5b2ob3o396b$54bo5b\n        2o399b$27bo433b$22b3o3bo78b2o352b$21b3obo3bo18b2o56bobo352b$20b2o6bo\n        18b2o59bo156bo195b$21bob5o14bo6bo215bobo193b$22b4o10bo6bo75bo21bo123b\n        2o194b$24bo11bo3b2obo74b2o22bo131bo186b$40b3o75bobo19b3o131bobo184b$\n        41bo10b3o219b2o185b$19b2o30b5o405b$18b2ob2o14b2o11b2ob3o405b$19b4o13b\n        4o11b2o408b$20b2o13b2ob2o421b$36b2o17b2o404b$54b3o31b4o369b$55b2o2b2o\n        26b9o365b$59b2o25b2ob3obo2bo364b$50b2o3bo31b2o3b2o3bo363b$49b2ob4obo\n        36b3o364b$50b7o33b2o369b$51b2o35bo15bo356b$87bo15bobo355b$37b4o46bo3bo\n        13bo355b$36b7o44b4o13bo356b$35b2ob3ob3o416b$36b2o3b2obo416b$69b4o388b$\n        39b2o28bo3bo387b$37bo31bo7bo383b$36bo33bo2bo2b7o378b$36bo3bo34b2ob3o2b\n        o10bo366b$36b4o30bo2bo2b7o9b3o366b$49bo19bo7bo15bobo365b$48b2o5b2o12bo\n        3bo387b$18b4o26bobo3b4o4b4o3b4o388b$18bo3bo10bo19b2ob2o4bo3bo22bo371b$\n        18bo7b2o4bobo19b2o6bo25b2o5b2o364b$19bo2bo2b4o3bo2b2o26bo2bo21bobo3b2o\n        b3o361b$24b2o3bo5bob2o56b5o361b$19bo2bo2b4o3bo2b2o59b3o362b$18bo7b2o4b\n        obo29b2o18bo247bobo10bo115b$4b2o12bo3bo10bo22b2o7bo17b2o247b2o9b2o116b\n        $3b4o4b4o3b4o17bo15b2o5bo2bo17bobo241bo5bo10b2o115b$2b2ob2o4bo3bo22b2o\n        16b2o4b3o263b2o131b$3b2o6bo26bobo3b2o11bo3b2o15bo248b2o132b$12bo2bo27b\n        2ob3o29bo382b$44b5o27bobo382b$16b2o16bo10b3o7b2o20bo383b$6b2o8b2o15b2o\n        19b4o18b2o383b$5bo2bo5bo3bo14bobo17b2ob2o403b$4b2o2bo4bo3bo36b2o15b2o\n        388b$5b2o2bo2bo4bo52b2ob2o386b$6b4o3bobo13bo41b4o210bobo173b$28b2o42b\n        2o212b2o173b$28bobo255bo174b$4b2o335b2o118b$3b4o334bobo117b$2b2ob2o63b\n        2o269bo119b$3b2o15b2o32b2o13b2ob2o387b$19b2ob2o29b4o13b4o387b$20b4o28b\n        2ob2o14b2o388b$21b2o30b2o406b2$325bo135b$67b2o4bo251bobo133b$56b2o9b2o\n        3b3o7bo38b2o198bo3b2o134b$55bo2bo12b2ob2o4b2o23b2o13b2ob2o197bo11bo\n        126b$54b2o2bo11b3ob3o4b2o21b4o13b4o195b3o11bobo124b$55b2o2bo11b2ob3o\n        26b2ob2o14b2o210b2o125b$56b4o12bobo29b2o355b$87bo373b$85b2o7b2o365b$\n        54b2o30b2o5b2ob3o17b2o14bo328b$53b4o4b4o29b5o16bo2bo11b2o329b$52b2ob2o\n        4bo3bo3bo2bo22b3o8b2o13b3o7b2o328b$53b2o6bo6bo23bo12b2o5bo8bo2bo336b$\n        62bo2bo2bo3bo11b2o4b2o14b2o4bo3bo3b2ob2o336b$68b4o11bo7b2o14bo3bo4bo\n        20bo323b$74b3o2b2o7bo25bo20b2o324b$74b3o2b2o8bo46b2o7b2o314b$74b3o2b2o\n        7bo8bo7b2o37b2ob3o311b$68b4o11bo11b2o7b4o4b4o29b5o133b2o38b2o136b$68bo\n        3bo11b2o10b2o5b2ob2o4bo3bo3bo2bo18bo3b3o135b2o38b2o135b$68bo35b2o6bo6b\n        o20b2o141bo39bo137b$69bo2bo40bo2bo2bo3bo7bo9b2o318b$19b2o66bo2bo28b4o\n        4bo3b3o255b3o69b$18b4o64bo38b2o5b2o255bo71b$17b2ob2o64bo3bo34b3o6bo\n        255bo70b$b2o15b2o66b4o35b2o5b2o327b$2ob2o92bo21b4o4bo3b3o321b2o4b$b4o\n        90b2obo20bo3bo7bo190b3o129b2ob4o$2b2o83b3o10bo18bo202bo132b6o$26bobo\n        57b5o9bo19bo2bo28bo131bo38bo132b4ob$26b2o42b2o13b2ob4o5bo2bo37bo2bo8b\n        2o132b2o61b2o112b$4b4o3bobo13bo41b4o13b2o5b2o3bo38bo13b2o130bobo61bobo\n        111b$3b2o2bo2bo4bo52b2ob2o39bo24bo3bo205bo113b$2b2o2bo4bo3bo36b2o15b2o\n        39b2o25b4o320b$3bo2bo5bo3bo14bobo17b2ob2o50bo4b2o37bo310b$4b2o8b2o15b\n        2o19b4o18b2o24b2o4bo43bo243b5o62b$14b2o16bo10b3o7b2o20bo23b2ob2o2b2o\n        30b3o3bo249bo4bo61b$42b5o27bobo23b4ob3o29b5o2bo7bo241bo66b$10bo2bo27b\n        2ob3o29bo24b4o3bob2o24b2ob4obo7bo242bo3bo61b$b2o6bo26bobo3b2o11bo3b2o\n        15bo28bob5o25b2o258bo63b$2ob2o4bo3bo22b2o16b2o4b3o41b2ob2o352b$b4o4b4o\n        3b4o17bo15b2o5bo2bo17bobo22bo354b$2b2o12bo3bo10bo22b2o7bo17b2o19b2ob2o\n        354b$16bo7b2o4bobo29b2o18bo18b5o355b$17bo2bo2b4o3bo2b2o59b3o3b2ob3o\n        355b$22b2o3bo5bob2o56b5o3b2o358b$17bo2bo2b4o3bo2b2o26bo2bo21bobo3b2ob\n        3o363b$16bo7b2o4bobo19b2o6bo25b2o5b2o366b$16bo3bo10bo19b2ob2o4bo3bo22b\n        o373b$16b4o26bobo3b4o4b4o3b4o390b$46b2o5b2o12bo3bo389b$47bo19bo7bo15bo\n        bo367b$34b4o30bo2bo2b7o9b3o188b2o178b$34bo3bo34b2ob3o2bo10bo188bobo\n        177b$34bo33bo2bo2b7o200bo179b$35bo31bo7bo385b$37b2o28bo3bo389b$67b4o\n        390b$34b2o3b2obo418b$33b2ob3ob3o418b$34b7o44b4o13bo358b$35b4o46bo3bo\n        13bo357b$85bo15bobo357b$49b2o35bo15bo358b$48b7o33b2o371b$47b2ob4obo36b\n        3o366b$48b2o3bo31b2o3b2o3bo105b2o258b$57b2o25b2ob3obo2bo104bo4bo256b$\n        53b2o2b2o26b9o104bo262b$52b3o31b4o100bo2bo4bo5bo256b$53b2o134bo8b6o\n        257b$40bo2bo145bo3bo267b$39bo9b2o138b4o268b$39bo3bo4b2ob3o121b4o282b$\n        22b4o13b4o6b5o120b7o4b2o274b$22bo3bo23b3o120b2ob3ob2o2bobo274b$22bo93b\n        obo55b2o3b2o2bo2b2o273b$23bo2bo89b2o65bo2bo274b$43b3o71bo25b2o32b2o4bo\n        bo275b$27bo10bobobo3bo97b2o29bo8bo276b$25b3o10bo7bo59bo36bo30bo14b2o\n        270b$24bo3bo15b2o5bo52bobo67bo3bo10bobo269b$24bo4b3o19bobo51b2o67b4o\n        11bo139b3o129b$24b2obob3o8bo10b2o105b2o169bo131b$26bo3b2o34bo90b4o169b\n        o130b$27bobo34bo3bo87b2ob2o9bo23b3o264b$56bo6bo93b2o11bo22b5o263b$56bo\n        bo4bo4bo94bobo4b2o2bo17b2ob3o64b3o196b$22b4o5b2o23b2o5b5o94b2o2bo7bo\n        18b2o67bo198b$22bo3bo3b2ob2o4b2o122bobo4b2o2bo88bo197b$22bo8b4o3b4o\n        115b2o11bo8b2o106b2o172b$23bo2bo5b2o3b2ob2o19bo80bo2bo5b2o3b2ob2o9bo8b\n        obo105bobo171b$38b2o5b2ob3o12bo77bo8b4o3b4o18bo107bo173b$44bo5b2o8bobo\n        78bo3bo3b2ob2o4b2o301b$43b2o7bo8bo79b4o5b2o30b5o274b$44bo5b2o122b2o6bo\n        4bo273b$38b2o5b2ob3o15bo107bobo5bo56bo221b$37b2ob2o24bobo92bo12bo8bo3b\n        o42b6obo3bo219b$38b4o24b2o77b2o13bo2bo21bo32b2o10bo5bo3b3o218b$39b2o\n        102b2ob2o11bo3bo53b2ob2o8bo5bo5bo218b$55b4o84bo2bo12bo3bo5b2o47b4o9bo\n        3bo3b2obo218b$55bo3bo83bo2bo12bo3bo5bobo47b2o12bo5b3o219b$55bo88b2o9b\n        2o3bobo6bo62b2o227b$56bo98b2o4bo69b4o226b$58b2o170b2ob2o226b$142bo2bo\n        85b2o228b$55b2o3b2obo77bo319b$54b2ob3ob3o77bo3bo315b$55b7o79b4o13b4o\n        51b2o246b$56b4o98bo3bo49b2ob2o8bo235b$70b4o84bo54b4o3bo4bobo233b$70bo\n        3bo84bo2bo51b2o3bo5bo2bo232b$70bo8b6o133bo2bo6bo232b$71bo2bo4bo5bo128b\n        2o3bo5bo2bo8bo223b$79bo133b4o3bo4bobo9b2o222b$80bo4bo126b2ob2o8bo235b$\n        82b2o113b4o5b2o5b2o26bo219b$197bo3bo3b2ob2o22b3o4bo3bo217b$197bo8b4o\n        22bo5bo222b$198bo2bo5b2o24bo4bo4bo217b$238b5o218b$210bo250b$200b2o8b2o\n        15b3o231b$199bo2bo9bo14bo233b$199bo2bo4b5o16bo232b$199b2ob2o3b4o250b$\n        201b2o4bo253b$222b3o236b$222bo238b$223bo237b$197b4o260b$197bo3bo13bo2b\n        o6b2o234b$197bo16bo8bo237b$198bo2bo12bo3bo3bo6b2o3b2o225b$214b4o4bo7bo\n        2bo227b$222b12ob2o224b$227b2o2b2ob3o224b$232bobo226b$233bo227b$223b2o\n        236b$222b2ob2o234b$223b4o234b$224b2o43b3o189b$206b2o61bo191b$205b4o61b\n        o190b$204b2ob2o252b$205b2o5b2ob3o243b$211bo5b2o242b$210b2o7bo241b$211b\n        o5b2o242b$205b2o5b2ob3o9b2o232b$190bo2bo5b2o3b2ob2o18bobo231b$189bo8b\n        4o3b4o18bo233b$189bo3bo3b2ob2o4b2o253b$189b4o5b2o30b5o226b$222b2o6bo4b\n        o225b$222bobo5bo230b$209bo12bo8bo3bo225b$193b2o13bo2bo21bo227b$191b2ob\n        2o11bo3bo249b$191bo2bo12bo3bo5b2o242b$191bo2bo12bo3bo5bobo241b$192b2o\n        9b2o3bobo6bo243b$203b2o4bo24bo226b$225b6obo3bo224b$190bo2bo31bo5bo3b3o\n        223b$189bo35bo5bo5bo223b$189bo3bo32bo3bo3b2obo223b$189b4o13b4o18bo5b3o\n        224b$206bo3bo16b2o232b$206bo19b4o231b$207bo2bo14b2ob2o231b$226b2o11b3o\n        219b$239bo221b$240bo220b$208b2o251b$207b2ob2o8bo240b$208b4o3bo4bobo\n        238b$209b2o3bo5bo2bo237b$213bo2bo6bo237b$209b2o3bo5bo2bo237b$208b4o3bo\n        4bobo238b$207b2ob2o8bo8b3o229b$192b4o5b2o5b2o19bo6bo224b$192bo3bo3b2ob\n        2o25bo3bo3bo222b$192bo8b4o28bo227b$193bo2bo5b2o29bo4bo222b$224b3o6b5o\n        223b$224bo236b$195b2o7bo20bo235b$194bobo3b2o7b5o247b$194bo18bo247b$\n        194b3o13b3o6b3o239b$205b2o4bo7bo241b$205b2o13bo240b3$192b4o265b$192bo\n        3bo13bo2bo247b$192bo16bo251b$193bo2bo12bo3bo247b$209b4o!",
    group: patternGroups.puffer
  },
  'gosper-glider-gun': {
    name: 'Планерное ружьё Госпера',
    code: "24bo11b$22bobo11b$12b2o6b2o12b2o$11bo3bo4b2o12b2o$2o8bo5bo3b2o14b$2o8b\n        o3bob2o4bobo11b$10bo5bo7bo11b$11bo3bo20b$12b2o!",
    group: patternGroups.gun
  },
  'simkin-glider-gun': {
    name: 'Планерное ружьё Симкина',
    code: "2o5b2o$2o5b2o2$4b2o$4b2o5$22b2ob2o$21bo5bo$21bo6bo2b2o$21b3o3bo3b2o$\n        26bo4$20b2o$20bo$21b3o$23bo!",
    group: patternGroups.gun
  },
  'ak-94': {
    name: 'AK-94',
    code: "7bo7bo7b2o$7b3o5b3o5b2o$10bo7bo$9b2o6b2o16b2o$30b2o2bo2bo$30bobo2b2o$\n        33b2o$5bo28bo$5b3o26bob2o$8bo22b2obo2bo$7b2o22b2ob2o3$17bo$2b2ob2o9bob\n        o10b2o$o2bob2o8bo3bo9bo$2obo11bo3bo10b3o$3bo11bo3bo12bo$3b2o11bobo$b2o\n        2bobo9bo$o2bo2b2o$b2o16b2o$19bo$13b2o5b3o$13b2o7bo!",
    group: patternGroups.gun
  },
  'slide-gun': {
    name: 'Скользящее ружьё',
    code: "56b2o51b$56b2o51b2$78bo30b$78bobo28b$81b2o6b2o18b$38b2o27b2o12b2o4bo3b\n        o17b$38b2o16b3o8b2o12b2o3bo5bo8b2o6b$78bobo4b2obo3bo8b2o6b$56bobo19bo\n        7bo5bo16b$55b5o27bo3bo17b$54b2o3b2o4b2o22b2o18b$54b2o3b2o3bo2bo11bo29b\n        $64bo12b2o30b$64bo13b2o29b$64bob2o41b$66b2o41b2$83b2o24b$59b2o4b2o15b\n        2o10bobo12b$59bo5b2o17bo8bo2bo12b$60b3o16b2o11b2o10b2o3b$62bo16bobo8b\n        2o3bo8b2o3b$74b2o6bo9b2o5b2o8b$73bo2bo2bo2bo10bo2bo4bo7b$73b3o6bo11bob\n        o12b$46b3o22b3o5bobo27b$48bo15bo5bobo6b2o28b$47bo14b2o6bo38b$63b2o4b2o\n        38b$55bo53b$35b2o17bobo52b$35bo18b2obo14b2o35b$24bo8bobo18b2ob2o14bo\n        35b$24b4o5b2o19b2obo15bobo10bo22b$8bo16b4o15b2o8bobo4b2o11b2o9b4o20b$\n        7bobo5b2o8bo2bo14bobo9bo5bobo7bo12b2ob4o5b2o11b$5b2o3bo14b4o14bo19bo6b\n        2o11b3ob2o3bo3bo2bo9b$2o3b2o3bo4bobob2o3b4o14b2o19b2o5bobo11b2ob2o3bo\n        7bo8b$2o3b2o3bo5b2o3bo2bo60b5o3bo6bo6b2o$7bobo10bo18b2o45bo3b3o7bo6b2o\n        $8bo8bo2bo10b3o4bobo27b2o26bo2bo9b$33bo3b3o28bo2bo24b2o11b$32bo4b2o70b\n        $40b2o26bo2bo12bo24b$27bo11b3o25bo2bo11b2o25b$28bo38bobo12b3o24b$28bo\n        39bo11b3o26b$24bo2bo11b2o39b2o27b$6bo5b2o9bo15b2o27b2o39b$4bo3bo3b3o\n        10bo42b2o16b2o9bo11b$8bo5b2obo11bo55b4o7bobo10b$3bo5bo4bo2bo10b2o50bob\n        o2bo2b3o5b2obo9b$3b2o9b2obo9b2o4b2o2b2o40bo2bo2b2o9b2ob2o3b2o3b$12b3o\n        11b3o4b2o2b2o31b2o6b2o9bo6b2obo4b2o3b$12b2o13b2o4b2o35b2o4b2o3bo8bo5bo\n        bo10b$28b2o48b2o10bo6bo11b$29bo49bo2bo26b$80bobo!",
    group: patternGroups.gun
  },
  block: {
    name: 'Блок, 1',
    code: "2o$2o!",
    group: patternGroups.oscillator
  },
  blinker: {
    name: 'Мигалка, 2',
    code: "3o!",
    group: patternGroups.oscillator
  },
  'figure-8': {
    name: 'Фигура 8, 8',
    code: "2o4b$2obo2b$4bob$bo4b$2bob2o$4b2o!",
    group: patternGroups.oscillator
  },
  '43P18': {
    name: '43P18, 18',
    code: "4bo$4obo$3obobo$5bobo$6bo$5b2o$5b2o3bo$5b2o2bobob2o$13b2o3$7bo2bo$7bo$\n        6bo4bo$5bobo2b2o$3b2obo3$3bo2bo$5b2o!",
    group: patternGroups.oscillator
  },
  beluchenko: {
    name: 'Осциллятор Белученко, 37',
    code: "11b2o11b2o11b$11b2o11b2o11b3$6bo23bo6b$5bobo5bo9bo5bobo5b$4bo2bo5bob2o\n        3b2obo5bo2bo4b$5b2o10bobo10b2o5b$15bobobobo15b$16bo3bo16b2$2o33b2o$2o\n        33b2o$5b2o23b2o5b2$6bobo19bobo6b$6bo2bo17bo2bo6b$7b2o19b2o7b2$7b2o19b\n        2o7b$6bo2bo17bo2bo6b$6bobo19bobo6b2$5b2o23b2o5b$2o33b2o$2o33b2o2$16bo\n        3bo16b$15bobobobo15b$5b2o10bobo10b2o5b$4bo2bo5bob2o3b2obo5bo2bo4b$5bob\n        o5bo9bo5bobo5b$6bo23bo6b3$11b2o11b2o11b$11b2o11b2o!",
    group: patternGroups.oscillator
  },
  '60P312': {
    name: '60P312, 312',
    code: "20b2o$20b2o4$9b2o$8bo2bo10b2o$9b2o11bo$22bo12bo$23bo10bobo$34bobo$35bo\n        7$32bo2bo$33b3o$2o38b2o$2o38b2o$6b3o$6bo2bo7$6bo$5bobo$5bobo10bo$6bo\n        12bo$19bo11b2o$18b2o10bo2bo$31b2o4$20b2o$20b2o!",
    group: patternGroups.oscillator
  }
};
var cache = {};

function getDataFromRLE(RLEString) {
  if (RLEString in cache) {
    return cache[RLEString];
  }

  var s = RLEString.replace(/\s|\n/g, '').split('!')[0];
  var rows = s.split('$');
  var result = [];
  var j = 0; // номер строки

  var maxI = 0;

  var _iterator = _createForOfIteratorHelper(rows),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var row = _step.value;
      var parts = row.match(/\d*[bo]/g);
      var i = 0; // номер столбца

      var _iterator2 = _createForOfIteratorHelper(parts),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var part = _step2.value;
          // 5bobo10bo -> 5, 1, 1, 1, 10, 1
          var l = part.length === 1 ? 1 : Number(part.slice(0, -1));

          if (part.endsWith('o')) {
            // живые клетки записываем явно
            var end = i + l;

            while (i < end) {
              result.push([j, i]);
              i++;
            }
          } else {
            // мёртвые пропускаем
            i += l;
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      if (i > maxI) {
        maxI = i;
      }

      var linesCount = row.match(/\d+$/);

      if (linesCount) {
        // пропускаем пустые строки
        j += Number(linesCount[0]);
      } else {
        j++;
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  var data = {
    array: result,
    width: maxI,
    height: j
  };
  cache[RLEString] = data;
  return data;
}

var gameTimeout;

var Game = _index.Component.Game(function (_ref) {
  var props = _ref.props,
      state = _ref.state,
      hooks = _ref.hooks;
  var _props$H = props.H,
      H = _props$H === void 0 ? 500 : _props$H,
      _props$W = props.W,
      W = _props$W === void 0 ? 1000 : _props$W;
  state.init({
    i: 0,
    size: 0,
    stop: true,
    H: H,
    W: W,
    paint: false,
    rule: {
      new: {
        2: true,
        3: true
      },
      old: {
        3: true
      }
    },
    custom: false,
    pattern: '3-engine-cordership-rake'
  });
  var canvas, img_data, data, ctx, fieldState, fieldStateNext;
  hooks.didMount(function () {
    var _state = state(),
        H = _state.H,
        W = _state.W,
        pattern = _state.pattern;

    if (gameTimeout) {
      window.clearTimeout(gameTimeout);
      gameTimeout = null;
    }

    fieldState = new Array(H * W);
    fieldStateNext = new Array(H * W);

    for (var i = 0; i < H * W; i++) {
      fieldState[i] = false;
      fieldStateNext[i] = false;
    }

    var startData = getDataFromRLE(patterns[pattern].code);
    set_life(startData.array, startData.height, startData.width);
    canvas = document.getElementById('field');
    ctx = canvas.getContext('2d', {
      alpha: false
    });
    img_data = ctx.getImageData(0, 0, W, H);
    data = img_data.data;

    for (var k = 0; k < H * W * 4; k++) {
      data[k] = (k + 1) % 4 == 0 ? 255 : 0;
    }

    draw();
    state.set({
      size: fieldState.reduce(function (sum, x) {
        return sum += x;
      })
    });
  });

  function paintControl() {
    var _state2 = state(),
        paint = _state2.paint;

    if (!paint) {
      canvas.onmousedown = null;
      canvas.onmouseup = null;
      canvas.onmouseout = null;
      canvas.onmousemove = null;
      return;
    }

    canvas.onmousedown = startDrawing;
    canvas.onmouseup = stopDrawing;
    canvas.onmouseout = stopDrawing;
    canvas.onmousemove = draw;
    var context = ctx;
    var isDrawing;
    context.strokeStyle = 'rgb(255,0,0)';
    context.lineWidth = 1;
    var pause = false;

    var _canvas$getBoundingCl = canvas.getBoundingClientRect(),
        x = _canvas$getBoundingCl.x,
        y = _canvas$getBoundingCl.y;

    function startDrawing(e) {
      // Начинаем рисовать
      isDrawing = true;

      if (!state().stop) {
        state.set({
          stop: true
        });
        pause = true;
      } // Создаем новый путь (с текущим цветом и толщиной линии)


      context.beginPath(); // Нажатием левой кнопки мыши помещаем "кисть" на холст

      context.moveTo(e.clientX - x, e.clientY - y);
    }

    function draw(e) {
      if (isDrawing == true) {
        // Определяем текущие координаты указателя мыши
        var xd = e.clientX - x;
        var yd = e.clientY - y; // Рисуем линию до новой координаты

        context.lineTo(xd, yd);
        context.stroke();
      }
    }

    function stopDrawing() {
      isDrawing = false;

      var _state3 = state(),
          W = _state3.W,
          H = _state3.H;

      img_data = ctx.getImageData(0, 0, W, H);
      data = img_data.data;

      for (var k = 0; k < H * W; k++) {
        fieldState[k] = data[k * 4] === 255;
      }

      if (pause) {
        state.set({
          stop: false,
          i: 0
        }, life);
        pause = false;
      }
    }
  }

  function torsum(i, j) {
    var _state4 = state(),
        H = _state4.H,
        W = _state4.W; // положение строки над текущей клеткой


    var i_top_W = (i ? i - 1 : H - 1) * W; // положение строки под текущей клеткой

    var i_down_W = (H - 1 - i ? i + 1 : 0) * W; // положение строки текущей клетки

    var i_W = i * W; // столбец слева от текущей клетки

    var j_l = j ? j - 1 : W - 1; // столбец справа от текущей клетки

    var j_r = W - 1 - j ? j + 1 : 0;
    return +fieldState[i_top_W + j_l] + fieldState[i_top_W + j] + fieldState[i_top_W + j_r] + fieldState[i_W + j_l] + fieldState[i_W + j_r] + fieldState[i_down_W + j_l] + fieldState[i_down_W + j] + fieldState[i_down_W + j_r];
  }

  function set_life(array, height, width) {
    var _state5 = state(),
        W = _state5.W,
        H = _state5.H;

    var getMiddle = function getMiddle(x) {
      return (x - x % 2) / 2;
    };

    var startX = getMiddle(W - (width || 0));
    var startY = getMiddle(H - (height || 0));

    var _iterator3 = _createForOfIteratorHelper(array),
        _step3;

    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var e = _step3.value;
        var index = (startY + e[0]) * W + startX + e[1];
        fieldState[index] = true;
        fieldStateNext[index] = true;
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }

    state.set({
      size: array.length
    });
  }

  function clear() {
    var _state6 = state(),
        W = _state6.W,
        H = _state6.H;

    for (var k = 0; k < H * W * 4; k++) {
      data[k] = (k + 1) % 4 === 0 ? 255 : 0;
    }

    for (var _k = 0; _k < H * W; _k++) {
      fieldState[_k] = data[_k * 4] === 255;
    }

    ctx.putImageData(img_data, 0, 0);
    state.set({
      stop: true,
      i: 0,
      size: 0
    });
  }

  function draw() {
    var _state7 = state(),
        H = _state7.H,
        W = _state7.W;

    for (var k = 0; k < H * W; k++) {
      if (+fieldState[k] !== !data[k * 4 + 1]) {
        data[k * 4] = fieldState[k] ? 255 : 0;
      }
    }

    ctx.putImageData(img_data, 0, 0);
  }

  function step() {
    var _state8 = state(),
        rule = _state8.rule,
        H = _state8.H,
        W = _state8.W;

    var i,
        j,
        k = 0;

    for (i = 0; i < H; i++) {
      for (j = 0; j < W; j++) {
        var sum = torsum(i, j);

        if (fieldState[k]) {
          fieldStateNext[k] = Boolean(rule.new[String(sum)]);
        } else {
          fieldStateNext[k] = Boolean(rule.old[String(sum)]);
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
    state.set(function (prevState) {
      return {
        i: prevState.i + 1
      };
    });
  }

  function life() {
    var _state9 = state(),
        stop = _state9.stop;

    if (!stop) {
      one_step();
      state.set({
        size: fieldState.reduce(function (sum, x) {
          return sum += x;
        })
      });
      gameTimeout = setTimeout(life, 0);
    } else if (gameTimeout) {
      window.clearTimeout(gameTimeout);
      gameTimeout = null;
    }
  }

  function onRuleChange(type, i, e) {
    var index = String(i);
    var prevStop;
    state.set(function (prev) {
      prevStop = prev.stop;
      return _objectSpread({}, prev, {
        stop: true,
        rule: _objectSpread({}, prev.rule, _defineProperty({}, type, _objectSpread({}, prev.rule[type], _defineProperty({}, index, !prev.rule[type][index]))))
      });
    }, function () {
      return state.set({
        stop: prevStop
      });
    });
  }

  function getRuleCaption(type) {
    var _state10 = state(),
        rule = _state10.rule;

    var result = [];

    for (var _i = 0, _Object$keys = Object.keys(rule[type]); _i < _Object$keys.length; _i++) {
      var key = _Object$keys[_i];

      if (rule[type][key]) {
        result.push(key);
      }
    }

    return result.join('');
  }

  return function () {
    var _state11 = state(),
        stop = _state11.stop,
        H = _state11.H,
        W = _state11.W,
        i = _state11.i,
        size = _state11.size,
        rule = _state11.rule,
        paint = _state11.paint,
        custom = _state11.custom,
        pattern = _state11.pattern;

    return _index.E.div(_index2.Breadcrumbs.items([['Проекты', 'projects'], ['Игра «Жизнь»']]), _index.E.div.class(b())(_index.E.div('Начальная конфигурация', _index.E.br, _index.E.sup('имеет смысл для классической версии, правила B3/S23'), _index.E.br, _index.E.div.style(_templateObject())(_index3.Select.onChange(function (e) {
      var value = e.target.value;
      state.set({
        pattern: value
      });
    }).values(Object.keys(patterns).map(function (patternKey) {
      return {
        value: patternKey,
        title: patterns[patternKey].name,
        group: patterns[patternKey].group,
        selected: state().pattern === patternKey
      };
    }))), _index3.Button.onClick(function () {
      var _state12 = state(),
          pattern = _state12.pattern;

      var data = getDataFromRLE(patterns[pattern].code);
      clear();
      set_life(data.array, data.height, data.width);
      draw();
    })('Установить'), _index.E.div(_index3.Checkbox.checked(custom).onClick(function () {
      return state.set(function (prev) {
        return {
          custom: !prev.custom
        };
      });
    })('код конфигурации'), _index.E.br, custom && _index.E.textarea.style(_templateObject2(), W, W, W)(patterns[state().pattern].code.replace(/\s|\n/g, '').split('!')[0]))), _index.E.div.class(b('actions'))(_index3.Button.onClick(function () {
      state.set(function (prevState) {
        return {
          stop: !prevState.stop
        };
      }, life);
    })(_index.E.div.title(stop ? 'play' : 'stop').style(_templateObject3())(stop ? _index4.Icon.Play : _index4.Icon.Pause)), _index3.Button.disabled(!stop).onClick(function () {
      return one_step();
    })(_index.E.div.title('single step')(_index.E.div.style(_templateObject4())(_index4.Icon.StepForward), _index.E.sup('1'))), _index3.Button.class(b('paint', {
      active: paint
    })).onClick(function () {
      state.set(function (prev) {
        return {
          paint: !prev.paint
        };
      }, paintControl);
    })(_index.E.div.title('paint').style(_templateObject5())(_index4.Icon.PencilAlt)), _index3.Button.onClick(function () {
      return clear();
    })(_index.E.div.title('clear').style(_templateObject6())(_index4.Icon.Ban)), _index.E.div.style(_templateObject7())(_index.E.div(_templateObject8()), _index.E.div(_index.E.b("".concat(i))), _index.E.div(_templateObject9()), _index.E.div(_index.E.b("".concat(size))))), _index.E.br, _index.E.canvas.id('field').width(W).height(H).class(b('canvas', {
      paint: paint
    })), _index.E.p("\u0422\u0435\u043A\u0443\u0449\u0435\u0435 \u043F\u0440\u0430\u0432\u0438\u043B\u043E: B".concat(getRuleCaption('old'), "/S").concat(getRuleCaption('new'))), _index.E.br, _index.E.div(_index.E.p('Зарождение жизни'), range(0, 8).map(function (i) {
      return _index3.Checkbox.checked(rule.old["".concat(i)]).onChange(onRuleChange.bind(_this, 'old', i))("".concat(i));
    })), _index.E.div(_index.E.p('Продление жизни'), range(0, 8).map(function (i) {
      return _index3.Checkbox.checked(rule.new["".concat(i)]).onChange(onRuleChange.bind(_this, 'new', i))("".concat(i));
    })), _index.E.br, _index.E.p(_templateObject10(), _index.E.a.href('https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life')('Игра Жизнь'), _index.E.a.href('https://www.conwaylife.com/wiki/Main_Page')('тематического вики-сайта'), _index.E.a.href('/?/blog/6')('блоге'))));
  };
});

var _default = Game;
exports.default = _default;
},{"../../utils/index.js":"utils/index.js","../index.js":"components/index.js","../../blocks/index.js":"blocks/index.js","../../icons/index.js":"icons/index.js","./GameOfLife.less":"components/GameOfLife/GameOfLife.less"}],"components/About/About.less":[function(require,module,exports) {
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
},{}],"components/App/App.less":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"node_modules/parcel-bundler/src/builtins/css-loader.js"}],"components/App/App.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _index = require("../../utils/index.js");

var _index2 = require("../index.js");

var _index3 = require("../../blocks/index.js");

var _index4 = require("../../icons/index.js");

var _MyComponent = _interopRequireDefault(require("../../MyComponent.js"));

var _map = _interopRequireDefault(require("../../map.js"));

var _book = require("../../utils/book.js");

require("./App.less");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var b = (0, _index.block)('app');

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
    //         E.li`Поправить движок`,
    //         E.li`Меню для мобильной версии`,
    //         E.li`Формат электронной книги`,
    //         E.li`Калькулятор`,
    //         E.li`Построитель графиков`,
    //         E.li`Схема метро(позже интерактивная)`
    //     )
    // ),
    'blog': _index2.Blog,
    'blog/:id': _index2.Post.id(params.id),
    'projects': _index2.Projects,
    'projects/unicode': _index2.Unicode,
    'projects/game-of-life': _index2.GameOfLife,
    'physics': _index2.Physics,
    'physics/standard-model': _index2.StandardModel
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
    var current = path().startsWith(href) || path() === '/' && href === 'blog'; // console.log(href, path());

    return _index.RouteLink.href(href)(_index.E.div.class(b('menu-link', {
      current: current
    }))(title));
  }

  return function () {
    return _index.E.div(renderLink('blog', 'Блог'), renderLink('about', 'Кто я?'), // renderLink('book', 'Книга'),
    renderLink('projects', 'Проекты'), renderLink('physics', 'Физика'), renderLink('design', 'Дизайн') // renderLink('gameOfLife', 'Игра Жизнь'),
    // renderLink('my/ok', 'тест')
    );
  };
});

var Header = _index.Component.Header(function (_ref2) {
  var state = _ref2.state,
      hooks = _ref2.hooks;
  state.init({
    theme: 'dark'
  });
  hooks.didMount(function () {
    var savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
      state.set({
        theme: savedTheme
      });
    }

    setTheme();
  });

  function setTheme() {
    var _state = state(),
        theme = _state.theme;

    localStorage.setItem('theme', theme);
    var classList = document.body.classList;

    if (theme === 'light') {
      classList.add('theme_light');
    } else {
      classList.remove('theme_light');
    }

    window.dispatchEvent(new CustomEvent('theme', {
      detail: {
        theme: theme
      }
    }));
  }

  function toogleTheme() {
    state.set(function (prevState) {
      return {
        theme: prevState.theme === 'dark' ? 'light' : 'dark'
      };
    }, function () {
      return setTheme();
    });
  }

  function getIcon() {
    var _state2 = state(),
        theme = _state2.theme;

    return {
      dark: function dark() {
        return _index.E.div.style('width: 1em; height: 1em;')(_index4.Icon.Moon);
      },
      light: function light() {
        return _index.E.div.style('width: 1em; height: 1em;')(_index4.Icon.Sun);
      }
    }[theme]();
  }

  return function () {
    return _index.E.header.class(b('header'))(_index.RouteLink.href('/')(_index.E.h1.style((0, _index.style)({
      textAlign: 'center'
    }))('Александр Николаичев')), _index3.Button.onClick(toogleTheme)(getIcon()));
  };
});

var Page = _index.E.div.class(b())( // E.div.class(b('header-menu'))(
//     E.div('Alexandr Nikolaichev'),
//     E.div.class(b('scroll-top')).onClick(() => window.scrollTo({top: 0}))('▲ ▲ ▲')
// ),
Header, _index.E.nav.class(b('menu'))(Menu), _index.E.main.class(b('content'))(_index.Switch.routes(routes)), _index.E.footer.class(b('footer'))('© 2019-2020 Alexandr Nikolaichev'));

var _default = Page;
exports.default = _default;
},{"../../utils/index.js":"utils/index.js","../index.js":"components/index.js","../../blocks/index.js":"blocks/index.js","../../icons/index.js":"icons/index.js","../../MyComponent.js":"MyComponent.js","../../map.js":"map.js","../../utils/book.js":"utils/book.js","./App.less":"components/App/App.less"}],"components/index.js":[function(require,module,exports) {
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
Object.defineProperty(exports, "Physics", {
  enumerable: true,
  get: function () {
    return _Physics.default;
  }
});
Object.defineProperty(exports, "StandardModel", {
  enumerable: true,
  get: function () {
    return _StandardModel.default;
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
Object.defineProperty(exports, "App", {
  enumerable: true,
  get: function () {
    return _App.default;
  }
});

var _Breadcrumbs = _interopRequireDefault(require("./Breadcrumbs/Breadcrumbs.js"));

var _Post = _interopRequireDefault(require("./Post/Post.js"));

var _Blog = _interopRequireDefault(require("./Blog/Blog.js"));

var _Physics = _interopRequireDefault(require("./Physics/Physics.js"));

var _StandardModel = _interopRequireDefault(require("./StandardModel/StandardModel.js"));

var _Projects = _interopRequireDefault(require("./Projects/Projects.js"));

var _Colors = _interopRequireDefault(require("./Colors/Colors.js"));

var _Unicode = _interopRequireDefault(require("./Unicode/Unicode.js"));

var _Design = _interopRequireDefault(require("./Design/Design.js"));

var _GameOfLife = _interopRequireDefault(require("./GameOfLife/GameOfLife.js"));

var _About = _interopRequireDefault(require("./About/About.js"));

var _App = _interopRequireDefault(require("./App/App.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./Breadcrumbs/Breadcrumbs.js":"components/Breadcrumbs/Breadcrumbs.js","./Post/Post.js":"components/Post/Post.js","./Blog/Blog.js":"components/Blog/Blog.js","./Physics/Physics.js":"components/Physics/Physics.js","./StandardModel/StandardModel.js":"components/StandardModel/StandardModel.js","./Projects/Projects.js":"components/Projects/Projects.js","./Colors/Colors.js":"components/Colors/Colors.js","./Unicode/Unicode.js":"components/Unicode/Unicode.js","./Design/Design.js":"components/Design/Design.js","./GameOfLife/GameOfLife.js":"components/GameOfLife/GameOfLife.js","./About/About.js":"components/About/About.js","./App/App.js":"components/App/App.js"}],"index.js":[function(require,module,exports) {
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

document.getElementById('root').append((0, _element.DOM)(_index.App));
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "59014" + '/');

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
//# sourceMappingURL=index.1.4.0.js.map