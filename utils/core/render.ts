import {
    VDOMComponent,
    VDOMElement,
    isComponent,
    Container,
    Content,
    isVDOMElement,
    RawContainer,
} from './vdom-model';
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
    arraySymbol,
} from './diff';
import { isElement } from './dom';
import { getFlatNode } from './list';
import { emptySymbol, diffArray, diffObject, isDiffRaw } from './diff';
import { E } from './element';

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

        if (!isComponent(A)) {
            // компонент заменил дерево
            return raw(B);
        }

        // A - компонент
        if (A[componentSymbol].nameSymbol !== B[componentSymbol].nameSymbol) {
            // возвращаем новый компонент, он раскроется в patchDOM
            return raw(B);
        }

        // сравниваем одинаковые компоненты
        // раскрываем функции в деревья
        return diffElements(getNode(A, true, true), getNode(B, true, true));
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

    // A и B элементы
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

    if (B.props?._update === false) {
        // явное запрещение обновления
        return diff.symbols.empty;
    }

    const diffProps = diff(A.props ?? {}, B.props ?? {});

    const diffEventListeners = diff(
        A.eventListeners ?? {},
        B.eventListeners ?? {}
    );
    if (typeof diffEventListeners === 'object' && diffEventListeners !== null) {
        // здесь сохранялись старые обработчики событий для последующего удаления,
        // но мы и так можем узнать их на месте
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

    const diffChildren: Diff<
        VDOMElement['children'],
        VDOMElement['children']
    > = diffObject(A.children ?? {}, B.children ?? {}, diffElements as any);

    const fDiff: DiffByKeys<VDOMElement, VDOMElement> = {
        props: diffProps,
        eventListeners: diffEventListeners,
        children: diffChildren,
        tagName: emptySymbol,
        namespace: emptySymbol,
        nodeType: emptySymbol,
        [elementSymbol]: emptySymbol,
    };

    return fDiff;
}

/**
 * Раскрывает функции компонентов
 */
export function getNode(
    node: RawContainer,
    expand = false,
    expandSub = false
): Container {
    if (Array.isArray(node)) {
        // делаем массив плоским
        return getFlatNode(node).flatMap((e) => getNode(e, expand, expandSub));
    }

    if (!isComponent(node)) {
        // элементы возвращаем как есть
        return typeof node === 'function' ? node() : node;
    }

    if (subComponentSymbol in node && !expandSub) {
        // суб-компоненты не раскрываем
        return node;
    }

    if (!expand) {
        // компоненты не раскрываем, если не указано
        return node;
    }

    // вызываемые прокси раскрываем в дерево
    return getNode(node(), expand, expandSub);
}

/** Создание dom из элементов */
export const DOM = (elementObject: RawContainer): Element | Text | DocumentFragment => {
    if (isPrimitive(elementObject)) {
        return document.createTextNode(String(elementObject));
    }

    if (isComponent(elementObject)) {
        if (subComponentSymbol in elementObject) {
            return DOM(getNode(elementObject, true, true));
        }
        return DOM(getNode(elementObject, true));
    }

    if (Array.isArray(elementObject)) {
        if (elementObject.length === 1) {
            return DOM(elementObject[0]);
        }
        const fragment = document.createDocumentFragment();
        for (const item of elementObject) {
            fragment.appendChild(DOM(item));
        }
        return fragment;
    }

    if (typeof elementObject === 'function') {
        return DOM(elementObject());
    }

    const {
        namespace,
        tagName,
        props = {},
        children = {},
        eventListeners = {},
    } = elementObject;

    console.log({ elementObject });
    const domElement = document.createElementNS(
        namespaceNames[namespace],
        tagName
    );

    domElement[elementSymbol] = elementObject;

    // аттрибуты
    for (const prop of Object.keys(props)) {
        if (!prop.startsWith('_')) {
            domElement.setAttribute(prop, String(props[prop]));
        }
    }

    // обработка событий
    for (const eventName of Object.keys(eventListeners)) {
        domElement.addEventListener(
            eventName,
            eventListeners[eventName],
            false
        );
    }

    // содержимое элемента
    if ('_html' in props) {
        domElement.innerHTML = props._html;
    } else if (Object.keys(children).length > 0) {
        const childList = Object.values(children).map((child) => {
            const dom = DOM(child);
            if (!isPrimitive(child) && !isComponent(child)) {
                if (!child.dom) {
                    child.dom = {};
                }
                child.dom.parent = domElement;
            }
            return dom;
        });
        domElement.append(...childList);
    }

    // связь вирутального dom с реальным
    if (!elementObject.dom) {
        elementObject.dom = {};
    }
    elementObject.dom.ref = domElement;

    domElement[elementSymbol] = elementObject;

    // вызов функции для привязки к странице
    if ('_ref' in props) {
        props._ref!(domElement);
    }

    return domElement;
};

