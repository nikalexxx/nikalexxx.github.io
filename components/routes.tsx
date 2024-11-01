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
    Gravitation,
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
    Video,
    BloodTypes,
    Opensource,
    ColorFunction,
} from "../pages";

import { Page404 } from "./Page404/Page404";
import { Page404Symbol } from "../utils/router";

export const routes = (params: Record<string, string>) => ({
    "/": <Blog />,
    about: About,
    opensource: <Opensource />,
    design: <Design />,
    "design/colors": <Colors />,
    "design/themes": <Themes />,
    "design/components": <Components />,
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
    blog: <Blog />,
    "blog/:id": <Post id={params.id as any} />,
    books: <Books />,
    "books/:name": <Book name={params.name} />,
    projects: <Projects />,
    "projects/unicode": <Unicode />,
    "projects/game-of-life": <GameOfLife />,
    "projects/blood-types": <BloodTypes />,
    "projects/color-function": <ColorFunction />,
    physics: <Physics />,
    "physics/standard-model": <StandardModel />,
    "physics/gravitation": <Gravitation />,
    travels: <Travels />,
    "travels/altai": <Altai />,
    "travels/krasnodar-krai": <KrasnodarKrai />,
    "travels/crimea": <Crimea />,
    "travels/smolensk": <Smolensk />,
    reports: <Reports />,
    video: <Video />,
    catalog: <Catalog />,
    [Page404Symbol]: <Page404 />,
});
