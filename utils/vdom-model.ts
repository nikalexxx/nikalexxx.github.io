import { DOMNamespace } from './namespace';
import { componentSymbol } from './symbols';
import { Primitive } from './type-helpers';

export type HTML_TAG = keyof HTMLElementTagNameMap;
export type SVG_TAG = keyof SVGElementTagNameMap;

export type Tags = {
    [DOMNamespace.xhtml]: HTML_TAG;
    [DOMNamespace.svg]: SVG_TAG;
    [DOMNamespace.mathml]: string;
};

export type Content = VDOMElement | VDOMComponent | Primitive;
export type Container = Content | Content[];
// export type Container2 = (VDOMElement | Component | Primitive) | (VDOMElement | Component | Primitive)[];

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
};

/** общий вид внутреннего состояния компонента */
export type ComponentState = Record<string, any>;

/** общий вид внешних свойств компонента */
export type ComponentProps = Record<string, any>;

export type VDOMComponent<P extends ComponentProps = ComponentProps> = (() =>
    | (VDOMElement | VDOMComponent | Primitive)
    | (VDOMElement | VDOMComponent | Primitive)[]) & {
    [componentSymbol]: {
        name: string;
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
