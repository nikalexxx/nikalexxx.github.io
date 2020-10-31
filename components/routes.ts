import {About, Blog, Colors, Design, GameOfLife, Page404, Physics, Post, Projects, StandardModel, Unicode} from ".";

import { Page404Symbol } from "../utils/router";

export const routes = (params) => ({
    '/': Blog,
    about: About,
    design: Design,
    'design/colors': Colors,
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
    [Page404Symbol]: Page404,
});
