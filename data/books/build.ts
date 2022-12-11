import { getBookSchema } from '@bookbox/preset-web';
import { readdirSync, writeFileSync } from 'fs';

const watchFilePath = process.argv[2] || '';
const watchDir = watchFilePath.split('/')[3] || '';

const update = process.argv[3] || '';

const dirList = watchDir ? [watchDir] : readdirSync(`./data`, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

const getCommand = (dirName: string) => {
    const sourceDir = `./data/${dirName}`;
    return {
        command: async () => {
            const data = await import(`${sourceDir}/index.js`);
            writeFileSync(`${sourceDir}/schema.json`, JSON.stringify(getBookSchema({book: data.default}).schema, null, 2));
        },
    };
}

for (const dirName of dirList) {
    const {command} = getCommand(dirName);
    const now = Date.now();
    process.stdout.write(`compile ${dirName}`);
    command();
    if (update) {
        writeFileSync(update, '0');
    }
    process.stdout.write(` — \x1b[32mok\x1b[0m \x1b[36m${Math.ceil((Date.now() - now) / 1000)}s\x1b[0m\n`);

    // buildProcess.stdout.pipe(process.stdout);
    // buildProcess.stderr.pipe(process.stderr);
    // buildProcess.addListener("exit", copy);
}
