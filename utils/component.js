import {DOM, E, checkSubComponents, diffElements, getFlatNode, getNode, patchDOM} from './element.js';
import {componentSymbol, elementSymbol} from './symbols.js';

import {log} from './logger.js';
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
    if (!componentName.match(/[A-Za-z][A-Za-z0-9-_]*/)) {
        throw new Error(`Component name shold be match with /[A-Za-z][A-Za-z0-9-_]*/`);
    }

    const handlerErrors = new Proxy({}, {
        get(target, name) {
            if (!(name in target)) {
                target[name] = {};
            }
            return target[name];
        }
    });

    return function (makeComponent) {
        const create = (initialProps = {}, children = []) => {
            // уникальный идентификатор для созданного элемента
            const componentNameSymbol = Symbol(componentName);

            // свойства компонента
            const propsStore = {};
            propsStore.props = initialProps;

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

            const stateClass = () => state; // перейти на прокси? тогда придумать название для остальных
            // сразу setState, initState
            // apply: state().set()
            // state[_].set() - _ Symbol
            // state`set`(), state`init`() !!! - хороший вариант
            // state[_.set]()
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
                    if (event.detail.componentNameSymbol === componentNameSymbol) {
                        callback();
                    }
                }

                handlers.didMount.bump();
                const didMountListener = window.addEventListener('didMount', onDidMount, false);
            }

            let firstAppend = true;

            const storage = {};
            const elements = [];

            const mo = new MutationObserver(function (mutations, observer) {
                if (element.dom && element.dom.ref.closest('html')) {
                    // element = false;
                    // const componentDOMSymbol = Symbol('componentDOMSymbol');
                    // if(!storage[componentDOMSymbol]) { // первый рендер
                    //     storage[componentDOMSymbol] = {first: true};
                    elements[Object.keys(elements).length] = {
                        first: true,
                        element: element.innerHTML
                    };
                    // }
                    if (firstAppend) {
                        window.dispatchEvent(new CustomEvent('didMount', {
                            detail: {
                                componentNameSymbol: componentNameSymbol
                            }
                        }));
                        firstAppend = false;
                        mo.disconnect();
                    }
                } else {
                    firstAppend = true;
                    mo.disconnect();
                }
            });
            mo.observe(document, {
                attributes: true,
                childList: true,
                subtree: true
            });


            propsStore.props.children = children;


            const render = makeComponent({
                props: () => propsStore.props,
                state: stateClass,
                hooks: {
                    didMount
                }
            });

            // другие компоненты первого уровня вложенности, которые встречаются в дереве
            // их нужно отслеживать, чтобы сохранять их состояние
            const subComponents = {}; // мутабельный объект
            const getSubComponents = () => subComponents;

            function rerender() {

                // разбор всех вложенных массивов в один плоский массив
                const newNode = getFlatNode(render());

                // разбор дерева с учётом суб-компонентов
                const {
                    existSubComponents,
                    updateCallbacks,
                    newElement
                } = checkSubComponents({
                    node: newNode,
                    subComponents: getSubComponents()
                });
                const dom = element.dom;
                const componentData = element.component;
                const diffElement = diffElements(element, newElement);

                // новые элементы создаются без привязки к странице

                // обновляем дерево
                element = newElement;
                // BUG: не сохраняется новый вид элемента

                // сохраняем данные комопнента
                element.component = componentData;

                if (dom) { // есть dom
                    // получить их diff, TODO: учитывая static

                    // сохраняем ссылку на dom
                    element.dom = dom;
                    // надо перепривязать к dom всех потомков

                    // меняется dom до субкомпонентов
                    patchDOM(dom.ref, diffElement);



                    // при наличии субкомпонентов
                    if (existSubComponents) {
                        for (const key in updateCallbacks) {
                            const update = updateCallbacks[key];
                            // обновляем дерево компонента, props меняем, state не трогаем
                            update();
                        }
                    }
                }
            }

            // первый рендер
            element = checkSubComponents({
                node: getFlatNode(render()),
                subComponents: getSubComponents()
            }).newElement;




            // отдельная функция разбирает дерево и выделяет субкомпоненты, возвращая колбеки для их обновления
            // diff для таких комопнентов не покажет изменения
            // сначала обновить элементы, потом субкомпоненты
            // в каждом из них та же схема
            // полное дерево вычисляется при вызове функции DOM / patchDOM


            // так как render может возвратить массив, дополнительная проверка на массив
            if (Array.isArray(element)) {
                for (const item of element) {
                    setComponentData(item, {array: true})
                }
            } else {
                setComponentData(element);
            }

            /* так как компоненты могут быть вложенными,
            одному элементу могут соответствовать несколько компонентов
            в поле component помечаем все уровни, добавляя на текущем уровне информацию о компоненте
            */
            function setComponentData(element, {array = false} = {}) {
                if (!element.component) {
                    element.component = {level: 0};
                }
                const level = element.component.level;
                element.component[String(level)] = {
                    array,
                    name: componentName,
                    props: propsStore.props,
                    state
                }
                element.component.level++;
            }

            const componentFunction = () => element;

            // такая функция имеет символьное свойство по символу componentSymbol
            componentFunction[componentSymbol] = {
                name: componentName,
                changeProps: newProps => {
                    propsStore.props = newProps;
                    rerender();
                },
                getProps: () => propsStore.props
            }

            return componentFunction;
        }

        function stableElement(props) {
            return new Proxy((...children) => create({}, children), {
                get(target, prop) {
                    return function (value) {
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
