const getElement = namespace => new Proxy({}, {
    get(target, tag) {
        const create = (tagName = 'div', props = {}, children = []) => {
            const element = document.createElementNS(namespace, tagName);
            for (const prop in props) {
                if (prop.length > 2
                    && prop.slice(0, 2) === 'on'
                    && (c => c === c.toUpperCase())(prop[2])) {
                    element.addEventListener(prop.slice(2).toLowerCase(), props[prop]);
                } else {
                    element.setAttribute(prop, props[prop]);
                }
            }
            const nodes = [];
            for (const node of children) {
                if (Array.isArray(node)) {
                    nodes.push(...node);
                } else if ((typeof node) === 'function') {
                    nodes.push(node());
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