/** Точечное изменение dom по diff */
export function patchDOM(dom: Node, diffObject: Diff<Container, Container>) {
    const parent = dom.parentNode;

    if (!parent) {
        if (isPrimitive(diffObject)) {
            return DOM(diffObject);
        }
        if (rawSymbol in diffObject) {
            setType<Container>(diffObject);
            return DOM(diffObject);
        }
        return dom;
    }

    if (diffObject === emptySymbol) {
        return;
    }

    if (diffObject === deleteSymbol) {
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
        } else if (isElement(dom)) {
            parent.replaceChild(document.createTextNode(text), dom);
        }
        return;
    }

    if (rawSymbol in diffObject) {
        setType<Container>(diffObject);

        const newDom = DOM(diffObject);
        parent.replaceChild(newDom, dom);

        if (isVDOMElement(diffObject)) {
            if (!diffObject.dom) {
                diffObject.dom = {};
            }
            diffObject.dom.ref = newDom;
        }

        return;
    }

    if (arraySymbol in diffObject) {
        return;
    }

    setType<DiffByKeys<VDOMElement, VDOMElement>>(diffObject);

    const { props = {}, eventListeners: diffEventListeners = {} } = diffObject;
    type FullProps = Required<VDOMElement>['props'];
    type FullChildren = Required<VDOMElement>['children'];
    type FullEventListeners = Required<VDOMElement>['eventListeners'];

    setType<DiffByKeys<FullProps, FullProps>>(props);

    // обновление свойств
    if (isObject(props)) {
        for (const propName in props) {
            const prop = props[propName];

            if (prop === diff.symbols.empty) {
                continue;
            }

            const isCustomProp = propName.startsWith('_');

            if (prop === diff.symbols.delete) {
                if (isCustomProp) {
                    delete dom[elementSymbol]?.props?.[propName];
                    continue;
                }
                if (isElement(dom)) {
                    dom.removeAttribute(propName);
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

    const eventListeners = diffEventListeners as DiffByKeys<
        FullEventListeners,
        FullEventListeners
    >;

    // удаление старых перехватчиков событий
    const oldListeners = dom[elementSymbol]?.eventListeners ?? {};
    for (const eventName of Object.keys(oldListeners)) {
        if (!(eventName in eventListeners)) {
            dom.removeEventListener(eventName, oldListeners[eventName]);
            delete oldListeners[eventName];
        }
    }

    // обновление перехватчиков событий
    for (const eventName of Object.keys(eventListeners)) {
        const listener = eventListeners[eventName];

        if (listener === emptySymbol) {
            continue;
        }

        if (listener === deleteSymbol && oldListeners[eventName]) {
            dom.removeEventListener(eventName, oldListeners[eventName]);
            delete oldListeners[eventName];
            continue;
        }

        if (typeof listener !== 'function') {
            continue;
        }

        // заменяем старые обработчики на новые
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

        if (
            !updatedChildKeys.has(key) &&
            isObject(child) &&
            rawSymbol in child
        ) {
            newChildren.push(DOM(child as any));
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
}
