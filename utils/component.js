import {E, DOM, getNode, diffElements, patchDOM} from './element.js';
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

            // состояние компонента
            let state = {};

            // предыдущее состояние
            let prevState = {};

            // элемент DOM, который будет возвращён
            // TODO: инлайн компоненты, вложенные в одном узле, у списка это родитель
            // структура цепочки компонентов в элементе
            // [компонент, который возвращает массив] > [аналогично, только вложенный] > возвращает компонент > который возвращает этот элемент

            let element = {};

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

            let changedStateFields = {};

            function setState(newState, callback) {
                prevState = state;
                const newStateObject = typeof newState === 'function' ? newState(state) : newState;
                const change = {};
                for (const field of Object.keys(newStateObject)) {
                    change[field] = true;
                }
                changedStateFields = change;
                // console.log({changedStateFields});
                state = set(state)(newState);
                rerender();
                if (callback) {
                    callback();
                }
            }

            const changeState = (...names) => {
                for (const name of names) {
                    if (changedStateFields[name]) {
                        return true;
                    }
                }
                return false;
            }

            const stateClass = () => state;
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
                // element[elementSymbol].props.onDidMount = onDidMount;
                // element[elementSymbol].eventListeners.didMount = [onDidMount];
            }

            let firstAppend = true;

            const storage = {};
            const elements = [];

            const mo = new MutationObserver(function (mutations, observer) {
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
                        mo.disconnect();
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


            props.children = children;
            const render = makeComponent({
                props,
                state: stateClass,
                hooks: {
                    didMount
                }
            });

            function rerender() {
                // console.time('get node');
                const newElement = getNode(render());
                // console.timeEnd('get node');
                const dom = element.dom;
                const componentData = element.component;
                // console.time('diff');
                const diffElement = diffElements(element, newElement);
                // console.log({diffElement});
                // console.timeEnd('diff');

                // новые элементы создаются без привязки к странице

                element = newElement;
                // BUG: не сохраняется новый вид элемента
                element.component = componentData;
                // console.log('update:', componentName, {element, dom});

                if (dom) { // есть dom
                    // получить их diff, TODO: учитывая static
                    // console.log({dom, diffElement});
                    element.dom = dom;
                    // надо перепривязать к dom всех потомков
                    // console.time('patch DOM');
                    patchDOM(dom.ref, diffElement);
                    // console.timeEnd('patch DOM');
                }
            }

            element = getNode(render()); // первый рендер

            if (Array.isArray(element)) {
                for (const item of element) {
                    setComponentData(item, {array: true})
                }
            } else {
                setComponentData(element);
            }

            function setComponentData(element, {array = false} = {}) {
                if (!element.component) {
                    element.component = {level: 0};
                }
                const level = element.component.level;
                element.component[String(level)] = {
                    array,
                    name: componentName,
                    props,
                    state
                }
                element.component.level++;
            }

            // первое присоединение dom
            // if (!element.dom) {
                // element.dom = {};
            // }
            // const dom = DOM(element);
            // element.dom.ref = dom;
            // if (element.dom.parent) {
            //     element.dom.parent.append(dom);
            // }

            // console.log('render:', componentName, {element});
            return () => element;
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
