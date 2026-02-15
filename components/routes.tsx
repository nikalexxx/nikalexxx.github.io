import { Page404Symbol } from "../utils/router";

type P = Record<string, string>;

export const routes = {
    "/": () => import('../pages/blog').then(m => m.Blog).then(C => <C />),
    about: () => import('../pages/about').then(m => m.About),
    opensource: () => import('../pages/opensource').then(m => m.Opensource).then(C => <C />),
    design: () => import('../pages/design').then(m => m.Design).then(C => <C />),
    "design/colors": () => import('../pages/design/colors').then(m => m.Colors).then(C => <C />),
    "design/themes": () => import('../pages/design/themes').then(m => m.Themes).then(C => <C />),
    "design/components": () => import('../pages/design/components').then(m => m.Components).then(C => <C />),
    // 'plans': E.div(
    //     E.ul(
    //         E.li`шейдеры gpu для параллельных вычислений`,
    //         E.li`фракталы`,
    //         E.li`Комментарии через github api`,
    //         E.li`Калькулятор`,
    //         E.li`Построитель графиков`,
    //         E.li`Схема метро(позже интерактивная)`
    //     )
    // ),
    blog: () => import('../pages/blog').then(m => m.Blog).then(C => <C />),
    "blog/:id": (p: P) => import('../pages/blog/_id').then(m => m.Post).then(C => <C id={p.id}/>),
    books: () => import('../pages/books').then(m => m.Books).then(C => <C />),
    "books/:name": (p: P) => import('../pages/books').then(m => m.Book).then(C => <C name={p.name}/>),
    projects: () => import('../pages/projects').then(m => m.Projects).then(C => <C />),
    "projects/unicode": () => import('../pages/projects/unicode').then(m => m.Unicode).then(C => <C />),
    "projects/game-of-life":  () => import('../pages/projects/game-of-life').then(m => m.GameOfLife).then(C => <C />),
    "projects/blood-types": () => import('../pages/projects/blood-types/BloodTypes').then(m => m.BloodTypes).then(C => <C />),
    "projects/color-function": () => import('../pages/projects/color-function').then(m => m.ColorFunction).then(C => <C />),
    physics: () => import('../pages/physics').then(m => m.Physics).then(C => <C />),
    "physics/standard-model": () => import('../pages/physics/standard-model').then(m => m.StandardModel).then(C => <C />),
    "physics/gravitation": () => import('../pages/physics/gravitation').then(m => m.Gravitation).then(C => <C />),
    "physics/qcd": () => import('../pages/physics/qcd').then(m => m.QCD).then(C => <C />),
    travels: () => import('../pages/travels').then(m => m.Travels).then(C => <C />),
    "travels/altai":() => import('../pages/travels/altai').then(m => m.Altai).then(C => <C />),
    "travels/krasnodar-krai": () => import('../pages/travels/krasnodar-krai').then(m => m.KrasnodarKrai).then(C => <C />),
    "travels/crimea": () => import('../pages/travels/crimea').then(m => m.Crimea).then(C => <C />),
    "travels/smolensk": () => import('../pages/travels/smolensk').then(m => m.Smolensk).then(C => <C />),
    reports: () => import('../pages/reports').then(m => m.Reports).then(C => <C />),
    video: () => import('../pages/video').then(m => m.Video).then(C => <C />),
    catalog: () => import('../pages/catalog').then(m => m.Catalog).then(C => <C />),
    [Page404Symbol]: () => import('./Page404/Page404').then(m => m.Page404).then(C => <C />),
};
