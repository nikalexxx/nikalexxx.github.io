import "./App.less";
import "../../services/langs/map";

import { Button, Select } from "../../blocks/index.js";
import {
    NOT,
    RouteLink,
    Switch,
    block,
    getRouterState,
    style,
} from "../../utils";
import { defaultLang, setLang } from "../../services/langs/model";

import { Icon } from "../../icons/index.js";
import { Lang } from "../../blocks/LangToken/LangToken";
import { routes } from "../routes";
import { Component, StateClass } from "parvis";
import { Lang as LangType } from "../../services/langs/langs";

const b = block("app");

setLang(localStorage.getItem("lang") || defaultLang);

const Menu = Component("Menu", ({ state, hooks }) => {
    const path = () => getRouterState(routes).path;
    const [i, setI] = state(0);
    const [getCompact, setCompact] = state(false);
    hooks.mount(() => {
        console.log("Menu", i());
    });
    window.addEventListener("historyUpdate", () => setI((i) => i + 1));
    function renderLink(href: string, title: any, icon: any, compact: boolean) {
        const currentPath = path();
        const current =
            typeof currentPath === "string" &&
            (currentPath!.startsWith(href) ||
                (currentPath === "/" && href === "blog"));
        return (
            <RouteLink href={href}>
                <div
                    class={b("menu-link", { current })}
                    title={href}
                    on:click={() => {
                        if (document.documentElement.clientWidth < 700) {
                            document.documentElement.classList.toggle(
                                "mobile-visible"
                            );
                        }
                    }}
                >
                    <span>
                        {icon && <span>{icon}</span>} {compact ? "" : title}
                    </span>
                </div>
            </RouteLink>
        );
    }
    return () => {
        const compact = getCompact();
        return (
            <nav class={b("menu", { compact })}>
                {renderLink(
                    "blog",
                    <Lang token={`menu/blog`} />,
                    "📌",
                    compact
                )}
                {renderLink(
                    "about",
                    <Lang token={`menu/about`} />,
                    "👁",
                    compact
                )}
                {renderLink(
                    "opensource",
                    <Lang token={`menu/opensource`} />,
                    "🛠",
                    compact
                )}
                {renderLink(
                    "projects",
                    <Lang token={`menu/projects`} />,
                    "💡",
                    compact
                )}
                {renderLink(
                    "video",
                    <Lang token={`menu/video`} />,
                    "🎬",
                    compact
                )}
                {renderLink(
                    "books",
                    <Lang token={`menu/books`} />,
                    "📚",
                    compact
                )}
                {renderLink(
                    "physics",
                    <Lang token={`menu/physics`} />,
                    "🔬",
                    compact
                )}
                {/* 🎨 */}
                {renderLink(
                    "design",
                    <Lang token={`menu/design`} />,
                    "🚦",
                    compact
                )}
                {renderLink(
                    "travels",
                    <Lang token={`menu/travels`} />,
                    "🌄",
                    compact
                )}
                {renderLink(
                    "catalog",
                    <Lang token={`menu/catalog`} />,
                    "🔎",
                    compact
                )}
                <div class={b("compact")}>
                    <Button
                        class={b("compact-btn")}
                        view={"flat"}
                        on:click={() => setCompact(NOT)}
                    >
                        {compact ? "»»" : "««"}
                    </Button>
                </div>
                <div class={b("collapse-menu", { compact })}>
                    <Button
                        on:click={() => {
                            document.documentElement.classList.toggle(
                                "mobile-visible"
                            );
                        }}
                    >
                        <Lang token={`control/collapse-menu`} />
                    </Button>
                </div>
            </nav>
        );
    };
});

const Header = Component("Header", ({ state, hooks }) => {
    const [getTheme, setThemeState] = state(
        localStorage.getItem("theme") || "dark"
    );
    const [getLang, setLangState] = state(
        localStorage.getItem("lang") || defaultLang
    ) as StateClass<LangType>;

    hooks.mount(() => {
        setTheme();
    });

    function setTheme() {
        const theme = getTheme();
        localStorage.setItem("theme", theme);
        const classList = document.body.classList;
        if (theme === "light") {
            classList.add("theme_light");
        } else {
            classList.remove("theme_light");
        }
        window.dispatchEvent(new CustomEvent("theme", { detail: { theme } }));
    }

    function setLanguage() {
        const lang = getLang();
        localStorage.setItem("lang", lang);
        setLang(lang);
        window.dispatchEvent(new CustomEvent("update-lang"));
    }

    function toogleTheme() {
        setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
        setTheme();
    }

    function toogleLanguage(lang: LangType) {
        setLangState(lang);
        setLanguage();
    }

    function getIcon() {
        const theme = getTheme();
        const icon = theme === "dark" ? <Icon.Moon /> : <Icon.Sun />;
        return <div style={`width: 1em; height: 1em;`}>{icon}</div>;
    }

    return () => {
        const lang = getLang();
        return (
            <header class={b("header")}>
                <div class={b("menu-toggle")}>
                    <Button
                        on:click={() => {
                            document.documentElement.classList.toggle(
                                "mobile-visible"
                            );
                        }}
                    >
                        <div style={"width: 1em; height: 1em;"}>
                            <Icon.Bars />
                        </div>
                    </Button>
                </div>
                <RouteLink href={"/"}>
                    <h1 style={style({ textAlign: "center" })}>
                        <Lang token={`title`} />
                    </h1>
                </RouteLink>
                <Button on:click={() => toogleTheme()}>{getIcon()}</Button>
                <Select
                    className={b("lang")}
                    values={[
                        { value: "ru", title: <span>🇷🇺RU</span> },
                        { value: "en", title: <span>🇬🇧EN</span> },
                        { value: "it", title: <span>🇮🇹IT</span> },
                    ].map((e: any) => {
                        if (e.value === lang) {
                            e.selected = true;
                        }
                        return e;
                    })}
                    onUpdate={(e) => toogleLanguage(e as any)}
                />
            </header>
        );
    };
});

const Page = (
    <div class={b()}>
        {/* E.div.class(b('header-menu'))(
        E.div('Alexandr Nikolaichev'),
        E.div.class(b('scroll-top')).onClick(() => window.scrollTo({top: 0}))('▲ ▲ ▲')
    ), */}
        <Header />
        <Menu />
        <div class={b("menu-space")} />,
        <div
            class={b("menu-close-area")}
            on:click={() =>
                document.documentElement.classList.toggle("mobile-visible")
            }
        />
        <main class={b("content")}>
            <Switch routes={routes} />
        </main>
        <footer class={b("footer")}>
            <div>© 2019-2023 Alexandr Nikolaichev</div>
            <div style="display: flex; gap: 1em;">
                <a href={"https://github.com/nikalexxx"} target={"_blank"}>
                    Github
                </a>
                <a href={"https://t.me/nik_alex_flow"} target={"_blank"}>
                    Telegram
                </a>
            </div>
        </footer>
    </div>
);

// console.log({Page});

export default Page;
