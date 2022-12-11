<<<<<<< HEAD
import './node_modules/katex/dist/katex.css';

import { logAllLevels, setLogger } from './utils/logger.js';

import { App } from './components/index.js';
import { DOM } from './utils';
=======
import {logAllLevels, setLogger} from './utils/logger.js';


import {App} from './components/index.js';
import {DOM} from './utils/element.js';
>>>>>>> master

setLogger({
    component: {
        props: {
            [logAllLevels]: true,
        },
        [logAllLevels]: true,
    },
});
setLogger(false); // for production

document.getElementById('root').append(DOM(App));
