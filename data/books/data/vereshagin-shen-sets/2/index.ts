import { BookApi } from '@bookbox/preset-web';
import { getCustomElements } from '../elements.js';
import paragraph1 from './1/index.js';
import paragraph10 from './10/index.js';
import paragraph11 from './11/index.js';
import paragraph12 from './12/index.js';
import paragraph13 from './13/index.js';
import paragraph2 from './2/index.js';
import paragraph3 from './3/index.js';
import paragraph4 from './4/index.js';
import paragraph5 from './5/index.js';
import paragraph6 from './6/index.js';
import paragraph7 from './7/index.js';
import paragraph8 from './8/index.js';
import paragraph9 from './9/index.js';

export default (api: BookApi) => {
    const { book } = api;

    const {chapter} = getCustomElements(api);
    return book`
${chapter`Упорядоченные множества`}


${paragraph1(api)}


${paragraph2(api)}


${paragraph3(api)}


${paragraph4(api)}


${paragraph5(api)}


${paragraph6(api)}


${paragraph7(api)}


${paragraph8(api)}


${paragraph9(api)}


${paragraph10(api)}


${paragraph11(api)}


${paragraph12(api)}


${paragraph13(api)}
`;
};
