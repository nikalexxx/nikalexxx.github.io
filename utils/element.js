import {getClone} from './clone.js';

import {elementSymbol} from './symbols.js';

const getElement = namespace => new Proxy((strings, ...elements) => {
    const list = [strings[0]];
    for (let i = 1; i < strings.length; i++) {
        list.push(elements[i-1], strings[i]);
    }
    return list;
}, {
    get(target, tag) {
        const create = (tagName = 'div', props = {}, children = []) => {
            const element = document.createElementNS(namespace, tagName);
            element[elementSymbol] = {eventListeners: {}, props};
            // console.log(props);
            for (const prop in props) {
                if (prop.length > 2 && prop.slice(0, 2) === 'on') {
                    const eventName = prop[2].toLowerCase() + prop.slice(3);
                    const listener = props[prop];
                    element.addEventListener(eventName, listener, false);
                    if (eventName in element[elementSymbol].eventListeners) {
                        element[elementSymbol].eventListeners[eventName].push(listener);
                    } else {
                        element[elementSymbol].eventListeners[eventName] = [listener];
                    }
                } else {
                    element.setAttribute(prop, props[prop]);
                }
            }
            const prepare = node => {
                if (Array.isArray(node)) {
                    return node.map(e => prepare(e));
                } else if (typeof node === 'function') {
                    return prepare(node());
                } else {
                    return node;
                }
            }
            const nodes = [];
            for (let node of children.filter(e => e)) {
                node = prepare(node);
                if (Array.isArray(node)) {
                    nodes.push(...node);
                } else {
                    nodes.push(node);
                }
            }
            if (nodes.length) {
                element.append(...nodes.filter(e => e));
            }
            return element;
        }
        function stableElement(name, props) {
            return new Proxy((...children) => create(name, {}, children), {
                get(target, prop) {
                    return function (value) {
                        if (typeof prop === 'symbol' && prop.description === 'props') {
                            return stableElement(name, {...props, ...value});
                        }
                        return stableElement(name, {...props, [prop]: value});
                    }
                },
                apply(target, thisArg, argArray) {
                    return create(name, props, argArray);
                }
            })
        }
        return stableElement(tag, {})
    }
});

export const E = getElement('http://www.w3.org/1999/xhtml');
export const SVG = getElement('http://www.w3.org/2000/svg');
export const M = getElement('http://www.w3.org/1998/Math/MathML');
