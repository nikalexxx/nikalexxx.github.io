import { bbm, core, js } from '@bookbox/preset-web';
import { writeFileSync, existsSync } from 'fs';

import blog from './index';

const check = new RegExp(`^${process.env.N ?? '.*'}$`);
const write = (schema: core.BookSchema, n: string) => writeFileSync(`./data/${n}/schema.json`, JSON.stringify(schema, null, 2));

for (const n of Object.keys(blog)) {
    if (blog[n as any as keyof typeof blog].type !== 'bookbox') continue;
    if (!check.test(n)) continue;
    const bbmVersion = `./data/${n}/post.bbm`;
    if (existsSync(bbmVersion)) {
        bbm.readBook(bbmVersion).then(schema => write(schema, n));
    }
    const jsVersion = `./data/${n}/index.ts`;
    if (existsSync(jsVersion)) {
        import(jsVersion).then((file) => {
            write(js.getBookSchema({ book: file.default }).schema, n)
        });
    }
}
