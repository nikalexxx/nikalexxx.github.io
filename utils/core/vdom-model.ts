import { ReactHTML } from 'react';
import { DOMNamespace } from './namespace';
import { componentSymbol, elementSymbol, subComponentSymbol } from './symbols';
import { isObject, Primitive } from './utils/type-helpers';

export type HTML_TAG = keyof ReactHTML;
export type SVG_TAG = keyof SVGElementTagNameMap;

export type Tags = {
    [DOMNamespace.xhtml]: HTML_TAG;
    [DOMNamespace.svg]: SVG_TAG;
    [DOMNamespace.mathml]: string;
};

// типы контента
export type Content = VDOMElement | VDOMComponent | VDOMFragment | Primitive;

// тип контента до обработки
export type RawContent = Content | (() => Content);

// массивы любой вложенности
export type Container = Content | (Content | Container)[];

export type RawContainer = RawContent | (RawContent | RawContainer)[];

export type CustomProps = {
    _ref?: (e: Element) => void;
    _key?: string;
    _forceUpdate?: boolean;
    _update?: boolean;
};

export type VDOMNode = {
    /** вложенные ноды */
    children?: Record<string, Content>;

    subComponents?: Record<string, VDOMComponent>;

    component?: VDOMComponent;
};

export type VDOMRefDom = {
    /** привязка к реальному DOM */
    dom?: {
        ref?: Node; // на текущую ноду
        parent?: Node; // на родительскую
    };
}

export type VDOMFragment = VDOMNode & VDOMRefDom & {
    isFragment: true;
}

export type VDOMElement<N extends DOMNamespace = DOMNamespace> = VDOMNode & VDOMRefDom & {
    nodeType: number;
    namespace: N;
    tagName: Tags[N];
    props?: Record<string, string> & CustomProps;

    /** обработчики событий */
    eventListeners?: Record<string, EventListener>;

    /** для текстовых узлов */
    data?: string;
    [elementSymbol]: true;
};

export type FullProps = Required<VDOMElement>['props'];
export type FullChildren = Required<VDOMElement>['children'];
export type FullEventListeners = Required<VDOMElement>['eventListeners'];

export function isVDOMElement(e: unknown): e is VDOMElement {
    return isObject(e) && elementSymbol in e;
}

window.vdom = function vdom(e: Node | undefined | null) {
    return e ? e[elementSymbol] : undefined;
};
