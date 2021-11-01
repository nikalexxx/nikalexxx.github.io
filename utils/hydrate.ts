import { VDOMElement } from "./vdom-model";
import { isElement } from './dom';
import { DOMNamespace, DOMNamespaceName, namespaceCodes, namespaceNames } from "./namespace";

function getProps(attributes: NamedNodeMap | null): VDOMElement['props'] {
    if (!attributes) {
        return {};
    }
    const attrs = Array.from(attributes);
    const result: Record<string, string> = {};
    for (const { name, value } of attrs) {
        result[name] = value;
    }
    return result;
}

function getChildren(childNodes: NodeListOf<Node> | null | undefined): VDOMElement['children'] {
    if (!childNodes) {
        return {};
    }
    const children = Array.from(childNodes);
    const result: Record<string, VDOMElement> = {};
    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        let key = `${i}`;
        if (isElement(child) && child.hasAttribute('data-key')) {
            key = child.getAttribute('data-key')!;
        }
        result[key] = getElementFromDOM(child);
    }
    return result;
}

function getElementFromDOM(domElement: Node): VDOMElement {
    return {
        nodeType: domElement.nodeType,
        namespace:
            namespaceCodes[
                (domElement.namespaceURI as DOMNamespaceName) ??
                    namespaceNames[DOMNamespace.xhtml]
            ],
        tagName: isElement(domElement) ? domElement.tagName : '',
        props: isElement(domElement) ? getProps(domElement.attributes) : {},
        children: getChildren(domElement.childNodes),
        data: (domElement as any).data,
        dom: {
            ref: domElement,
            parent: domElement.parentNode ?? undefined,
        }
    };
}
