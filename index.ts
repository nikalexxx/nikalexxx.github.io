
/// <reference path="./typings.d.ts" />

import { logAllLevels, setLogger } from "./utils/logger.js";

import { App } from "./components/index.js";
import { debug, render } from "parvis";

setLogger({
    component: {
        props: {
            [logAllLevels]: true,
        },
        [logAllLevels]: true,
    },
});

setLogger(false); // for production

debug(true);

render("#root", App);
