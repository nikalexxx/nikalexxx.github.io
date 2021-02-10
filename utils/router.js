import { Component, E } from './index.js';

const historyUpdate = new CustomEvent('historyUpdate');

export const Page404Symbol = Symbol('404');

function pushState(data, title, url) {
    history.pushState(data, title, url);
    window.dispatchEvent(historyUpdate);
}

function replaceState(data, title, url) {
    history.replaceState(data, title, url);
    window.dispatchEvent(historyUpdate);
}

window.addEventListener('popstate', () => window.dispatchEvent(historyUpdate));

export const getRouterState = (routes) => {
    if (!document.location.search) {
        return { params: {}, path: '/', routes: routes('') };
    }
    const params = new URLSearchParams(document.location.search);
    const stack = [];
    for (const [param] of params) {
        if (param[0] === '/') {
            stack.push(...param.slice(1).split('/'));
        }
    }
    let resultParams = {};
    let resultPath = null;
    let equal = false;
    for (const path in routes({})) {
        const pathStack = path.split('/');
        const params = {};
        for (let i = 0; i < stack.length; i++) {
            if (i === pathStack.length) {
                equal = false;
                break;
            }
            const level = pathStack[i];
            if (level[0] === ':') {
                params[level.slice(1)] = stack[i];
            } else if (level !== stack[i]) {
                equal = false;
                break;
            }
            if (i === stack.length - 1) {
                equal = true;
            }
        }
        if (equal) {
            resultParams = params;
            resultPath = path;
            break;
        }
    }
    if (resultPath === null) {
        resultPath = Page404Symbol;
    }
    return {
        params: resultParams,
        path: resultPath,
        routes: routes(resultParams),
    };
};

export const RouteLink = Component.RouteLink(({ props }) => {
    return () => {
        const { href, children } = props();
        const onLinkClick = (event) => {
            event.preventDefault();
            if (href === '/') {
                pushState({ stack: [] }, '', '/');
                return;
            }
            if (((window.history.state || {}).stack || []).join('/') === href) {
                return;
            }
            pushState(
                {
                    stack: href.split('/'),
                },
                '',
                '?/' + href
            );
        };
        return E.a.href(href).onClick(onLinkClick)(children);
    };
});

export const Switch = Component.Switch(({ props, state }) => {
    const { routes } = props();
    state.init(getRouterState(routes));
    window.addEventListener('historyUpdate', function () {
        state.set(getRouterState(routes));
    });
    return () => {
        const { path, routes } = state();
        return E.div._forceUpdate(true).class('route')['data-path'](path)(
            routes[path]
        );
    };
});
