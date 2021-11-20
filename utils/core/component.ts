// @-ts-nocheck
import { checkSubComponents, getNodes, getSubComponents } from './element';
import { componentSymbol } from './symbols';

import { getFlatNode } from './list';
import { diffElements, patchDOM } from './render';
import { isObject } from './type-helpers';
import { isElement } from './dom';
import { RawContainer, VDOMFragment, VDOMNode } from './vdom-model';
import { IsLatin } from './names';
import {
    Container,
    VDOMComponent,
    VDOMElement,
    Content,
    ComponentState,
    ComponentProps,
} from './vdom-model';
import { getChildren } from '.';

const getNewState =
    <S extends ComponentState>(state: S) =>
    (arg: S | ((s: S) => S)): S => {
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
    props: () => P & { children: RawContainer[] };
    state: (() => S) & {
        init: (initState: S) => void;
        set: (arg: S | ((s: S) => S), callback?: () => void) => void;
        onChange: (...names: (keyof S)[]) => boolean;
    };
    hooks: {
        didMount: (callback: () => void) => void;
    };
};

/** рендер функция, возвращается из каждого компонента */
type ComponentRender = () => RawContainer;

type MakeComponent<P, S> = (params?: ComponentParams<P, S>) => ComponentRender;

function getHandlers(): Handlers {
    let handlerIndex = 0;
    return new Proxy({} as Handlers, {
        get(target, name: keyof Handlers) {
            if (!(name in target)) {
                target[name] = {
                    count: 0,
                    indexes: [],
                } as unknown as HandlerData;
                target[name].bump = () => {
                    handlerIndex++;
                    target[name].count++;
                    target[name].indexes.push(handlerIndex);
                };
            }
            return target[name];
        },
    });
}

function getInitState<S>(
    componentName: string,
    state: S,
    handlers: Handlers,
    handlerErrors: HandlerErrors
) {
    return function initState(startState: S) {
        if (handlers.initState.count !== 0) {
            if (!handlerErrors.initState.count) {
                handlerErrors.initState.count = 1;
                const errorText = `${componentName}: Повторный вызов инициализации состояния`;
                console.error(new Error(errorText));
            }
        }
        handlers.initState.bump();
        state = startState;
    };
}

type StateClass<S> = {
    (): S;
    set: (
        newState: S | ((s: S) => S),
        callback?: (() => void) | undefined
    ) => void;
    init: (startState: S) => void;
    onChange: (...names: (keyof S)[]) => boolean;
};

