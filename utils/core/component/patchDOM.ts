import { isElement } from "../dom";
import { DOM } from "../render";
import { elementSymbol } from "../symbols";
import { arraySymbol, deleteSymbol, Diff, diff, DiffByKeys, emptySymbol, rawSymbol } from "../utils/diff";
import { isObject, isPrimitive, setType } from "../utils/type-helpers";
import { Container, FullChildren, FullEventListeners, FullProps, isVDOMElement, VDOMElement } from "../vdom-model";
import { getComponentChildNodes } from "./rerender";

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

    const props = diffObject.props as DiffByKeys<FullProps, FullProps>;
    patchProps({ dom, diffProps: props });


    const eventListeners = diffObject.eventListeners as DiffByKeys<
        FullEventListeners,
        FullEventListeners
    >;
    patchEventListeners({ dom, diffEventListeners: eventListeners });


    const children = diffObject.children as DiffByKeys<
        FullChildren,
        FullChildren
    >;
    patchChildNodes({
        dom,
        oldNodes: getComponentChildNodes(dom, dom.firstChild, dom.lastChild),
        diffChildren: children,
    });

    if (rawSymbol in diffObject) {
        const diffObject1 = diffObject as VDOMElement;
        if (!diffObject1.dom) {
            diffObject1.dom = {};
        }
        diffObject1.dom.ref = dom;
    }
}

type PatchPropsParams = {
    dom: Node;
    diffProps: DiffByKeys<FullProps, FullProps>;
};

export function patchProps({ dom, diffProps }: PatchPropsParams): void {
    if (!isObject(diffProps)) {
        return;
    }
    for (const propName in diffProps) {
        const prop = diffProps[propName];

        if (prop === diff.symbols.empty) {
            continue;
        }

        const isCustomProp = propName.startsWith('_');

        if (prop === diff.symbols.delete) {
            if (isCustomProp) {
                // delete dom[elementSymbol]?.props?.[propName];
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

type PatchEventListenersParams = {
    dom: Node;
    diffEventListeners: DiffByKeys<FullEventListeners, FullEventListeners>;
};

export function patchEventListeners({
    dom,
    diffEventListeners,
}: PatchEventListenersParams): void {
    // удаление старых перехватчиков событий
    const oldListeners = dom[elementSymbol]?.eventListeners ?? {};
    for (const eventName of Object.keys(oldListeners)) {
        if (!(eventName in diffEventListeners)) {
            dom.removeEventListener(eventName, oldListeners[eventName]);
            delete oldListeners[eventName];
        }
    }

    // обновление перехватчиков событий
    for (const eventName of Object.keys(diffEventListeners)) {
        const listener = diffEventListeners[eventName];

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
}

type PatchChildNodesParams = {
    dom: Node;
    oldNodes: Record<string, Node>;
    diffChildren: DiffByKeys<FullChildren, FullChildren>;
};

export function patchChildNodes({
    dom,
    oldNodes,
    diffChildren,
}: PatchChildNodesParams) {
    // обновление существующих потомков

    // ключи, которые были обновлены
    const updatedChildKeys: Set<string> = new Set();
    for (const [key, oldChild] of Object.entries(oldNodes)) {
        if (key in diffChildren) {
            const childDiff = diffChildren[key];
            if (childDiff === deleteSymbol) {
                dom.removeChild(oldChild);
            } else {
                patchDOM(oldChild, childDiff);
                updatedChildKeys.add(key);
            }
        }
    }

    // добавление новых потомков
    const newChildren: (Element | Text | DocumentFragment)[] = [];
    for (const key in diffChildren) {
        // пропуск уже обработанных
        if (updatedChildKeys.has(key)) {
            continue;
        }

        const child = diffChildren[key];

        // пропуск пустого изменения
        if (child === emptySymbol) {
            continue;
        }

        // пропуск удаления, ведь все удаления, что могли быть, уже отработали в первом цикле
        if (child === deleteSymbol) {
            continue;
        }

        // пропуск вложенных diff, все они должны отработать ранее
        if (!isPrimitive(child) && !(rawSymbol in child)) {
            continue;
        }

        newChildren.push(DOM(child as any));
    }

    // FIXME: нарушается порядок вставки
    if (newChildren.length > 0 && isElement(dom)) {
        dom.append(...newChildren);
    }
}
