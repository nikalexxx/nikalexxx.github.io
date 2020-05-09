import {getClone} from './clone.js';

import {elementSymbol} from './symbols.js';

import {diff, isPrimitive, raw} from './diff.js';



const namespaceKeys = {
    'http://www.w3.org/1999/xhtml': 0,
    'http://www.w3.org/2000/svg': 1,
    'http://www.w3.org/1998/Math/MathML': 2
}

const namespaces = {
    '0': 'http://www.w3.org/1999/xhtml',
    '1': 'http://www.w3.org/2000/svg',
    '2': 'http://www.w3.org/1998/Math/MathML'
}


export function getNode(node) {
    if (Array.isArray(node)) {
        const result = [];
        for (const elem of node) {
            if (Array.isArray(elem)) {
                result.push(...getNode(elem));
            } else {
                result.push(getNode(elem));
            }
        }
        return result;
    } else if (typeof node === 'function') {
        return getNode(node());
    } else {
        return node;
    }
}

const strToArray = (strings, ...elements) => {
    const list = [strings[0]];
    for (let i = 1; i < strings.length; i++) {
        list.push(elements[i-1], strings[i]);
    }
    return list;
}

export const DOM = elementObject => {
    if (isPrimitive(elementObject)) {
        return document.createTextNode(elementObject);
    }
    const {namespace, tagName, props, children, eventListeners} = elementObject;
    const element = document.createElementNS(namespaces[String(namespace)], tagName);
    element[elementSymbol] = {};
    for (const prop in props) {
        if (prop.startsWith('_')) {
            element[elementSymbol][prop] = props[prop];
        } else {
            element.setAttribute(prop, String(props[prop]));
        }
    }
    for (const eventName of Object.keys(eventListeners)) {
        const listener = eventListeners[eventName];
        element.addEventListener(eventName, listener, false);
    }
    if (Object.keys(children).length) {
        element.append(...Object.values(children).map(e => {
            const dom = DOM(e);
            if (!isPrimitive(e)) {
                e.dom.parent = element;
            }
            return dom;
        }));
    }
    elementObject.dom = {ref: element};
    element[elementSymbol] = elementObject;
    return element;
}

