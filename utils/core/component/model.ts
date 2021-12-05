import { componentSymbol, subComponentSymbol } from './symbols';

/** общий вид внутреннего состояния компонента */
export type ComponentState = Record<string, any>;

/** общий вид внешних свойств компонента */
export type ComponentProps = Record<string, any>;

export type VDOMComponent<P extends ComponentProps = ComponentProps> =
    (() => VDOMFragment) & {
        [componentSymbol]: {
            name: string; // отображаемое имя компонента
            nameSymbol: symbol; // уникальный символ компонента
            instance: string; // ключ инстанса
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

export const ComponentNameRegex = /^[A-Za-z][A-Za-z0-9-_]*$/;

export type ComponentParams<P extends ComponentProps, S extends ComponentState> = {
    props: () => P & { children: RawContainer[] };
    state: (() => S) & {
        init: (initState: S) => void;
        set: (arg: S | ((s: S) => S), callback?: () => void) => void;
        onChange: (...names: (keyof S)[]) => boolean;
    };
    hooks: {
        didMount: (callback: () => void) => void;
    };
};

/** рендер функция, возвращается из каждого компонента */
export type ComponentRender = () => RawContainer;

export type MakeComponent<P, S> = (params?: ComponentParams<P, S>) => ComponentRender;
