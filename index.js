import {Page} from './components/index.js';
import {setLogger, logAllLevels} from './utils/logger.js';
import {DOM} from './utils/element.js';

setLogger({
    component: {
        props: {
            [logAllLevels]: true
        }
    }
});
setLogger(false); // for production

document.getElementById('root').append(DOM(Page));
