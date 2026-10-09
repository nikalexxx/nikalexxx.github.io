import { bbm } from '@bookbox/preset-web';
import { fileURLToPath } from 'node:url';

const rootPath = fileURLToPath(new URL('./book.bbm', import.meta.url));
const schema = await bbm.readBook(rootPath);

export default schema;