export function patchDOM(dom, diffObject) {
    const upd = dom.parentNode;
    if (diffObject === diff.symbols.delete) {
        if (upd) {
            delete dom[elementSymbol];
            dom.remove();
            return;
        } else {
            return undefined;
        }
    }
    if (isPrimitive(diffObject)) {

        if (dom.nodeType === 3) { // текстовый узел
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
    const {props = {}, children = {}, eventListeners = {}, [diff.symbols.raw]: raw} = diffObject;
    if (raw) {
        if (upd) {
            const newDom = DOM(diffObject);
            dom.replaceWith(newDom);
            if (!diffObject[diff.symbols.new].dom) {
                diffObject[diff.symbols.new].dom = {};
            }
            diffObject[diff.symbols.new].dom.ref = newDom;

            return;
        } else {
            return DOM(diffObject);
        }
    }

    // обновление свойств
    for (const prop in props) {
        if (props[prop] === diff.symbols.delete) {
            if (prop.startsWith('_')) {
                delete dom[elementSymbol][prop];
            } else {
                dom.removeAttribute(prop);
            }
        } else {
            if (prop.startsWith('_')) {
                dom[elementSymbol][prop] = props[prop];
            } else {
                dom.setAttribute(prop, props[prop]);
            }
        }
    }

    // обновление перехватчиков событий
    for (const eventName of Object.keys(eventListeners)) {
        const listener = eventListeners[eventName];
        if (listener === diff.symbols.delete) {
            dom.removeEventListener(eventName, eventListeners[diff.symbols.meta].deleteListeners[eventName]);
            delete eventListeners[diff.symbols.meta].deleteListeners[eventName];
        } else {
            if (!listener[diff.symbols.raw]) {
                dom.removeEventListener(eventName, eventListeners[diff.symbols.meta].deleteListeners[eventName]);
                delete eventListeners[diff.symbols.meta].deleteListeners[eventName];
            }
            dom.addEventListener(eventName, listener, false);
        }
    }

    // обновление существующих потомков
    const list = Array.from(dom.childNodes);
    const updatedChildKeys = {};
    for (let i = 0; i < list.length; i++) {
        const child = list[i];
        const key = (child[elementSymbol] || {})._key || String(i);
        if (key in children) {
            if (children[key] === diff.symbols.delete) {
                dom.removeChild(child);
            } else {
                patchDOM(child, children[key]);
                updatedChildKeys[key] = true;
            }
        }
    }

    // добавление новых потомков
    const newChildren = [];
    for (const key in children) {
        if ((!children[key][diff.symbols.raw] && !isPrimitive(children[key])) || children[key] === diff.symbols.delete) {
            continue;
        }
        if (!(key in updatedChildKeys)) {
            newChildren.push(DOM(children[key]));
        }
    }
    if (newChildren.length > 0) {
        dom.append(...newChildren);
    }

    if (!diffObject[diff.symbols.new].dom) {
        diffObject[diff.symbols.new].dom = {};
    }
    diffObject[diff.symbols.new].dom.ref = dom;

    if (!upd) {
        return dom;
    }
}

const example = E => E.div.class`example`.id`ex`.style(style)['data-value']`1`(
    'string',
    E.span`text`,
    E.p('str'),
    E`text v = ${E.span(2)}`,
    [ // Fragment analog
        E.div.style`color: red;`,
        E.div.style`color: red;`('red'),
        E.div.style`color: red;``red`,
        E.div.style`color: red;``red ${E.span(1)}`, // red [Function]
        E.div.style`color: red;`(E`red${E.span(1)}`) // red 1
    ],
    ...[1,2,3].map(i => E.i._key(i)(i)),
    [1,2,3].map(i => E.i._key(i)(i))
)



const elementStructure = T => ({
    nodeType: T(Number),
    namespace: T(String),
    tagName: T(String),
    props: T`?`({
        [T(String)]: T(String)
    }),
    children: T`?`(Object)(T(elementStructure)),
    data: T(String)
});

const diffStructure = t => ({
    nodeType: t`?`(Number), // перезаписывает тип узла
    namespace: t`?`(String), // новое пространство имён
    tagName: t`?`(String), // новый тег
    props: t`?`({
        [t(String)]: [t(String), t(null)] // переписать свойство, добавить, если нет, если null - удалить
    }),
    children: t`?`(Object)(t(diffStructure)), // рекурсивно повторить для потомков, лишние удалить, недостающие добавить, в будущем сопоставлять по ключу
    data: t`?`(String), // поменять текстовый узел
    delete: t`?`(true) // удалить элемент
});

const diffFunctionStructure = t => t(Function)(({params}) =>
    t({
        params: {
            A: t(elementStructure), // старый элемент
            B: t(elementStructure) // новый элемент
        }
    })(t(diffStructure))
);

/*
Использовать хэши от пропсов и потомков
в случае тектсовых нод - от значений
можно вычислить уже на этапе создания элемента из кода
хэш используем в качестве ключа элемента
рассмотреть случай коллизий
*/
let i = 0;
export function diffElements(A, B) {
    // console.log({A, B});
    if (!B) {
        return diff.symbols.delete;
    }
    if (isPrimitive(A)) {
        if (isPrimitive(B)) {
            if (A !== B) {
                return raw(B);
            } else {
                return {};
            }
        } else {
            return raw(B);
        }
    }
    if (isPrimitive(B)) {
        return raw(B);
    }
    if (A.nodeType !== B.nodeType) {
        return raw(B);
    }
    if (A.namespace !== B.namespace) {
        return raw(B);
    }
    if (A.tagName !== B.tagName) {
        return raw(B);
    }
    if (B.props._forceUpdate) {
        return raw(B);
    }
    if ('_update' in B.props && !B.props._update) {
        return {};
    }
    // console.time('diff props');
    const diffProps = diff(A.props, B.props);
    // console.timeEnd('diff props');
    // console.time('diff events');
    const diffEventListeners = diff(A.eventListeners, B.eventListeners);
    for (const eventName of Object.keys(diffEventListeners)) {
        if (diffEventListeners[eventName] === diff.symbols.delete) {
            if (!diffEventListeners[diff.symbols.meta]) {
                diffEventListeners[diff.symbols.meta] = {deleteListeners: {}};
            }
            diffEventListeners[diff.symbols.meta].deleteListeners[eventName] = A.eventListeners[eventName];
        }
    }
    // console.timeEnd('diff events');
    // const kc = 'diff children' + i;
    // console.time(kc);

    const diffChildren = {};
    for (const key of Object.keys(B.children)) {
        if (!(key in A.children)) {
            diffChildren[key] = raw(B.children[key]); // новые ключи добавляем как есть
        }
    }
    for (const key of Object.keys(A.children)) {
        if (key in B.children) {
            i++;
            const k = 'children diff for key ' + key + i;
            // console.time(k);
            const diffItems = diffElements(A.children[key], B.children[key]); // сравниваем рекурсивно
            if (isPrimitive(diffItems) || diffItems === diff.symbols.delete || Object.keys(diffItems).length > 0) {
                diffChildren[key] = diffItems; // непустые добавляем
            }
            // console.timeEnd(k);
        } else {
            diffChildren[key] = diff.symbols.delete; // удаляем старые ключи
        }
    }
    // console.timeEnd(kc);
    // console.time('diff result');

    const result = {};
    if (Object.keys(diffProps).length > 0) {
        result.props = diffProps;
    }
    if (Object.keys(diffEventListeners).length > 0) {
        result.eventListeners = diffEventListeners;
    }
    if (Object.keys(diffChildren).length > 0) {
        result.children = diffChildren;
    }
    result[diff.symbols.new] = B;
    // console.timeEnd('diff result');

    return result;
}

function getProps(attributes) {
    if (!attributes) {
        return {};
    }
    const attrs = Array.from(attributes);
    const result = {};
    for (const {name, value} of attrs) {
        result[name] = value;
    }
    return result;
}

function getChildren(childNodes) {
    if (!childNodes) {
        return {};
    }
    const children = Array.from(childNodes);
    const result = {};
    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        const key = child.hasAttribute && child.hasAttribute('data-key') ? child.getAttribute('data-key') : String(i);
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
    }
}

// console.log(getElementFromDOM(document.head));
// console.log(getElementFromDOM(document.body));
// console.log(diffElements(getElementFromDOM(document.head), getElementFromDOM(document.body)));

const getElement = namespace => new Proxy(strToArray, {
    get(target, tag) {
        const create = (tagName = 'div', props = {}, children = []) => {
            const element = {
                namespace: namespaceKeys[namespace],
                tagName,
                props: {},
                children: {},
                eventListeners: {}
            };
            for (const prop in props) {
                if (prop.length > 2 && prop.startsWith('on') && prop[2] === prop[2].toUpperCase()) {
                    const eventName = prop[2].toLowerCase() + prop.slice(3);
                    const listener = props[prop];
                    if (typeof listener !== 'function') {
                        console.error(new Error(`${eventName} listener is not function`));
                        continue;
                    }
                    element.eventListeners[eventName] = listener;
                } else if (props[prop]) {
                    element.props[prop] = (props[prop]);
                }
            }
            const nodes = [];
            for (let node of children.filter(e => e)) {
                node = getNode(node);
                if (Array.isArray(node)) {
                    nodes.push(...node.filter(e => e));
                } else {
                    nodes.push(node);
                }
            }
            const dublicatedKeys = new Set();
            for (let i = 0; i < nodes.length; i++) {
                const node = nodes[i];
                const key = node.props && node.props._key && String(node.props._key);
                const index = String(i);
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
                console.error(new Error(`keys ${[...dublicatedKeys]} have been dublicated`));
            }
            return element;
        }
        function stableElement(name, props) {
            return new Proxy((...children) => {
                if (Array.isArray(children[0]) && 'raw' in children[0]) {
                    return create(name, props, strToArray(...children));
                }
                return create(name, props, children);
            }, {
                get(target, prop) {
                    return function (value, ...items) {
                        if (prop === '_props') {
                            return stableElement(name, {...props, ...value});
                        }
                        if (Array.isArray(value) && 'raw' in value) {
                            return stableElement(name, {...props, [prop]: strToArray(value, ...items).join('')});
                        }
                        return stableElement(name, {...props, [prop]: value});
                    }
                },
                apply(target, thisArg, argArray) {
                    if (Array.isArray(argArray[0]) && 'raw' in argArray[0]) {
                        return create(name, props, strToArray(...argArray));
                    }
                    return create(name, props, argArray);
                }
            })
        }
        return stableElement(tag, {})
    }
});

export const E = getElement('http://www.w3.org/1999/xhtml');
export const S = getElement('http://www.w3.org/2000/svg');
export const M = getElement('http://www.w3.org/1998/Math/MathML');

// console.log(E.div(2));
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

