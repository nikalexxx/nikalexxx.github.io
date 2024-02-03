import { getBookSchema } from '@bookbox/preset-web';
import { writeFileSync } from 'fs';

import blog from './index';

const check = new RegExp(`^${process.env.N ?? '.*'}$`);

for (const n of Object.keys(blog)) {
    if (blog[n as any as keyof typeof blog].type !== 'bookbox') continue;
    if (!check.test(n)) continue;
    import(`./data/${n}/index.ts`).then((file) => {
        const data = JSON.stringify(
            getBookSchema({ book: file.default }).schema,
            null,
            2
        );
        writeFileSync(`./data/${n}/schema.json`, data);
    });
}
