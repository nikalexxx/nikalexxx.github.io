const _log = condition => f => {
    if (condition) {
        if (typeof f === 'function') {
            f();
        } else {
            console.log(f);
        }
    }
}
const loggerSymbol = Symbol('logger');
export const logAllLevels = Symbol('all');
window[loggerSymbol] = {};

export const setLogger = settings => {
    window[loggerSymbol] = settings;
};

function getCondition(levels) {
    let current = window[loggerSymbol];
    for (const level of levels) {
        if(current && logAllLevels in current) {
            return true;
        }
        if (!(current && level in current)) {
            return false;
        }
        current = current[level];
    }
    return true;
}

function createLogProxy(levels) {
    return new Proxy(f => _log(getCondition(levels))(f), {
        get: (target, level) => createLogProxy([...levels, level])
    });
}

export const log = createLogProxy([]);

