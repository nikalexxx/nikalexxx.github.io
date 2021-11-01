import { VDOMComponent, VDOMElement, isComponent, Container } from './vdom-model';
import { isObject, isPrimitive, Primitive, setType } from './type-helpers';
import { componentSymbol, elementSymbol, subComponentSymbol } from './symbols';
import { namespaceNames } from './namespace';
import {
    diff,
    Diff,
    DiffByKeys,
    raw,
    rawSymbol,
    metaSymbol,
    deleteSymbol,
} from './diff';
import { isElement } from './dom';
import { getFlatNode } from './list';
import { emptySymbol, diffArray, diffObject } from './diff';

/*
Использовать хэши от пропсов и потомков
в случае тектсовых нод - от значений
можно вычислить уже на этапе создания элемента из кода
хэш используем в качестве ключа элемента
рассмотреть случай коллизий
*/
export function diffElements(
    A: Container,
    B: Container
): Diff<Container, Container> {
    if (!B) {
        return diff.symbols.delete;
    }
    if (isPrimitive(A)) {
        return diff(A, B);
    }

    if (isComponent(B)) {
        // B - компонент
        if (subComponentSymbol in B) {
            // субкомпоненты обновляются самостоятельно
            return diff.symbols.empty;
        }

        if (isComponent(A)) {
            // A - компонент
            if (A[componentSymbol].name === B[componentSymbol].name) {
                // сравниваем одинаковые компоненты
                // раскрываем функции в деревья
                return diffElements(
                    getNode(A, true, true),
                    getNode(B, true, true)
                );
            } else {
                // возвращаем новый компонент, он раскроется в patchDOM
                return raw(B);
            }
        }

        // компонент заменил дерево
        return raw(B);
    }
    if (isComponent(A)) {
        // B - дерево, заменило компонент A
        return raw(B);
    }
    if (isPrimitive(B)) {
        return raw(B);
    }

    if (Array.isArray(A)) {
        if (!Array.isArray(B)) {
            return raw(B);
        }
        return diffArray(A, B, diffElements);
    }

    if (Array.isArray(B)) {
        if (!Array.isArray(A)) {
            return raw(B);
        }
        return diffArray(A, B, diffElements);
    }

    // A и B компоненты
    if (A.nodeType !== B.nodeType) {
        return raw(B);
    }
    if (A.namespace !== B.namespace) {
        return raw(B);
    }
    if (A.tagName !== B.tagName) {
        return raw(B);
    }
    if (B.props?._forceUpdate) {
        return raw(B);
    }
    if (B.props && '_update' in B.props && !B.props._update) {
        return diff.symbols.empty;
    }
    const diffProps = diff(A.props, B.props);
    const diffEventListeners = diff(A.eventListeners, B.eventListeners);
    if (typeof diffEventListeners === 'object' && diffEventListeners !== null) {
        // for (const eventName of Object.keys(diffEventListeners)) {
        //     if (diffEventListeners[eventName] === diff.symbols.delete) {
        //         if (!diffEventListeners[diff.symbols.meta]) {
        //             diffEventListeners[diff.symbols.meta] = {
        //                 deleteListeners: {},
        //             };
        //         }
        //         diffEventListeners[diff.symbols.meta].deleteListeners[
        //             eventName
        //         ] = A.eventListeners[eventName];
        //     }
        // }
    }

    const diffChildren: Diff<Container, Container> = diffObject(
        A.children ?? {},
        B.children ?? {},
        diffElements as any
    );

    const result: { props?: Diff; eventListeners?: Diff; children?: Diff } = {};
    if (isObject(diffProps) && Object.keys(diffProps).length > 0) {
        result.props = diffProps;
    }

    if (isObject(diffEventListeners)) {
        result.eventListeners = diffEventListeners;
    }

    if (isObject(diffChildren)) {
        result.children = diffChildren;
    }
    // result[diff.symbols.new] = B;

    return result as any;
}

