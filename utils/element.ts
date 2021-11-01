import { componentSymbol, elementSymbol, subComponentSymbol } from './symbols';
import { Diff, diff, raw } from './diff';
import {
    namespaceNames,
    namespaceCodes,
    DOMNamespace,
    DOMNamespaceName,
} from './namespace';
import './global';
import { isObject, isPrimitive, Primitive, setType } from './type-helpers';
import { VDOMComponent, Content, HTML_TAG, VDOMElement } from './vdom-model';
import { strToArray } from './syntax-helpers';
import { getNode } from './render';

export function checkSubComponents({ node, subComponents }: any) {
    // node - неразобранное дерево
    // subComponents - существующие субкомпоненты, мутабельный объект

    // индикатор, что есть субкомпоненты для обновления
    let existSubComponents = false;

    // колбеки для обновления свойств
    const updateCallbacks: Record<string, any> = {};

    // новые субкомпоненты
    const newSubComponents = node.subComponents;

    // удаляем старые компоненты
    for (const path in subComponents) {
        if (path in newSubComponents) {
            continue;
        } else {
            delete subComponents[path];
        }
    }
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

// document.addEventListener('load', );
type o = DocumentEventMap;
// interface .+EventMap

const getElement = (namespace: DOMNamespaceName) =>
    new Proxy(strToArray, {
        get(target, tag: HTML_TAG) {
            const create = (
                tagName: HTML_TAG = 'div',
                props: VDOMElement['props'] = {},
                children: Content[] = []
            ) => {
                const element: VDOMElement = {
                    namespace: namespaceCodes[namespace],
                    tagName,
                    props: {},
                    children: {},
                    eventListeners: {},
                    subComponents: {},
                    nodeType: Node.ELEMENT_NODE,
                };
                for (const prop in props) {
                    if (
                        prop.length > 2 &&
                        prop.startsWith('on') &&
                        prop[2] === prop[2].toUpperCase()
                    ) {
                        const eventName = prop[2].toLowerCase() + prop.slice(3);
                        const listener = props[prop];
                        if (typeof listener !== 'function') {
                            console.error(
                                new Error(
                                    `${eventName} listener is not function`
                                )
                            );
                            continue;
                        }
                        element.eventListeners![eventName] = listener;
                    } else if (props[prop]) {
                        element.props![prop] = props[prop];
                    }
                }
                const nodes: Content[] = [];
                for (let node of children.filter(
                    (e) => e !== false && e !== null && e !== undefined
                )) {
                    const targetNode = getNode(node, false);
                    if (Array.isArray(targetNode)) {
                        nodes.push(...targetNode.filter((e) => e));
                    } else {
                        nodes.push(targetNode);
                    }
                }
                const dublicatedKeys = new Set();
                for (let i = 0; i < nodes.length; i++) {
                    const node = nodes[i];
                    const key =
                        isObject(node) && 'props' in node && node.props?._key
                            ? String(node.props._key)
                            : '';
                    const index = String(i);
                    if (key && !(key in element.children!)) {
                        element.children![key] = node;
                    } else {
                        if (key in element.children!) {
                            dublicatedKeys.add(key);
                        }
                        element.children![index] = node; // TODO: рекурсивно выбрать уникальное значение
                    }

                    // div.0, span.key1, p.7
                    // TODO: улучшить ключ субкомпонента или ввести ограничение на ключ элемента
                    const localSubKey = `${tagName}.${key || index}`;
                    if (typeof node === 'function') {
                        // разбор компонентов
                        if (componentSymbol in node) {
                            const subKey = `${localSubKey}#${node[componentSymbol].name}`;
                            element.subComponents![subKey] = node;
                        }
                    } else if (
                        !isPrimitive(node) &&
                        Object.keys((node as any).subComponents!).length > 0
                    ) {
                        // проброс данных о субкомпонентах наверх по дереву
                        setType<VDOMElement>(node);
                        for (const subKey in node.subComponents) {
                            const newKey = `${localSubKey}>${subKey}`;
                            element.subComponents![newKey] =
                                node.subComponents[subKey];
                        }
                    }
                }
                if (dublicatedKeys.size > 0) {
                    console.error(
                        new Error(
                            `keys ${[...dublicatedKeys]} have been dublicated`
                        )
                    );
                }
                return element;
            };

            function stableElement(
                name: HTML_TAG,
                props: VDOMElement['props']
            ) {
                return new Proxy(
                    (...children: any[]) => {
                        if (
                            Array.isArray(children[0]) &&
                            'raw' in children[0]
                        ) {
                            return create(
                                name,
                                props,
                                strToArray(children[0], ...children.slice(1))
                            );
                        }
                        return create(name, props, children);
                    },
                    {
                        get(target, prop) {
                            return function (value: any, ...items: any[]) {
                                if (prop === '_props') {
                                    return stableElement(name, {
                                        ...props,
                                        ...value,
                                    });
                                }
                                if (Array.isArray(value) && 'raw' in value) {
                                    return stableElement(name, {
                                        ...props,
                                        [prop]: strToArray(
                                            value,
                                            ...items
                                        ).join(''),
                                    });
                                }
                                return stableElement(name, {
                                    ...props,
                                    [prop]: value,
                                });
                            };
                        },
                        apply(target, thisArg, argArray) {
                            if (
                                Array.isArray(argArray[0]) &&
                                'raw' in argArray[0]
                            ) {
                                return create(
                                    name,
                                    props,
                                    strToArray(
                                        argArray[0],
                                        ...argArray.slice(1)
                                    )
                                );
                            }
                            return create(name, props, argArray);
                        },
                    }
                );
            }
            return stableElement(tag, {});
        },
    });

export const E = getElement('http://www.w3.org/1999/xhtml');
export const S = getElement('http://www.w3.org/2000/svg');
export const M = getElement('http://www.w3.org/1998/Math/MathML');

// // резерв
// E.$a
// E._
// E._a
// E.A
