import {
    VDOMComponent,
    VDOMElement,
    isComponent,
    Container,
    Content,
    isVDOMElement,
    RawContainer,
    FullEventListeners,
    FullChildren,
    FullProps,
} from './vdom-model';
import {
    isObject,
    isPrimitive,
    Primitive,
    setType,
} from './utils/type-helpers';
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
} from './utils/diff';
import { isElement } from './dom';
import { getFlatNode } from './list';
import { emptySymbol, diffArray, diffObject, isDiffRaw } from './utils/diff';
import { getNodeKey } from './element';

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
        return diffElements(
            getNode({ node: A, expand: true, expandSub: true }),
            getNode({ node: B, expand: true, expandSub: true })
        );
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

    const diffChildren: Diff<VDOMElement['children'], VDOMElement['children']> =
        diffObject(A.children ?? {}, B.children ?? {}, diffElements as any);

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

type GetNodeOptions = {
    node: RawContainer;
    expand?: boolean;
    expandSub?: boolean;
};
/**
 * Раскрывает функции компонентов
 */
export function getNode({
    node,
    expand = false,
    expandSub = false,
}: GetNodeOptions): Container {
    if (Array.isArray(node)) {
        // делаем массив плоским
        return getFlatNode(node).flatMap((e) =>
            getNode({ node: e, expand, expandSub })
        );
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
    return getNode({ node: node(), expand, expandSub });
}

/** Создание dom из элементов */
export const DOM = (
    elementObject: RawContainer
): Element | Text | DocumentFragment => {
    if (isPrimitive(elementObject)) {
        return document.createTextNode(String(elementObject));
    }

    if (isComponent(elementObject)) {
        if (subComponentSymbol in elementObject) {
            return DOM(
                getNode({ node: elementObject, expand: true, expandSub: true })
            );
        }
        return DOM(getNode({ node: elementObject, expand: true }));
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

function getChildNodes(node: Node): Record<string, Node> {
    const nodes: Record<string, Node> = {};
    const list = Array.from(node.childNodes);
    for (let i = 0; i < list.length; i++) {
        const child = list[i];
        const key = getNodeKey(child, i);
        nodes[key] = child;
    }
    return nodes;
}
