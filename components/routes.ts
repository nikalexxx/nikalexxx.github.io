import { About, Blog, Book, Books, Catalog, Colors, Design, GameOfLife, Physics, Post, Projects, StandardModel, Themes, Unicode } from "../pages";

import { E } from "../utils";
import { HighlightingText } from "./HighlightingText/HighlightingText";
import { Page404 } from '.';
import { Page404Symbol } from "../utils/router";

const example = `
function id(a) {
    console.log('a' + true);
    return a;
}
`;

const exampleLess = `
.highlighting-text {
    display: grid;
    grid-template-columns: auto 1fr;
    column-gap: 8px;

    &__t {
        // color: red;

        &_keyword {
            color: var(--color-violet-light);
        }

        &_operator {
            color: var(--color-cyan);
        }

        &_variable {
            color: var(--color-red-light);
        }

        &_class {
            color: var(--color-yellow-light);
        }
    }

    &__line {
        &:hover {
            background-color: var(--color-background-second);
        }
    }

    &__number {
    }

    code {
        white-space: pre-wrap;
        line-height: 1.5rem;
        font-size: 1em;
        font-family: 'Menlo', 'Courier New', Courier, monospace;
        overflow: scroll;

        border-radius: none;
        padding: none;
        margin: none;
        border: none;
    }
}
`;

export const routes = (params) => ({
    '/': Blog,
    about: About,
    design: Design,
    'design/colors': Colors,
    'design/themes': Themes,
    // 'my/:state': E.div(
    //     E.ul(
    //         E.li`шейдеры gpu для параллельных вычислений`,
    //         E.li`фракталы`,
    //         E.li`Комментарии через github api`,
    //         E.li`Калькулятор`,
    //         E.li`Построитель графиков`,
    //         E.li`Схема метро(позже интерактивная)`
    //     )
    // ),
    'my/:state': E.div(
        HighlightingText.text(example).lang('javascript')
    ),
    blog: Blog,
    'blog/:id': Post.id(params.id),
    books: Books,
    'books/:name': Book.name(params.name),
    'books/:name/:elem': Book.name(params.name).elem(params.elem),
    projects: Projects,
    'projects/unicode': Unicode,
    'projects/game-of-life': GameOfLife,
    physics: Physics,
    'physics/standard-model': StandardModel,
    catalog: Catalog,
    [Page404Symbol]: Page404,
});