/**
 * Раскрывает функции компонентов
 */
export function getNode(
    node: Container,
    expand = false,
    expandSub = false
): Container {
    if (Array.isArray(node)) {
        // делаем массив плоским
        return getFlatNode(node).flatMap((e) => getNode(e, expand, expandSub));
    } else if (typeof node === 'function') {
        if (subComponentSymbol in node && !expandSub) {
            // суб-компоненты не раскрываем
            return node;
        }
        if (componentSymbol in node && !expand) {
            // компоненты не раскрываем, если не указано
            return node;
        } else {
            // вызываемые прокси раскрываем в дерево
            return getNode(node(), expand, expandSub);
        }
    } else {
        return node;
    }
}

type DiffElements = {
    props?: Diff;
    eventListeners?: Diff;
    children?: Diff;
    dom?: any;
};

export const DOM = (elementObject: Container): Element | Text => {
    if (isPrimitive(elementObject)) {
        return document.createTextNode(String(elementObject));
    }
    if (typeof elementObject === 'function') {
        if (subComponentSymbol in elementObject) {
            return DOM(getNode(elementObject, true, true));
        } else {
            return DOM(getNode(elementObject, true));
        }
    }
    setType<VDOMElement>(elementObject);
    const {
        namespace,
        tagName,
        props = {},
        children,
        eventListeners,
    } = elementObject;
    const element = document.createElementNS(
        namespaceNames[namespace],
        tagName
    );

    element[elementSymbol] = elementObject;

    // аттрибуты
    for (const prop of Object.keys(props)) {
        if (prop.startsWith('_')) {
            // element[elementSymbol]!.props![prop] = props[prop];
        } else {
            element.setAttribute(prop, String(props[prop]));
        }
    }

    // обработка событий
    if (eventListeners) {
        for (const eventName of Object.keys(eventListeners)) {
            const listener = eventListeners[eventName];
            element.addEventListener(eventName, listener, false);
        }
    }

    // содержимое элемента
    if (props && '_html' in props) {
        element.innerHTML = props._html;
    } else {
        if (children && Object.keys(children).length) {
            element.append(
                ...Object.values(children).map((e) => {
                    const dom = DOM(e);
                    if (!isPrimitive(e) && typeof e !== 'function') {
                        setType<VDOMElement>(e);
                        if (!e.dom) {
                            e.dom = {};
                        }
                        e.dom.parent = element;
                    }
                    return dom;
                })
            );
        }
    }
    elementObject.dom = { ref: element };
    element[elementSymbol] = elementObject;
    if ('_ref' in props) {
        props._ref!(element);
    }
    return element;
};

