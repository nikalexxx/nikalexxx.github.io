// @-ts-nocheck
import { E, checkSubComponents } from './element';
import { componentSymbol, elementSymbol } from './symbols';

import { getFlatNode } from './list';
import { diffElements, patchDOM } from './render';
import { isObject } from './type-helpers';
import { isElement } from './dom';
import {
    Container,
    VDOMComponent,
    VDOMElement,
    Content,
    ComponentState,
    ComponentProps,
} from './vdom-model';

const getNewState = <S extends ComponentState>(state: S) => (
    arg: S | ((s: S) => S)
): S => {
    let newObject: S = {} as S;
    if (typeof arg === 'object') {
        newObject = arg;
    } else if (typeof arg === 'function') {
        newObject = arg(state);
    }
    return newObject;
};

// function getProps(element) {
//     if (element.nodeType === 3) {
//         // textNode
//         return {};
//     }
//     const props = {};
//     for (let i = 0; i < element.attributes.length; i++) {
//         const attr = element.attributes[i];
//         props[attr.name] = attr.value;
//     }
//     return props;
// }

// function logAdd(element: any) {
//     console.log(
//         '%c + ',
//         style({
//             color: 'green',
//             backgroundColor: '#dfd',
//         }),
//         element
//     );
// }

// function logRemove(element: any) {
//     console.log(
//         '%c - ',
//         style({
//             color: 'red',
//             backgroundColor: '#fdd',
//         }),
//         element
//     );
// }

// function getElem(component) {
//     if (Array.isArray(component)) {
//         const fragment = document.createDocumentFragment();
//         fragment.append(...component.map((e) => getElem(e)));
//         return fragment;
//     }
//     return typeof component === 'function' ? component() : component;
// }

// function isTypeChanged(element, newElement) {
//     if (element && !newElement) {
//         return true;
//     }
//     if (element.nodeType !== newElement.nodeType) {
//         return true;
//     }
//     if (element.nodeName !== newElement.nodeName) {
//         return true;
//     }
//     return false;
// }

type ErrorData = {
    count: number;
};

type HandlerErrors = {
    initState: ErrorData;
};

type HandlerData = {
    count: number;
    indexes: number[];
    bump(): void;
};

type Handlers = {
    didMount: HandlerData;
    initState: HandlerData;
};

type ComponentParams<P extends ComponentProps, S extends ComponentState> = {
    props: () => P & { children: Content[] };
    state: (() => S) & {
        init: (initState: S) => void;
        set: (arg: S | ((s: S) => S), callback?: () => void) => void;
        onChange: (...names: (keyof S)[]) => boolean;
    };
    hooks: {
        didMount: (callback: () => void) => void;
    };
};

type MakeComponent<P, S> = (
    params?: ComponentParams<P, S>
) => () => VDOMComponent;

const ComponentNameRegex = /^[A-Za-z][A-Za-z0-9-_]*$/;

type LatinLetter =
    | 'a'
    | 'b'
    | 'c'
    | 'd'
    | 'e'
    | 'f'
    | 'g'
    | 'h'
    | 'i'
    | 'j'
    | 'k'
    | 'l'
    | 'm'
    | 'n'
    | 'o'
    | 'p'
    | 'q'
    | 'r'
    | 's'
    | 't'
    | 'u'
    | 'v'
    | 'w'
    | 'x'
    | 'y'
    | 'z';

type AnyLetter = LatinLetter | Capitalize<LatinLetter>;
type AnyLetter2 = `${AnyLetter}${AnyLetter}`;
// type AnyLetter4 = `${AnyLetter2}${AnyLetter2}`;

