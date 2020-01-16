import {E} from './element.js';
import {getClone} from './clone.js';
import {
    getChildren
} from './children.js';
import style from './style.js';
import {log} from './logger.js';
import {elementSymbol, componentSymbol} from './symbols.js';

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
    return (typeof component === 'function') ? component() : component;
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
    const handlerErrors = new Proxy({}, {
        get(target, name) {
            if (!(name in target)) {
                target[name] = {};
            }
            return target[name];
        }
    })

    return function (makeComponent) {
        const create = (props = {}, children = []) => {
            // уникальный идентификатор для созданного элемента
            const componentNameSymbol = Symbol(componentName);

            function didMountEvent(element, source) {
                // console.group(`didMount[${source}]`);
                // console.log(element);
                // console.groupEnd();
                window.dispatchEvent(new CustomEvent('didMount', {
                    detail: {
                        componentNameSymbol: element[componentSymbol].componentNameSymbol
                    }
                }));
            }

            function willUnmountEvent(element, source) {
                // console.group(`willUnmount[${source}]`);
                // console.log(element);
                // console.groupEnd();
                window.dispatchEvent(new CustomEvent('willUnmount', {
                    detail: {
                        componentNameSymbol: element[componentSymbol].componentNameSymbol
                    }
                }));
            }

            // обновление DOM
            function update(getElements) {
                const [element, newElement] = getElements();
                if (!element) {
                    throw new Error(`Element is ${element}`);
                }
                const newElementSource = newElement;
                const change = isTypeChanged(element, newElement);
                // console.log('update', {change, element, newElement});
                if (change) {
                    log.component(() => console.group('replace'));
                    log.component(() => logRemove(element));
                    if (newElement) {
                        log.component(() => logAdd(newElement));
                        if (componentSymbol in element) {
                            willUnmountEvent(element, 'replace');
                        }
                        // console.log({element, newElement});
                        if (componentSymbol in newElement) {
                            didMountEvent(newElement, 'replace');
                        }
                        delete element[elementSymbol];
                        delete element[componentSymbol];
                        element.replaceWith(newElement);
                    } else {
                        element.remove();
                    }
                    log.component(() => console.groupEnd());
                } else {
                    if (componentSymbol in newElement) {
                        // element[componentSymbol].element = element;
                        // console.log({data: newElement[componentSymbol], element});
                        newElement[componentSymbol].element = element;
                        element[componentSymbol] = newElement[componentSymbol];
                    }
                    // if (newElement.parentNode) {
                        // if (componentSymbol in newElement.parentNode) {
                    //         element.parentNode[componentSymbol] = newElement.parentNode[componentSymbol];
                    //         element.parentNode[componentSymbol].element = element.parentNode;
                            // newElement.parentNode[componentSymbol].element = element.parentNode;
                        // }
                    //     changeProps(element.parentNode, newElement.parentNode);
                    // }
                    changeProps(element, newElement);
                    changeChildren(element, newElement);

                }
            }

            function changeProps(element, newElement) {
                const elementProps = (element[elementSymbol] || {}).props || {};
                const newElementProps = (newElement[elementSymbol] || {}).props || {};
                const list = [...new Set([
                    ...Object.keys(elementProps),
                    ...Object.keys(newElementProps)
                ])];
                // console.log({element, newElement, elementProps: Object.keys(elementProps), newElementProps: Object.keys(newElementProps), list});
                log.component.props(() => {
                    const table = {};
                    for (const prop of list) {
                        if (elementProps[prop] !== newElementProps[prop]) {
                            const oldProp = elementProps[prop];
                            const newProp = newElementProps[prop];
                            table[prop] = {
                                oldProp,
                                newProp
                            };
                        }
                    }
                    if (Object.keys(table).length) {
                        console.table(table);
                    }
                });
                log.component.props(() => console.group('props'));
                for (const prop of list) {
                    if (prop in elementProps) {
                        if (prop in newElementProps) {
                            if (elementProps[prop] !== newElementProps[prop]) {
                                if (prop.slice(0, 2) === 'on') {
                                    const eventName = prop[2].toLowerCase() + prop.slice(3);
                                    element.removeEventListener(eventName, elementProps[prop], false);
                                    element.addEventListener(eventName, newElementProps[prop], false);
                                } else {
                                    element.setAttribute(prop, newElementProps[prop]); // изменение
                                }
                                element[elementSymbol].props[prop] = newElement[elementSymbol].props[prop];
                                log.component.props(() => console.group(prop));
                                log.component.props(() => {
                                    logRemove(elementProps[prop]);
                                    logAdd(newElementProps[prop]);
                                });
                                log.component.props(() => console.groupEnd());
                                if (prop === 'data-component') {
                                    willUnmountEvent(element, `change prop ${elementProps[prop]}`);
                                    didMountEvent(element[componentSymbol].element, `change prop ${newElementProps[prop]}`);
                                }
                            }
                        } else {
                            if (prop.slice(0, 2) === 'on') {
                                const eventName = prop[2].toLowerCase() + prop.slice(3);
                                element.removeEventListener(eventName, elementProps[prop], false);
                                log.component.props(`remove listener for ${eventName}`, elementProps[prop]);
                            } else {
                                element.removeAttribute(prop); // удаление
                            }
                            log.component.props(() => console.group(prop));
                            log.component.props(() => {
                                logRemove(elementProps[prop]);
                            });
                            log.component.props(() => console.groupEnd());
                            delete element[elementSymbol].props[prop];
                            if (prop === 'data-component') {
                                willUnmountEvent(element, `remove prop ${elementProps[prop]}`);
                            }
                        }
                    } else {
                        element[elementSymbol].props[prop] = newElement[elementSymbol].props[prop];
                        if (prop.slice(0, 2) === 'on') {
                            const eventName = prop[2].toLowerCase() + prop.slice(3);
                            element.addEventListener(eventName, newElementProps[prop], false);
                        } else {
                            element.setAttribute(prop, newElementProps[prop]); // добавление
                        }
                        log.component.props(() => console.group(prop));
                        log.component.props(() => {
                            logAdd(newElementProps[prop]);
                        });
                        log.component.props(() => console.groupEnd());
                        if (prop === 'data-component') {
                            didMountEvent(element[componentSymbol].element, `add prop ${newElementProps[prop]}`);
                        }
                    }
                }
                log.component.props(() => console.groupEnd());
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
                        update(() => [element.childNodes[i], newChildNodes[i]]);
                    }
                    if (diff > 0) {
                        removeChildren(element, min, max);
                    } else {
                        addChildren(element, newChildNodes, min, max);
                    }
                } else if (element.nodeType === 3) {
                    element.replaceWith(newElement); // заменяем текстовые узлы
                    log.component(() => {
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
                log.component(() => console.group('remove'));
                for (const child of list) {
                    log.component(() => logRemove(child));
                    element.removeChild(child);
                    if (element.dataset.component) {
                        willUnmountEvent(element, 'remove');
                    }
                }
                log.component(() => console.groupEnd());
            }

            function addChildren(element, newChildNodes, min, max) {
                log.component(() => console.group('add'));
                const list = [];
                for (let i = min; i < max; i++) {
                    const node = newChildNodes[i];
                    list.push(node);
                    if (node && (node.dataset||{}).component) {
                        didMountEvent(node, 'add');
                    }
                    log.component(() => logAdd(node));
                }
                element.append(...list);
                log.component(() => console.groupEnd());
            }

            // состояние компонента
            let state = {};

            // элемент DOM, который будет возвращён
            // TODO: инлайн компоненты, вложенные в одном узле, у списка это родитель
            const element = E.div['data-component'](componentName)();
            element[componentSymbol] = {
                componentName,
                componentNameSymbol,
                props,
                element
            };

            // вызванные обработчики
            let handlerIndex = 0;
            const handlers = new Proxy({}, {
                get(target, name) {
                    if (!(name in target)) {
                        target[name] = {
                            count: 0,
                            indexes: [],
                        };
                        target[name].bump = () => {
                            handlerIndex++;
                            target[name].count++;
                            target[name].indexes.push(handlerIndex);
                        }
                    }
                    return target[name];
                }
            });
            // TODO: отслеживать вызовы и гарантировать порядок

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

            function setState(newState) {
                state = set(state)(newState);
                rerender();
            }
            const getState = () => state;

            const stateClass = () => state;
            stateClass.set = setState;
            stateClass.init = initState;

            element[componentNameSymbol] = true;

            const didMount = callback => {
                function onDidMount(event) {
                    // console.log('DIDMOUNT', event);
                    if (event.detail.componentNameSymbol === componentNameSymbol) {
                        log.component(() => {
                            // console.group('didMount -- event!!!');
                            // console.log(element[componentSymbol].element);
                            // console.log(componentName);
                            // console.log(event);
                            // console.log(callback);
                            // console.groupEnd();
                        });
                        callback();
                        // window.removeEventListener(didMountListener);
                    }
                }

                handlers.didMount.bump();
                const didMountListener = window.addEventListener('didMount', onDidMount, false);
                element[elementSymbol].props.onDidMount = onDidMount;
                element[elementSymbol].eventListeners.didMount = [onDidMount];
            }

            let firstAppend = true;

            const storage = {};
            const elements = [];

            const mo = new MutationObserver(function (mutations, observer) {
                // console.info('Observer');
                // console.log({mutations, observer});
                // console.log('didMount', firstAppend, componentName, element);
                // console.log(handlers);
                if (element[componentSymbol].element.closest('html')) {
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
                        window.dispatchEvent(new CustomEvent('didMount', {
                            detail: {
                                componentNameSymbol: componentNameSymbol
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
                state: stateClass,
                didMount
            });

            const getRenderElem = function() {
                const elem = render();
                return getClone(getElem(elem));
            }
            function rerender() {
                const renderElem = getRenderElem();
                // console.log('rerender', componentName, element[componentSymbol].element.firstChild, renderElem);

                // console.log(componentName, {element, child: element[componentSymbol].element.firstChild, render: renderElem});
                // console.log(componentName, {elem: getRenderElem()});
                update(() => [element[componentSymbol].element.firstChild, renderElem]);
            }
            // element.append(E.p());
            // update(() => [element[componentSymbol].element.firstChild, getRenderElem()]);
            // console.log(componentName, {elem: getRenderElem()});
            element.append(getRenderElem());
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
