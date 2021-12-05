import { P_Object } from 'ts-pro';

import { componentSymbol, elementSymbol, subComponentSymbol } from './symbols';
import { Diff, diff, raw } from './utils/diff';
import {
    namespaceNames,
    namespaceCodes,
    DOMNamespace,
    DOMNamespaceName,
} from './namespace';
import './global';
import { isObject, isPrimitive, Primitive, setType } from './utils/type-helpers';
import {
    VDOMComponent,
    Content,
    HTML_TAG,
    VDOMElement,
    Container,
    RawContainer,
    isComponent,
    RawContent,
    isVDOMElement,
    VDOMNode,
    VDOMFragment,
} from './vdom-model';
import { strToArray, isTemplateString } from './utils/syntax-helpers';
import { getNode } from './render';
import { getFlatNode } from './list';
import { ReactHTML } from 'react';

export function checkSubComponents({
    node,
    subComponents,
}: {
    node: VDOMFragment;
    subComponents: Record<string, VDOMComponent>;
}) {
    // node - неразобранное дерево
    // subComponents - существующие субкомпоненты, мутабельный объект

    // индикатор, что есть субкомпоненты для обновления
    let existSubComponents = false;

    // колбеки для обновления свойств
    const updateCallbacks: Record<string, () => void> = {};

    // новые субкомпоненты
    const newSubComponents = node.subComponents ?? {};

    // удаляем старые компоненты
    for (const path in subComponents) {
        if (path in newSubComponents) {
            continue;
        } else {
            delete subComponents[path];
        }
    }

    // обновляем существующие
    for (const path in newSubComponents) {
        if (path in subComponents) {
            // путь совпадает, компонент уже есть в дереве

            // помечаем функцию-элемент в дереве как клон субкомпонента, этот узел будет пропущен в diffElements
            newSubComponents[path][subComponentSymbol] = true;

            // берем новые свойства
            const newProps = newSubComponents[path][componentSymbol].getProps();

            // старые свойства
            const oldProps = subComponents[path][componentSymbol].getProps();

            if (diff(newProps, oldProps) !== diff.symbols.empty) {
                // если свойства поменялись, добавляем функцию для обновления
                updateCallbacks[path] = () =>
                    subComponents[path][componentSymbol].changeProps(newProps);

                // по крайней мере один субкомпонент обновляется самостоятельно
                if (!existSubComponents) {
                    existSubComponents = true;
                }
            }
        } else {
            // новый компонент
            // TODO: позже сделать проверку на перенос хотя бы в пределах соседних узлов

            // сохраняем новый субкомпонент
            subComponents[path] = newSubComponents[path];
        }
    }

    // получаем разобранное дерево с учётом субкомпонентов
    const newElement = getNode(node, true);

    return {
        existSubComponents,
        updateCallbacks,
        newElement,
    };
}

export function getNodeKey(node: Node, index: number): string {
    return node[elementSymbol]?.props?._key ?? `${index}`;
}

// document.addEventListener('load', );
type o = DocumentEventMap;
// interface .+EventMap

// теговый шаблон
type StringBuilder = (
    strings?: TemplateStringsArray | RawContainer,
    ...elements: RawContainer[]
) => RawContainer[];

// теговый шаблон для свойства
type PropsBuilder<K extends HTML_TAG> = <T extends RawContent>(
    strings: TemplateStringsArray | T,
    ...elements: T[]
) => PropsBlock<K>;

type CustomDOMAttributes = {
    class: string;
    _forceUpdate: boolean;
    _update(): boolean;
    [K: `data-${string}`]: string;
};

type DOMAttribytes<TAG extends HTML_TAG> = keyof Exclude<
    Parameters<ReactHTML[TAG]>[0],
    null | undefined
>;

type CustomHandlerName<N extends string> = N extends `on${infer X}`
    ? `on${Capitalize<X>}`
    : N;

// type CustomHandlerNames<T extends HTML_TAG> = CustomHandlerName<
//     Extract<keyof HTMLElementTagNameMap[T], `on${string}`>
// >;

type Attributes<T extends HTML_TAG> =
    | Exclude<DOMAttribytes<T>, 'className'>
    | keyof CustomDOMAttributes;
// | CustomHandlerNames<T>;

type PropsBlock<T extends HTML_TAG> = StringBuilder & {
    [A in Attributes<T>]: PropsBuilder<T>;
};

type ElementBuilder = StringBuilder & {
    [K in HTML_TAG]: PropsBlock<K>;
};

/** получение пустого элемента без свойст, событий и содержимого */
function getEmptyVDOMElement(
    namespace: DOMNamespaceName,
    tagName: HTML_TAG
): VDOMElement {
    const element: VDOMElement = {
        namespace: namespaceCodes[namespace],
        tagName,
        props: {},
        children: {},
        eventListeners: {},
        subComponents: {},
        nodeType: Node.ELEMENT_NODE,
        [elementSymbol]: true,
    };

    return element;
}

function isListener(propName: string, value: any): value is EventListener {
    return (
        propName.length > 2 &&
        propName.startsWith('on') &&
        propName[2] === propName[2].toUpperCase()
    );
}

/**
 * получение типа dom события на основе имени метода
 * @example 'onClick' -> 'click'
 */
