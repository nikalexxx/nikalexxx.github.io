import {
    E,
    Component,
    Custom
} from './index.js';


const historyUpdate = new CustomEvent('historyUpdate');

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
        return {params: {}, path: '/', routes: routes('')}
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
    for (const path in routes({})) {
        const pathStack = path.split('/');
        const params = {};
        let equal = true;
        for (let i = 0; i < pathStack.length; i++) {
            if (i === stack.length) {
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
        }
        if (equal) {
            resultParams = params;
            resultPath = path;
        }
    }
    return {params: resultParams, path: resultPath, routes: routes(resultParams)};
}

export const RouteLink = Component.RouteLink(({props: {href, children}}) => {
    return () => {
        const onLinkClick = (event) => {
            event.preventDefault();
            if (href === '/') {
                pushState({stack: []}, '', '/');
                return;
            }
            if (((window.history.state || {}).stack || []).join('/') === href) {
                return;
            }
            pushState({
                stack: href.split('/')
            }, '', '?/' + href);
        };
        return E.a.href(href).onClick(onLinkClick)(children);
    };
})


export const Switch = Component.Switch(({props, getState, setState, initState}) => {
    initState(getRouterState(props.routes));
    window.addEventListener('historyUpdate', function () {
        setState(getRouterState(props.routes));
    });
    return () => {
        const {path, routes} = getState();
        return routes[path];
    }
});
