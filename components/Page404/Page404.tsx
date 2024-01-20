import "./Page404.less";

import { RouteLink, block } from "../../utils";
import { Component } from "parvis";

const b = block("page-404");

export const Page404 = Component("Page404", () => () => (
    <div class={b()}>
        <div>
            <div class={b("header")}>404</div>
            <p>
                Страница <i>{document.location.href}</i> не найдена
            </p>
            <br />
            <p>
                <RouteLink href={"/"}>На главную страницу</RouteLink>
            </p>
        </div>
    </div>
));
