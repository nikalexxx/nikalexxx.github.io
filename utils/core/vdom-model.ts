import { ReactHTML } from 'react';
import { DOMNamespace } from './namespace';
import { componentSymbol, elementSymbol, subComponentSymbol } from './symbols';
import { isObject, Primitive } from './type-helpers';

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

    component?: {
        currentLevel: number;
        levels: Record<string, ComponentData>;
    };
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

export function isVDOMElement(e: unknown): e is VDOMElement {
    return isObject(e) && elementSymbol in e;
}

/** общий вид внутреннего состояния компонента */
export type ComponentState = Record<string, any>;

/** общий вид внешних свойств компонента */
export type ComponentProps = Record<string, any>;

export type VDOMComponent<P extends ComponentProps = ComponentProps> = (() => VDOMFragment) & {
    [componentSymbol]: {
        name: string; // отображаемое имя компонента
        nameSymbol: symbol; // уникальный символ компонента
        instance: number; // номер инстанса
        getProps(): P;
        changeProps(p: P): void;
    };
    [subComponentSymbol]?: true;
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

window.vdom = function vdom(e: Node | undefined | null) {
    return e ? e[elementSymbol] : undefined;
};
