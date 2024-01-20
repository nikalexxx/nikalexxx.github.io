import { Component } from "parvis";

const historyUpdate = new CustomEvent("historyUpdate");

export const Page404Symbol = Symbol("404");

function pushState(data: any, title: string, url: string) {
    history.pushState(data, title, url);
    window.dispatchEvent(historyUpdate);
}

function replaceState(data: any, title: string, url: string) {
    history.replaceState(data, title, url);
    window.dispatchEvent(historyUpdate);
}

window.addEventListener("popstate", () => window.dispatchEvent(historyUpdate));

export const getRouterState = (routes: any) => {
    if (!document.location.search) {
        return { params: {}, path: "/", routes: routes("") };
    }
    const params = new URLSearchParams(document.location.search);
    const stack: string[] = [];
    for (const [param] of params) {
        if (param[0] === "/") {
            stack.push(...param.slice(1).split("/"));
        }
    }
    let resultParams = {};
    let resultPath: string | null | symbol = null;
    let equal = false;
    for (const path in routes({})) {
        const pathStack = path.split("/");
        const params: Record<string, string> = {};
        for (let i = 0; i < stack.length; i++) {
            if (i === pathStack.length) {
                equal = false;
                break;
            }
            const level = pathStack[i];
            if (level[0] === ":") {
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

type Props = {
    href: string;
}

export const RouteLink = Component<Props>(
    "RouteLink",
    ({ props }) => {
        const onLinkClick: JSX.IntrinsicElements["a"]["on:click"] = (event) => {
            const { href } = props();

            event.preventDefault();
            if (href === "/") {
                pushState({ stack: [] }, "", "/");
                return;
            }
            if (((window.history.state || {}).stack || []).join("/") === href) {
                return;
            }
            pushState(
                {
                    stack: href.split("/"),
                },
                "",
                "?/" + href
            );
        };

        return () => {
            const { href, children } = props();
            return (
                <a href={href} on:click={onLinkClick}>
                    {children}
                </a>
            );
        };
    }
);

export const Switch = Component<{ routes: any }>(
    "Switch",
    ({ props, state, hooks }) => {
        const { routes } = props();
        const [routeState, setRouteState] = state(getRouterState(routes));

        const listener: EventListener = function () {
            const newState = getRouterState(routes);
            // console.log({newState});
            setRouteState(newState);
        };
        hooks.mount(() => {
            console.log("Switch", routeState());
            window.addEventListener("historyUpdate", listener);
        });

        hooks.destroy(() => {
            window.removeEventListener("historyUpdate", listener);
        });

        return () => {
            const { path, routes } = routeState();
            return (
                <div
                    class={"route"}
                    data-path={String(path)}
                >
                    {routes[path]}
                </div>
            );
        };
    }
);
