export type ErrorData = {
    count: number;
};

export type HandlerErrors = {
    initState: ErrorData;
};

export type HandlerData = {
    count: number;
    indexes: number[];
    bump(): void;
};

export type Handlers = {
    didMount: HandlerData;
    initState: HandlerData;
};

export function getHandlers(): Handlers {
    let handlerIndex = 0;
    return new Proxy({} as Handlers, {
        get(target, name: keyof Handlers) {
            if (!(name in target)) {
                target[name] = {
                    count: 0,
                    indexes: [],
                } as unknown as HandlerData;
                target[name].bump = () => {
                    handlerIndex++;
                    target[name].count++;
                    target[name].indexes.push(handlerIndex);
                };
            }
            return target[name];
        },
    });
}

export function getHandlerErrors(): HandlerErrors {
    return new Proxy({} as HandlerErrors, {
        get(target, name: keyof HandlerErrors) {
            if (!(name in target)) {
                target[name] = { count: 0 };
            }
            return target[name];
        },
    });
}