const getEventName = (prop: string) =>
    `${prop[2].toLowerCase()}${prop.slice(3)}`;

/** Добавление свойств к элементу */
function addProps(
    element: VDOMElement,
    props: VDOMElement['props'] & VDOMElement['eventListeners']
) {
    for (const propName in props) {
        const value = props[propName];
        if (isListener(propName, value)) {
            const eventName = getEventName(propName);
            if (typeof value !== 'function') {
                console.error(
                    new Error(`${eventName} listener is not function`)
                );
                continue;
            }
            element.eventListeners![eventName] = value;
        } else {
            element.props![propName] = value;
        }
    }
}

export const filterChildren = (e: any) =>
    e !== false && e !== null && e !== undefined && e !== '';

/** получение плоского списка нод, все массивы уплощаются, все функции вызываются по возможности */
export function getNodes(children: RawContainer): Content[] {
    const nodes: Content[] = [];
    const childList = Array.isArray(children) ? children : [children];
    for (let node of childList.filter(filterChildren)) {
        const targetContainer = getNode(node, false);
        const targetNodes = Array.isArray(targetContainer)
            ? getFlatNode<[Container, Content]>(targetContainer).filter(
                  filterChildren
              )
            : [targetContainer];
        nodes.push(...targetNodes);
    }

    return nodes;
}

export function getKey(node: Content): string {
    return isVDOMElement(node) ? `${node.props?._key ?? ''}` : '';
}

export function getChildren(nodes: Content[]): {
    children: Record<string, Content>;
    dublicatedKeys: Set<string>;
} {
    const children: Record<string, Content> = {};
    /** дублирующие ключи для детей */
    const dublicatedKeys: Set<string> = new Set();
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const key = getKey(node);
        const index = `${i}`;
        const existKey = key in children;
        if (key && !existKey) {
            children[key] = node;
        } else {
            children[index] = node; // TODO: рекурсивно выбрать уникальное значение
            if (existKey) {
                dublicatedKeys.add(key);
            }
        }
        // FIXME: не сохраняется порядок при добавлении в объект
    }

    return { children, dublicatedKeys };
}

export function getSubComponents(
    prefix: string,
    nodes: Content[]
): Record<string, VDOMComponent> {
    const subComponents: Record<string, VDOMComponent> = {};

    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const key = getKey(node);
        const index = `${i}`;

        // div.0, span.key1, p.7
        // TODO: улучшить ключ субкомпонента или ввести ограничение на ключ элемента
        const localSubKey = `${prefix}.${key || index}`;
        if (isComponent(node)) {
            // разбор компонентов
            const subKey = `${localSubKey}#${node[componentSymbol].name}`;
            subComponents[subKey] = node;
        } else if (
            !isPrimitive(node) &&
            Object.keys(node.subComponents ?? {}).length > 0
        ) {
            // проброс данных о субкомпонентах наверх по дереву
            for (const subKey in node.subComponents) {
                const subPath = `${localSubKey}>${subKey}`;
                subComponents[subPath] = node.subComponents[subKey];
            }
        }
    }

    return subComponents;
}

const create = (
    namespace: DOMNamespaceName,
    tagName: HTML_TAG = 'div',
    props: VDOMElement['props'] & VDOMElement['eventListeners'] = {},
    childList: RawContainer[] = []
) => {
    const element = getEmptyVDOMElement(namespace, tagName);
    addProps(element, props);

    const nodes = getNodes(childList);

    const { children, dublicatedKeys } = getChildren(nodes);

    element.children = children;
    element.subComponents = getSubComponents(tagName, nodes);

    if (dublicatedKeys.size > 0) {
        console.error(
            new Error(`keys ${Array.from(dublicatedKeys)} have been dublicated`)
        );
    }
    return element;
};

function prepareChildren(items: any[]): any[] {
    return isTemplateString(items) ? strToArray(...items) : items;
}

function prepareProps(prop: string, items: any): Record<string, any> {
    if (prop === '_props' && isObject(items[0])) {
        return items[0];
    }
    return {
        [prop]: isTemplateString(items)
            ? strToArray(...items).join('')
            : items[0],
    };
}

function stableElement(
    namespace: DOMNamespaceName,
    name: HTML_TAG,
    props: VDOMElement['props'] & VDOMElement['eventListeners']
) {
    return new Proxy(
        (...children: any[]) =>
            create(namespace, name, props, prepareChildren(children)),
        {
            get(_, prop: string) {
                return (...items: any[]) =>
                    stableElement(namespace, name, {
                        ...props,
                        ...prepareProps(prop, items),
                    });
            },
        }
    );
}

const getElement = (namespace: DOMNamespaceName) =>
    new Proxy(strToArray as ElementBuilder, {
        get(_, tag: HTML_TAG) {
            return stableElement(namespace, tag, {});
        },
    });

export const E = getElement('http://www.w3.org/1999/xhtml');
export const S = getElement('http://www.w3.org/2000/svg');
export const M = getElement('http://www.w3.org/1998/Math/MathML');

E.a.href`https://yandex.ru`.target`_blank``Yandex`;

type d = Exclude<Parameters<ReactHTML['a']>[0], null | undefined>;

// // резерв
// E.$a
// E._
// E._a
// E.A
