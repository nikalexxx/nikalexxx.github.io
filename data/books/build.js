const { exec, execSync } = require('child_process');
const { readdirSync, writeFileSync } = require('fs');

const watchFilePath = process.argv[2] || '';
const watchDir = watchFilePath.split('/')[3] || '';

const update = process.argv[3] || '';

const dirList = watchDir ? [watchDir] : readdirSync(`${__dirname}/data`, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

const getCommand = dirName => {
    const sourceDir = `${__dirname}/data/${dirName}`;
    const outputDir = `${process.env.OUTPUT}/data/books/${dirName}`;
    const dataFiles = execSync(`find ${sourceDir}/** -name "*.svg" -o -name "*.jpg" -o -name "*.ogg"`)
        .toString()
        .split('\n')
        .filter(Boolean)
        .map(e => e.slice(sourceDir.length));
    return {
        command: `npx tsc ${sourceDir}/index.ts --target esnext --outDir ${outputDir}`,
        copy: () => {
            for (const path of dataFiles) {
                execSync(`cp ${sourceDir}${path} ${outputDir}${path}`);
            }
        }
    };
}

for (const dirName of dirList) {
    const {command, copy} = getCommand(dirName);
    const now = Date.now();
    process.stdout.write(`compile ${dirName}`);
    execSync(command);
    copy();
    if (update) {
        writeFileSync(update, '0');
    }
    process.stdout.write(` — \x1b[32mok\x1b[0m \x1b[36m${Math.ceil((Date.now() - now) / 1000)}s\x1b[0m\n`);

    // buildProcess.stdout.pipe(process.stdout);
    // buildProcess.stderr.pipe(process.stderr);
    // buildProcess.addListener("exit", copy);
}