function getStateClass<S>(
    componentName: string,
    handlers: Handlers,
    handlerErrors: HandlerErrors,
    rerender: () => void
): StateClass<S> {
    // состояние компонента
    let state: S = {} as S;

    // предыдущее состояние
    let prevState = {};

    const initState = getInitState(
        componentName,
        state,
        handlers,
        handlerErrors
    );

    let changedStateFields: Set<keyof S> = new Set();

    function setState(newState: S | ((s: S) => S), callback?: () => void) {
        prevState = state;
        const newStateObject = getNewState(state)(newState);
        changedStateFields = new Set(
            Object.keys(newStateObject) as (keyof S)[]
        );
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

    return stateClass;
}

const create = <P, S>(
    componentName: string,
    makeComponent: MakeComponent<P, S>,
    initialProps: P,
    children: RawContainer[] = []
) => {
    const handlerErrors = new Proxy({} as HandlerErrors, {
        get(target, name: keyof HandlerErrors) {
            if (!(name in target)) {
                target[name] = { count: 0 };
            }
            return target[name];
        },
    });

    // уникальный идентификатор для созданного компонента
    const componentNameSymbol = Symbol(componentName);

    // свойства компонента

    type PropsType = P & { children: RawContainer[] };
    const props: PropsType = { ...initialProps, children };

    // элемент DOM, который будет возвращён
    // TODO: инлайн компоненты, вложенные в одном узле, у списка это родитель
    // структура цепочки компонентов в элементе
    // [компонент, который возвращает массив] > [аналогично, только вложенный] > возвращает компонент > который возвращает этот элемент

    let element: VDOMFragment = { isFragment: true };

    // вызванные обработчики
    const handlers = getHandlers();

    // TODO: отслеживать вызовы и гарантировать порядок

    const didMount = (callback: () => void) => {
        function onDidMount(event: CustomEvent) {
            if (event.detail.componentNameSymbol === componentNameSymbol) {
                callback();
            }
        }

        handlers.didMount.bump();

        // FIXME: отписываться при размонтировании
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
            htmlElement && htmlElement.dom ? htmlElement.dom.ref ?? null : null;
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
                if (isElement(htmlNode) && htmlNode instanceof HTMLElement) {
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

    const stateClass = getStateClass<S>(
        componentName,
        handlers,
        handlerErrors,
        rerender
    );

    const render = makeComponent({
        props: () => props,
        state: stateClass,
        hooks: {
            didMount,
        },
    });

    // другие компоненты первого уровня вложенности, которые встречаются в дереве
    // их нужно отслеживать, чтобы сохранять их состояние
    const subComponents: Record<string, VDOMComponent> = {}; // мутабельный объект

    function rerender() {
        const renderResult = render();
        const nodes = getNodes(renderResult);

        const fragment: VDOMFragment = {
            isFragment: true,
            children: getChildren(nodes).children,
            subComponents: getSubComponents(componentName, nodes),
            dom: {},
        };

        // разбор дерева с учётом суб-компонентов
        const { existSubComponents, updateCallbacks } = checkSubComponents({
            node: fragment,
            subComponents,
        });

        const dom = element.dom!;
        const componentData = element.component;
        const diffElement = diffElements(element, fragment);

        // новые элементы создаются без привязки к странице

        // обновляем дерево
        element = fragment;
        // BUG: не сохраняется новый вид элемента

        // сохраняем данные комопнента
        element.component = componentData;

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

    // первый рендер
    element = checkSubComponents({
        node: getFlatNode(render()),
        subComponents,
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
    function setComponentData(element: Content, { array = false } = {}) {
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
            props: props.props,
            state,
            nameSymbol: componentNameSymbol,
        };
        element.component.currentLevel++;
    }

    const componentFunction: VDOMComponent = (() => element) as VDOMComponent;

    // такая функция имеет символьное свойство по символу componentSymbol
    componentFunction[componentSymbol] = {
        name: componentName,
        nameSymbol: componentNameSymbol,
        changeProps: (newProps: PropsType) => {
            props.props = newProps;
            rerender();
        },
        getProps: () => props.props,
    };

    return componentFunction;
};

const ComponentNameRegex = /^[A-Za-z][A-Za-z0-9-_]*$/;
type RT = <P, S extends Record<string, any>>(
    makeComponent: MakeComponent<P, S>
) => VDOMComponentBuilder<P>;
function componentConstructor<T extends string>(componentName: T) {
    if (!ComponentNameRegex.test(componentName)) {
        throw new Error(
            `Component name shold be match with ${ComponentNameRegex.source}`
        );
    }

    return function <P, S extends Record<string, any>>(
        makeComponent: MakeComponent<P, S>
    ) {
        function stableElement(props: Partial<P>) {
            const getComponent = ((...children: Content[]) =>
                create<P, S>(
                    componentName,
                    makeComponent,
                    {},
                    children
                )) as VDOMComponentBuilder<P>;
            return new Proxy(getComponent, {
                get<K extends keyof P>(
                    target: typeof getComponent,
                    prop: K & string
                ) {
                    return function (value: P[K]) {
                        return stableElement({
                            ...props,
                            [prop]: value,
                        });
                    };
                },
                apply(target, thisArg, argArray) {
                    return create<P, S>(
                        componentName,
                        makeComponent,
                        props,
                        argArray
                    );
                },
            });
        }
        return stableElement({});
    };
}

type VDOMComponentBuilder<P> = {
    [K in keyof P]: (
        value: P[K] | TemplateStringsArray
    ) => VDOMComponentBuilder<P>;
} & ((...children: RawContainer[]) => VDOMComponent<P>);

export const Component = new Proxy(
    {} as Record<
        string,
        <P = any, S = any>(
            builder: (params: ComponentParams<P, S>) => () => RawContainer
        ) => VDOMComponentBuilder<P>
    >,
    {
        get: function <T extends string>(target: any, componentName: T) {
            return componentConstructor(componentName);
        },
    }
);
