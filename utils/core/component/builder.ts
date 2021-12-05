type RT = <P, S extends Record<string, any>>(
    makeComponent: MakeComponent<P, S>
) => VDOMComponentBuilder<P>;


const componentCounter = getCounter();
function componentConstructor<T extends string>(componentName: T) {
    if (!ComponentNameRegex.test(componentName)) {
        throw new Error(
            `Component name shold be match with ${ComponentNameRegex.source}`
        );
    }

    const componentDefinitionCount = componentCounter.get();

    return function <P, S extends Record<string, any>>(
        makeComponent: MakeComponent<P, S>
    ) {
        function stableElement(props: Partial<P>) {
            const getComponent = ((...children: Content[]) =>
                create<P, S>(
                    componentName,
                    makeComponent,
                    {} as P,
                    children
                )) as VDOMComponentBuilder<P>;
            return new Proxy(getComponent, {
                get<K extends keyof P>(
                    target: typeof getComponent,
                    prop: K & string
                ) {
                    return function (value: P[K]) {
                        return stableElement({
                            ...props,
                            [prop]: value,
                        });
                    };
                },
                apply(target, thisArg, argArray) {
                    return create<P, S>(
                        componentName,
                        makeComponent,
                        props as P,
                        argArray
                    );
                },
            });
        }
        return stableElement({});
    };
}

type VDOMComponentBuilder<P> = {
    [K in keyof P]: (
        value: P[K] | TemplateStringsArray
    ) => VDOMComponentBuilder<P>;
} & ((...children: RawContainer[]) => VDOMComponent<P>);

export const Component = new Proxy(
    {} as Record<
        string,
        <P = any, S = any>(
            builder: (params: ComponentParams<P, S>) => () => RawContainer
        ) => VDOMComponentBuilder<P>
    >,
    {
        get: function <T extends string>(target: any, componentName: T) {
            return componentConstructor(componentName);
        },
    }
);
