import { HandlerErrors, Handlers } from './handlers';
import { ComponentState } from './model';

export const getNewState =
    <S extends ComponentState>(state: S) =>
    (arg: S | ((s: S) => S)): S => {
        let newObject: S = {} as S;
        if (typeof arg === 'object') {
            newObject = arg;
        } else if (typeof arg === 'function') {
            newObject = arg(state);
        }
        return newObject;
    };

export function getInitState<S>(
    componentName: string,
    stateRef: {state: S},
    handlers: Handlers,
    handlerErrors: HandlerErrors
) {
    return function initState(startState: S) {
        if (handlers.initState.count !== 0) {
            if (!handlerErrors.initState.count) {
                handlerErrors.initState.count = 1;
                const errorText = `${componentName}: Повторный вызов инициализации состояния`;
                console.error(new Error(errorText));
            }
        }
        handlers.initState.bump();
        stateRef.state = startState;
    };
}

export type StateClass<S> = {
    (): S;
    set: (
        newState: S | ((s: S) => S),
        callback?: (() => void) | undefined
    ) => void;
    init: (startState: S) => void;
    onChange: (...names: (keyof S)[]) => boolean;
};

export function getStateClass<S extends ComponentState>(
    componentName: string,
    handlers: Handlers,
    handlerErrors: HandlerErrors,
    rerender: () => void
): StateClass<S> {
    // состояние компонента
    let state: S = {} as S;

    // предыдущее состояние
    let prevState: S = {} as S;

    const initState = getInitState(
        componentName,
        {state},
        handlers,
        handlerErrors
    );

    let changedStateFields: Set<keyof S> = new Set();

    function setState(newState: S | ((s: S) => S), callback?: () => void) {
        prevState = state;
        const newStateObject = getNewState(state)(newState);
        changedStateFields = new Set(
            Object.keys(newStateObject) as (keyof S)[]
        );
        state = { ...state, ...newStateObject };
        rerender();
        callback?.();
    }

    const changeState = (...names: (keyof S)[]) => {
        for (const name of names) {
            if (changedStateFields.has(name)) {
                return true;
            }
        }
        return false;
    };

    const stateClass = () => state;
    // перейти на прокси? тогда придумать название для остальных
    // сразу setState, initState
    // apply: state().set()
    // state[_].set() - _ Symbol
    // state`set`(), state`init`() !!! - хороший вариант
    // state[_.set]()
    stateClass.set = setState;
    stateClass.init = initState;
    stateClass.onChange = changeState;
    // позволит писать _update(state.onChange('name', 'age'))
    // в перспективе что-то вроде _related(['name', 'age'])
    // идея - писать в метаинформации объектов state данные о своём state - имя, компонент и т.д.
    // тогда при обновлении мы посмотрим, и если поля из state.set не имеют отношения к полям, от котрых зависит обновление, то элемент не обновляется
    // более общий вопрос, как отследить зависимость от некоторого значения из состояния?

    return stateClass;
}