export function patchDOM(
    dom: Node,
    diffObject: Diff<VDOMElement | Primitive, VDOMElement | Primitive>
) {
    const parent = dom.parentNode;

    if (!parent) {
        if (isPrimitive(diffObject)) {
            return DOM(diffObject);
        }
        if (rawSymbol in diffObject) {
            setType<VDOMElement>(diffObject);
            return DOM(diffObject);
        }
        return dom;
    }

    if (diffObject === diff.symbols.empty) {
        return;
    }

    if (diffObject === diff.symbols.delete) {
        // слабые ссылки могли бы помочь

        // стираем информацию о vdom
        delete dom[elementSymbol];

        // удаляем узел
        parent.removeChild(dom);

        return;
    }

    if (isPrimitive(diffObject)) {
        const text = String(diffObject);
        // TODO: добавить другие типы
        if (dom.nodeType === Node.TEXT_NODE) {
            // текстовый узел
            if (dom.nodeValue !== text) {
                dom.nodeValue = text; // обновляем текст
            }
        } else {
            setType<Element>(dom);
            dom.replaceWith(document.createTextNode(text));
        }
        return;
    }

    if (rawSymbol in diffObject) {
        setType<VDOMElement>(diffObject);
        const newDom = DOM(diffObject);
        parent.replaceChild(newDom, dom);
        if (!diffObject.dom) {
            diffObject.dom = {};
        }
        diffObject.dom.ref = newDom;

        return;
    }

    setType<DiffByKeys<VDOMElement, VDOMElement>>(diffObject);

    const { props = {}, eventListeners = {} } = diffObject;
    type FullProps = Required<VDOMElement>['props'];
    type FullChildren = Required<VDOMElement>['children'];
    type FullEventListeners = Required<VDOMElement>['eventListeners'];

    setType<DiffByKeys<FullProps, FullProps>>(props);

    // обновление свойств
    if (isObject(props)) {
        for (const propName in props) {
            const prop = props[propName];
            const isCustomProp = propName.startsWith('_');
            if (prop === diff.symbols.empty) {
                continue;
            }

            if (prop === diff.symbols.delete) {
                if (isCustomProp) {
                    delete dom[elementSymbol]?.props?.[propName];
                } else {
                    if (isElement(dom)) {
                        dom.removeAttribute(propName);
                    }
                }
                continue;
            }

            if (typeof prop !== 'string') {
                continue;
            }

            if (isCustomProp) {
                continue;
            }
            if (isElement(dom)) {
                dom.setAttribute(propName, prop);
            }
        }
    }

    setType<
        DiffByKeys<FullEventListeners, FullEventListeners> & {
            [metaSymbol]: {
                deleteListeners: Record<string, (e: Event) => void>;
            };
        }
    >(eventListeners);

    // обновление перехватчиков событий
    for (const eventName of Object.keys(eventListeners)) {
        const listener = eventListeners[eventName];
        if (listener === diff.symbols.delete) {
            dom.removeEventListener(
                eventName,
                eventListeners[metaSymbol].deleteListeners[eventName]
            );
            delete eventListeners[diff.symbols.meta].deleteListeners[eventName];
            continue;
        }

        if (typeof listener !== 'function') {
            continue;
        }

        // зачем это условие?
        // if (!(rawSymbol in listener)) {
        //     dom.removeEventListener(
        //         eventName,
        //         eventListeners[diff.symbols.meta].deleteListeners[eventName]
        //     );
        //     delete eventListeners[diff.symbols.meta].deleteListeners[eventName];
        // }
        dom.addEventListener(eventName, listener, false);
    }

    const children = diffObject.children as DiffByKeys<
        FullChildren,
        FullChildren
    >;
    // setType<DiffByKeys<FullChildren, FullChildren>>(children);

    // обновление существующих потомков
    const list = Array.from(dom.childNodes);
    const updatedChildKeys: Set<string> = new Set();
    for (let i = 0; i < list.length; i++) {
        const child = list[i];
        const key = child[elementSymbol]?.props?._key ?? `${i}`;

        if (key in children) {
            const childDiff = children[key];
            if (childDiff === deleteSymbol) {
                dom.removeChild(child);
            } else {
                patchDOM(child, childDiff);
                updatedChildKeys.add(key);
            }
        }
    }

    // добавление новых потомков
    const newChildren = [];
    if (isObject(children)) {
        for (const key in children) {
            const child = children[key];
            if (child === emptySymbol) {
                continue;
            }
            if (
                (!isPrimitive(child) && !(rawSymbol in child)) ||
                child === deleteSymbol
            ) {
                continue;
            }

            if (!updatedChildKeys.has(key) && isObject(child) && rawSymbol in child) {
                newChildren.push(DOM(child as any));
            }
        }
    }
    if (newChildren.length > 0 && isElement(dom)) {
        dom.append(...newChildren);
    }

    if (rawSymbol in diffObject) {
        const diffObject1 = diffObject as VDOMElement;
        if (!diffObject1.dom) {
            diffObject1.dom = {};
        }
        diffObject1.dom.ref = dom;
    }

    if (!parent) {
        return dom;
    }
}