function componentConstructor(componentName: string) {
    if (!ComponentNameRegex.test(componentName)) {
        throw new Error(
            `Component name shold be match with ${ComponentNameRegex.source}`
        );
    }

    const handlerErrors = new Proxy({} as HandlerErrors, {
        get(target, name: keyof HandlerErrors) {
            if (!(name in target)) {
                target[name] = { count: 0 };
            }
            return target[name];
        },
    });

    return function <P, S extends Record<string, any>>(
        makeComponent: MakeComponent<P, S>
    ) {
        const create = (
            initialProps: Partial<P> = {},
            children: Content[] = []
        ) => {
            // уникальный идентификатор для созданного элемента
            const componentNameSymbol = Symbol(componentName);

            // свойства компонента

            type PropsType = P & { children: Content[] };
            const propsStore: { props: PropsType } = {
                props: { ...initialProps, children } as PropsType,
            };

            // состояние компонента
            let state: S = {} as S;

            // предыдущее состояние
            let prevState = {};

            // элемент DOM, который будет возвращён
            // TODO: инлайн компоненты, вложенные в одном узле, у списка это родитель
            // структура цепочки компонентов в элементе
            // [компонент, который возвращает массив] > [аналогично, только вложенный] > возвращает компонент > который возвращает этот элемент

            let element: Container = null;

            // вызванные обработчики
            let handlerIndex = 0;
            const handlers = new Proxy({} as Handlers, {
                get(target, name: keyof Handlers) {
                    if (!(name in target)) {
                        target[name] = {
                            count: 0,
                            indexes: [],
                        } as any;
                        target[name].bump = () => {
                            handlerIndex++;
                            target[name].count++;
                            target[name].indexes.push(handlerIndex);
                        };
                    }
                    return target[name];
                },
            });

            // TODO: отслеживать вызовы и гарантировать порядок

            function initState(startState: S) {
                if (handlers.initState.count !== 0) {
                    if (!handlerErrors.initState.count) {
                        handlerErrors.initState.count = 1;
                        console.error(
                            new Error('Повторный вызов инициализации состояния')
                        );
                    }
                }
                handlers.initState.bump();
                state = startState;
            }

            let changedStateFields: Set<keyof S> = new Set();

            function setState(
                newState: S | ((s: S) => S),
                callback?: () => void
            ) {
                prevState = state;
                const newStateObject = getNewState(state)(newState);
                changedStateFields = new Set(Object.keys(newStateObject));
                state = { ...state, ...newStateObject };
                rerender();
                if (callback) {
                    callback();
                }
            }

            const changeState = (...names: (keyof S)[]) => {
                for (const name of names) {
                    if (changedStateFields.has(name)) {
                        return true;
                    }
                }
                return false;
            };

            const stateClass = () => state;
            // перейти на прокси? тогда придумать название для остальных
            // сразу setState, initState
            // apply: state().set()
            // state[_].set() - _ Symbol
            // state`set`(), state`init`() !!! - хороший вариант
            // state[_.set]()
            stateClass.set = setState;
            stateClass.init = initState;
            stateClass.onChange = changeState;
            // позволит писать _update(state.onChange('name', 'age'))
            // в перспективе что-то вроде _related(['name', 'age'])
            // идея - писать в метаинформации объектов state данные о своём state - имя, компонент и т.д.
            // тогда при обновлении мы посмотрим, и если поля из state.set не имеют отношения к полям, от котрых зависит обновление, то элемент не обновляется
            // более общий вопрос, как отследить зависимость от некоторого значения из состояния?

            // можно связать свойство элемента со значением свойства, если передавать не само значение, а функцию, что передаёт значение. То есть не Person.age(state.age+1) а Person.age(() => state.age+1). До вызова функции мы посмотрим мету у элемента, а при вызове у значения. Но так будет не так удобно писать, поэтому это может сделать препроцессор? нежелательно!!! к тожу же если передавать просто функцию, профит исчезнет. Не пойдёт!
            // в общем случае задача почти неразрешима
            // можно проксировать хоть насквозь, но передай в другую функцию и ничего не выйдет
            // опять же можно немного подхачить и использовать препроцессор для отслеживания явного применения, он должен быть достаточно умным, чтобы отслеживать зависимости применения переменных;
            // но можно сделать зависимость от ввода или слуйность и препроцессор такое не поймает

            const didMount = (callback: () => void) => {
                function onDidMount(event: CustomEvent) {
                    if (
                        event.detail.componentNameSymbol === componentNameSymbol
                    ) {
                        callback();
                    }
                }

                handlers.didMount.bump();

                const didMountListener = window.addEventListener(
                    'didMount',
                    onDidMount,
                    false
                );
            };

            let firstAppend = true;

            const storage = {};
            const elements: { first: boolean; element: string }[] = [];

            const mo = new MutationObserver(function (mutations, observer) {
                const htmlElement =
                    isObject(element) && 'dom' in element ? element : null;
                const htmlNode =
                    htmlElement && htmlElement.dom
                        ? htmlElement.dom.ref ?? null
                        : null;
                if (htmlElement && htmlNode) {
                    // element = false;
                    // const componentDOMSymbol = Symbol('componentDOMSymbol');
                    // if(!storage[componentDOMSymbol]) { // первый рендер
                    //     storage[componentDOMSymbol] = {first: true};
                    elements.push({
                        first: true,
                        element: isElement(htmlNode)
                            ? htmlNode.innerHTML
                            : htmlNode.nodeValue ?? '',
                    });
                    // }
                    if (firstAppend) {
                        if (
                            isElement(htmlNode) &&
                            htmlNode instanceof HTMLElement
                        ) {
                            htmlNode.dataset['component'] = componentName;
                        }
                        window.dispatchEvent(
                            new CustomEvent('didMount', {
                                detail: {
                                    componentNameSymbol: componentNameSymbol,
                                },
                            })
                        );
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
                subtree: true,
            });

            propsStore.props.children = children;

            const render = makeComponent({
                props: () => propsStore.props,
                state: stateClass,
                hooks: {
                    didMount,
                },
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
                    newElement,
                } = checkSubComponents({
                    node: newNode,
                    subComponents: getSubComponents(),
                });

                // FIXME:
                if (!isObject(element)) {
                    return;
                }
                // if(Array.isArray(element)) {
                //     return;
                // }

                if (!('dom' in element)) {
                    return;
                }

                const dom = element.dom;
                const componentData = element.component;
                const diffElement = diffElements(element, newElement);

                // новые элементы создаются без привязки к странице

                // обновляем дерево
                element = newElement;
                // BUG: не сохраняется новый вид элемента

                // FIXME:
                if (!isObject(element)) {
                    return;
                }
                // if(Array.isArray(element)) {
                //     return;
                // }

                if (!('dom' in element)) {
                    return;
                }

                // сохраняем данные комопнента
                element.component = componentData;

                if (dom) {
                    // есть dom
                    // получить их diff, TODO: учитывая static

                    // сохраняем ссылку на dom
                    element.dom = dom;
                    // надо перепривязать к dom всех потомков

                    // меняется dom до субкомпонентов
                    if (dom.ref) {
                        patchDOM(dom.ref, diffElement);
                    }

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
                subComponents: getSubComponents(),
            }).newElement;

            // отдельная функция разбирает дерево и выделяет субкомпоненты, возвращая колбеки для их обновления
            // diff для таких комопнентов не покажет изменения
            // сначала обновить элементы, потом субкомпоненты
            // в каждом из них та же схема
            // полное дерево вычисляется при вызове функции DOM / patchDOM

            // так как render может возвратить массив, дополнительная проверка на массив
            if (Array.isArray(element)) {
                for (const item of getFlatNode(element)) {
                    setComponentData(item, { array: true });
                }
            } else {
                setComponentData(element);
            }

            /* так как компоненты могут быть вложенными,
            одному элементу могут соответствовать несколько компонентов
            в поле component помечаем все уровни, добавляя на текущем уровне информацию о компоненте
            */
            function setComponentData(
                element: Content,
                { array = false } = {}
            ) {
                // FIXME:
                if (!isObject(element)) {
                    return;
                }
                if (!('dom' in element)) {
                    return;
                }
                if (!element.component) {
                    element.component = { currentLevel: 0, levels: {} };
                }
                componentNameSymbol;
                const level = element.component.currentLevel;
                element.component.levels[String(level)] = {
                    array,
                    name: componentName,
                    props: propsStore.props,
                    state,
                    nameSymbol: componentNameSymbol,
                };
                element.component.currentLevel++;
            }

            const componentFunction: VDOMComponent = (() =>
                element) as VDOMComponent;

            // такая функция имеет символьное свойство по символу componentSymbol
            componentFunction[componentSymbol] = {
                name: componentName,
                nameSymbol: componentNameSymbol,
                changeProps: (newProps: PropsType) => {
                    propsStore.props = newProps;
                    rerender();
                },
                getProps: () => propsStore.props,
            };

            return componentFunction;
        };

        function stableElement(props: Partial<P>) {
            const getComponent = (...children: Content[]) =>
                create({}, children);
            return new Proxy(getComponent, {
                get<K extends keyof P>(target: typeof getComponent, prop: K) {
                    return function (value: P[K]) {
                        return stableElement({
                            ...props,
                            [prop]: value,
                        });
                    };
                },
                apply(target, thisArg, argArray) {
                    return create(props, argArray);
                },
            });
        }
        return stableElement({});
    };
}

export const Component = new Proxy(
    {} as Record<
        string,
        <P, S>(
            builder: (params: ComponentParams<P, S>) => () => Container
        ) => VDOMComponent<P>
    >,
    {
        get: function (target, componentName: string) {
            return componentConstructor(componentName);
        },
    }
);

const s = Component.ssss(() => () => 1);
