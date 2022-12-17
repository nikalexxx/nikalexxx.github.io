import {logAllLevels, setLogger} from './utils/logger.js';


import {App} from './components/index.js';
import {DOM} from './utils';

setLogger({
    component: {
        props: {
            [logAllLevels]: true,
        },
        [logAllLevels]: true,
    },
});
setLogger(false); // for production

document.getElementById('root')!.append(DOM(App));
