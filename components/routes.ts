import { About, Blog, Catalog, Colors, Design, GameOfLife, Physics, Post, Projects, StandardModel, Themes, Unicode } from "../pages";

import { Page404 } from '.';
import { Page404Symbol } from "../utils/router";

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
    blog: Blog,
    'blog/:id': Post.id(params.id),
    projects: Projects,
    'projects/unicode': Unicode,
    'projects/game-of-life': GameOfLife,
    physics: Physics,
    'physics/standard-model': StandardModel,
    catalog: Catalog,
    [Page404Symbol]: Page404,
});
