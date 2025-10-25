import { bbm } from '@bookbox/preset-web';
import { resolve } from 'node:path';

const rootPath = resolve(import.meta.dirname, './book.bbm');
const schema = await bbm.readBook(rootPath);

export default schema;
