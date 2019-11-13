import {
    E
} from './element.js';
import {
    getChildren
} from './children.js';
import style from './style.js';

const set = state => arg => {
    let newObject;
    if (typeof arg === 'object') {
        newObject = arg;
    } else if (typeof arg === 'function') {
        newObject = arg(state);
    }
    return Object.assign({}, state, newObject);
}

function getProps(element) {
    if (element.nodeType === 3) { // textNode
        return {};
    }
    const props = {};
    for (let i = 0; i < element.attributes.length; i++) {
        const attr = element.attributes[i];
        props[attr.name] = attr.value;
    }
    return props;
}

function logger(f) {
    if (window.componentLogger) {
        if (typeof f === 'function') {
            f();
        } else {
            console.log(f);
        }
    }
}

function logAdd(element) {
    console.log('%c + ', style({
        color: 'green',
        backgroundColor: '#dfd'
    }), element);
}

function logRemove(element) {
    console.log('%c - ', style({
        color: 'red',
        backgroundColor: '#fdd'
    }), element);
}

function getElem(component) {
    if (Array.isArray(component)) {
        const fragment = document.createDocumentFragment();
        fragment.append(...component.map(e => getElem(e)));
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

    return function (makeComponent) {
        const create = (props = {}, children = []) => {
            // уникальный идентификатор для созданного элемента
            const componentSymbol = Symbol(componentName);

            function didMountEvent(element, source) {
                // console.group(`didMount[${source}]`);
                // console.log(element);
                // console.groupEnd();
                element.dispatchEvent(new CustomEvent('didMount', {
                    detail: {
                        componentSymbol
                    }
                }));
            }

            function willUnmountEvent(element, source) {
                // console.group(`willUnmount[${source}]`);
                // console.log(element);
                // console.groupEnd();
                element.dispatchEvent(new CustomEvent('willUnmount', {
                    detail: {
                        componentSymbol
                    }
                }));
            }

            // обновление DOM
            function update(element, newElement) {
                if (!element) {
                    throw new Error(`Element is ${element}`);
                }
                const parent = element.parentNode;
                element.remove();
                parent.append(newElement);
                return;
                const change = isTypeChanged(element, newElement);
                if (change) {
                    logger(() => console.group('replace'));
                    logger(() => logRemove(element));
                    if (newElement) {
                        logger(() => logAdd(newElement));
                        element.replaceWith(newElement);
                        if (newElement.dataset.component) {
                            didMountEvent(newElement, 'replace');
                        }
                    } else {
                        element.remove();
                    }
                    logger(() => console.groupEnd());
                } else {
                    changeChildren(element, newElement);
                    changeProps(element, newElement);
                }
            }

            function changeProps(element, newElement) {
                const elementProps = getProps(element);
                const newElementProps = getProps(newElement);
                const list = [...new Set([...Object.keys(elementProps), ...Object.keys(newElementProps)])];
                for (const prop of list) {
                    if (prop in elementProps) {
                        if (prop in newElementProps) {
                            if (elementProps[prop] !== newElementProps[prop]) {
                                element.setAttribute(prop, newElementProps[prop]); // изменение
                                if (prop === 'data-component') {
                                    willUnmountEvent(element, `change prop ${newElementProps[prop]}`);
                                    didMountEvent(element, `change prop ${newElementProps[prop]}`);
                                }
                            }
                        } else {
                            element.removeAttribute(prop); // удаление
                            if (prop === 'data-component') {
                                willUnmountEvent(element, `remove prop ${elementProps[prop]}`);
                            }
                        }
                    } else {
                        element.setAttribute(prop, newElementProps[prop]); // добавление
                        if (prop === 'data-component') {
                            didMountEvent(element, `add prop ${newElementProps[prop]}`);
                        }
                    }
                }
            }

            // рекурсивное обновление поддерева
            function changeChildren(element, newElement) {
                const elementChildLength = element.childNodes.length;
                const newElementChildLength = newElement.childNodes.length;
                const max = Math.max(elementChildLength, newElementChildLength);
                const min = Math.min(elementChildLength, newElementChildLength);
                const diff = elementChildLength - newElementChildLength;
                const newChildNodes = Array.from(newElement.childNodes);
                if (max > 0) {
                    for (let i = 0; i < min; i++) {
                        update(element.childNodes[i], newChildNodes[i]);
                    }
                    if (diff > 0) {
                        removeChildren(element, min, max);
                    } else {
                        addChildren(element, newChildNodes, min, max);
                    }
                } else if (element.nodeType === 3) {
                    element.replaceWith(newElement); // заменяем текстовые узлы
                    logger(() => {
                        logRemove(element);
                        logAdd(newElement);
                    });
                }
            }

            function removeChildren(element, start, end) {
                const list = [];
                for (let i = start; i < end; i++) {
                    list.push(element.childNodes[i]);
                }
                logger(() => console.group('remove'));
                for (const child of list) {
                    logger(() => logRemove(child));
                    element.removeChild(child);
                    if (element.dataset.component) {
                        willUnmountEvent(element, 'remove');
                    }
                }
                logger(() => console.groupEnd());
            }

            function addChildren(element, newChildNodes, min, max) {
                logger(() => console.group('add'));
                const list = [];
                for (let i = min; i < max; i++) {
                    const node = newChildNodes[i];
                    list.push(node);
                    if (node.dataset.component) {
                        didMountEvent(node, 'add');
                    }
                    logger(() => logAdd(node));
                }
                element.append(...list);
                logger(() => console.groupEnd());
            }

            // состояние компонента
            let state = {};

            // элемент DOM, который будет возвращён
            let element = E.div['data-component'](componentName)();

            // вызванные обработчики
            const handlers = [];

            function initState(startState) {
                state = startState;
                handlers.push('initState');
            }

            function setState(newState) {
                state = set(state)(newState);
                rerender();
            }
            const getState = () => state;

            element[componentSymbol] = true;

            const didMount = callback => {
                const didMountListener = element.addEventListener('didMount', event => {
                    // if (event.detail.componentSymbol === componentSymbol) {
                        logger(() => {
                            console.group('didMount -- event!!!');
                            console.log(element);
                            console.log(componentName);
                            console.log(event);
                            console.groupEnd();
                        });
                        callback(props, state);
                        // window.removeEventListener(didMountListener);
                    // }
                });
                handlers.push('didMount');
            }

            let firstAppend = true;

            const storage = {};
            const elements = [];

            const mo = new MutationObserver(function (mutations, observer) {
                // console.info('Observer');
                // console.log({mutations, observer});
                // console.log('didMount', firstAppend, componentName, element);
                // console.log(handlers);
                if (element && element.closest('html')) {
                    // element = false;
                    // const componentDOMSymbol = Symbol('componentDOMSymbol');
                    // if(!storage[componentDOMSymbol]) { // первый рендер
                    //     storage[componentDOMSymbol] = {first: true};
                    elements[Object.keys(elements).length] = {
                        first: true,
                        element: element.innerHTML
                    };
                    // console.log(elements);
                    // }
                    // if (storage[componentDOMSymbol].first) {
                    // console.log('есть', element);
                    // console.log({storage});
                    // storage[componentDOMSymbol].first = false;
                    if (firstAppend) {
                        element.dispatchEvent(new CustomEvent('didMount', {
                            detail: {
                                [componentSymbol]: true
                            }
                        }));
                        firstAppend = false;
                        // mo.disconnect();
                    }
                    // }
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


            const nodes = getChildren(children);
            props.children = nodes;
            const render = makeComponent({
                props,
                initState,
                getState,
                setState,
                didMount
            });

            function rerender() {
                update(element.firstChild, getElem(render(props, state)));
            }
            element.append(getElem(render(props, state)));
            return element;
        }

        function stableElement(props) {
            return new Proxy((...children) => create({}, children), {
                get(target, prop) {
                    return function (value) {
                        // console.log(`added prop ${prop} = ${value}`)
                        return stableElement({
                            ...props,
                            [prop]: value
                        });
                    }
                },
                apply(target, thisArg, argArray) {
                    return create(props, argArray);
                }
            })
        }
        return stableElement({});
    };
}

const Component = new Proxy({}, {
    get: function (target, componentName) {
        return componentConstructor(componentName)
    }
});

export default Component;
