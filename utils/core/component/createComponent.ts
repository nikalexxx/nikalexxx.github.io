import { getHandlers } from "./handlers";
import { MakeComponent } from "./model";

export const createComponent = <P, S>(
    componentName: string,
    makeComponent: MakeComponent<P, S>,
    initialProps: P,
    children: RawContainer[] = []
) => {
    const handlerErrors = getHandlerErrors();

    // уникальный идентификатор для созданного компонента
    const componentNameSymbol = Symbol(componentName);

    // свойства компонента

    type PropsType = P & { children: RawContainer[] };
    let props: PropsType = { ...initialProps, children };

    // элемент DOM, который будет возвращён
    // TODO: инлайн компоненты, вложенные в одном узле, у списка это родитель
    // структура цепочки компонентов в элементе
    // [компонент, который возвращает массив] > [аналогично, только вложенный] > возвращает компонент > который возвращает этот элемент

    let element: VDOMFragment = { isFragment: true };

    // вызванные обработчики
    const handlers = getHandlers();

    // TODO: отслеживать вызовы и гарантировать порядок
    const didMount = (callback: () => void) => {
        function onDidMount(event: CustomEvent) {
            if (event.detail.componentNameSymbol === componentNameSymbol) {
                callback();
            }
        }

        handlers.didMount.bump();

        // FIXME: отписываться при размонтировании
        const didMountListener = window.addEventListener(
            'didMount',
            onDidMount,
            false
        );
    };

    let firstAppend = true;

    const storage = {};
    const elements: { first: boolean; element: string }[] = [];

    const mo = new MutationObserver(function (mutations, observer) {
        const htmlElement =
            isObject(element) && 'dom' in element ? element : null;
        const htmlNode =
            htmlElement && htmlElement.dom ? htmlElement.dom.ref ?? null : null;
        if (htmlElement && htmlNode) {
            // element = false;
            // const componentDOMSymbol = Symbol('componentDOMSymbol');
            // if(!storage[componentDOMSymbol]) { // первый рендер
            //     storage[componentDOMSymbol] = {first: true};
            elements.push({
                first: true,
                element: isElement(htmlNode)
                    ? htmlNode.innerHTML
                    : htmlNode.nodeValue ?? '',
            });
            // }
            if (firstAppend) {
                if (isElement(htmlNode) && htmlNode instanceof HTMLElement) {
                    htmlNode.dataset['component'] = componentName;
                }
                window.dispatchEvent(
                    new CustomEvent('didMount', {
                        detail: {
                            componentNameSymbol: componentNameSymbol,
                        },
                    })
                );
                firstAppend = false;
                mo.disconnect();
            }
        } else {
            firstAppend = true;
            mo.disconnect();
        }
    });
    mo.observe(document, {
        attributes: true,
        childList: true,
        subtree: true,
    });

    const stateClass = getStateClass<S>(
        componentName,
        handlers,
        handlerErrors,
        rerender
    );

    const render = makeComponent({
        props: () => props,
        state: stateClass,
        hooks: {
            didMount,
        },
    });

    // другие компоненты первого уровня вложенности, которые встречаются в дереве
    // их нужно отслеживать, чтобы сохранять их состояние
    const subComponents: Record<string, VDOMComponent> = {}; // мутабельный объект

    function rerender() {
        const renderResult = render();
        const nodes = getNodes(renderResult);

        const fragment: VDOMFragment = {
            isFragment: true,
            children: getChildren(nodes).children,
            subComponents: getSubComponents(componentName, nodes),
            dom: {},
        };

        // разбор дерева с учётом суб-компонентов
        const { existSubComponents, updateCallbacks } = checkSubComponents({
            node: fragment,
            subComponents,
        });

        const dom = element.dom!;
        const componentData = element.component;
        const diffChildren = diffObject(element.children ?? {}, fragment.children ?? {}, diffElements as any);

        // новые элементы создаются без привязки к странице

        // обновляем дерево
        element = fragment;
        // BUG: не сохраняется новый вид элемента

        // сохраняем данные компонента
        element.component = componentData;

        // есть dom
        // получить их diff, TODO: учитывая static

        // сохраняем ссылку на dom
        element.dom = dom;
        // надо перепривязать к dom всех потомков

        if (dom.parent) {
            // dom на странице уже есть
            // меняется dom до субкомпонентов
            const componentData = dom.parent[componentSymbol];
            if (componentData) {
                // FIXME: заменить уникальной строкой
                const { start, end } = componentData.components.get('') ?? {};
                if (start && end) {
                    const oldChildren = getComponentChildNodes(
                        dom.parent,
                        start,
                        end
                    );
                    patchChildNodes({
                        dom: dom.parent,
                        oldNodes: oldChildren,
                        diffChildren,
                    });
                }
            }
        } else {
            // первый рендер

        }

        // при наличии субкомпонентов
        if (existSubComponents) {
            for (const key in updateCallbacks) {
                const update = updateCallbacks[key];
                // обновляем дерево компонента, props меняем, state не трогаем
                update();
            }
        }
    }

    // первый рендер
    // element = checkSubComponents({
    //     node: getFlatNode(render()),
    //     subComponents,
    // }).newElement;

    // отдельная функция разбирает дерево и выделяет субкомпоненты, возвращая колбеки для их обновления
    // diff для таких комопнентов не покажет изменения
    // сначала обновить элементы, потом субкомпоненты
    // в каждом из них та же схема
    // полное дерево вычисляется при вызове функции DOM / patchDOM

    // так как render может возвратить массив, дополнительная проверка на массив

    /* так как компоненты могут быть вложенными,
    одному элементу могут соответствовать несколько компонентов
    в поле component помечаем все уровни, добавляя на текущем уровне информацию о компоненте
    */

    const componentFunction: VDOMComponent = (() => element) as VDOMComponent;

    // такая функция имеет символьное свойство по символу componentSymbol
    componentFunction[componentSymbol] = {
        name: componentName,
        nameSymbol: componentNameSymbol,
        instance: 0,
        changeProps: (newProps: PropsType) => {
            props = newProps;
            rerender();
        },
        getProps: () => props,
    };

    element.component = componentFunction;

    return componentFunction;
};


