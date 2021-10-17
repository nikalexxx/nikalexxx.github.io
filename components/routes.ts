import {
    About,
    Altai,
    Blog,
    Book,
    Books,
    Catalog,
    Colors,
    Components,
    Crimea,
    Design,
    GameOfLife,
    KrasnodarKrai,
    Physics,
    Post,
    Projects,
    Reports,
    Smolensk,
    StandardModel,
    Themes,
    Travels,
    Unicode,
} from '../pages';

import { E } from '../utils';
import { Page404 } from '.';
import { Page404Symbol } from '../utils/router';
import { BloodTypes } from '../pages/projects/blood-types/BloodTypes';

export const routes = (params) => ({
    '/': Blog,
    about: About,
    design: Design,
    'design/colors': Colors,
    'design/themes': Themes,
    'design/components': Components,
    'plans': E.div(
        E.ul(
            E.li`шейдеры gpu для параллельных вычислений`,
            E.li`фракталы`,
            E.li`Комментарии через github api`,
            E.li`Калькулятор`,
            E.li`Построитель графиков`,
            E.li`Схема метро(позже интерактивная)`
        )
    ),
    blog: Blog,
    'blog/:id': Post.id(params.id),
    books: Books,
    'books/:name': Book.name(params.name),
    'books/:name/:elem': Book.name(params.name).elem(params.elem),
    projects: Projects,
    'projects/unicode': Unicode,
    'projects/game-of-life': GameOfLife,
    'projects/blood-types': BloodTypes,
    physics: Physics,
    'physics/standard-model': StandardModel,
    travels: Travels,
    'travels/altai': Altai,
    'travels/krasnodar-krai': KrasnodarKrai,
    'travels/crimea': Crimea,
    'travels/smolensk': Smolensk,
    reports: Reports,
    catalog: Catalog,
    [Page404Symbol]: Page404,
});
