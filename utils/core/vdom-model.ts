import { ReactHTML } from 'react';
import { DOMNamespace } from './namespace';
import { componentSymbol, elementSymbol } from './symbols';
import { isObject, Primitive } from './type-helpers';

export type HTML_TAG = keyof ReactHTML;
export type SVG_TAG = keyof SVGElementTagNameMap;

export type Tags = {
    [DOMNamespace.xhtml]: HTML_TAG;
    [DOMNamespace.svg]: SVG_TAG;
    [DOMNamespace.mathml]: string;
};

// типы контента
export type Content = VDOMElement | VDOMComponent | Primitive;

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

export type VDOMElement<N extends DOMNamespace = DOMNamespace> = {
    nodeType: number;
    namespace: N;
    tagName: Tags[N];
    props?: Record<string, string> & CustomProps;

    /** обработчики событий */
    eventListeners?: Record<string, (e: Event) => void>;

    /** вложенные ноды */
    children?: Record<string, Content>;

    subComponents?: Record<string, any>;

    /** для текстовых узлов */
    data?: string;

    /** привязка к реальному DOM */
    dom?: {
        ref?: Node;
        parent?: Node;
    };

    component?: {
        currentLevel: number;
        levels: Record<string, ComponentData>;
    };

    [elementSymbol]: true;
};

export function isVDOMElement(e: unknown): e is VDOMElement {
    return isObject(e) && elementSymbol in e;
}

/** общий вид внутреннего состояния компонента */
export type ComponentState = Record<string, any>;

/** общий вид внешних свойств компонента */
export type ComponentProps = Record<string, any>;

export type VDOMComponent<P extends ComponentProps = ComponentProps> = (() =>
    | (VDOMElement | VDOMComponent | Primitive)
    | (VDOMElement | VDOMComponent | Primitive)[]) & {
    [componentSymbol]: {
        name: string;
        nameSymbol: symbol;
        getProps(): P;
        changeProps(p: P): void;
    };
};

export type ComponentData<
    P extends ComponentProps = ComponentProps,
    S extends ComponentState = ComponentState
> = {
    array: boolean;
    name: string;
    readonly nameSymbol: symbol;
    props: P;
    state: S;
};

export function isComponent(e: unknown): e is VDOMComponent {
    return typeof e === 'function' && componentSymbol in e;
}

window.vdom = function vdom (e: Node | undefined | null) {
    return e ? e[elementSymbol] : undefined;
}
