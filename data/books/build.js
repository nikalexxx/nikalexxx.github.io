const { exec, execSync } = require('child_process');

const { readdirSync } = require('fs');


const dirList = readdirSync(`${__dirname}/data`, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

const getCommand = dirName => {
    const sourceDir = `${__dirname}/data/${dirName}`;
    const outputDir = `${process.env.OUTPUT}/data/books/${dirName}`;
    const dataFiles = execSync(`find ${sourceDir}/** -name "*.svg"`)
        .toString()
        .split('\n')
        .filter(Boolean)
        .map(e => e.slice(sourceDir.length));
    return {
        command: `tsc ${sourceDir}/index.ts -m esnext --outDir ${outputDir}`,
        copy: () => {
            for (const path of dataFiles) {
                execSync(`cp ${sourceDir}${path} ${outputDir}${path}`);
            }
        }
    };
}

for (const dirName of dirList) {
    const {command, copy} = getCommand(dirName);
    console.log(command);
    const buildProcess = exec(command);
    buildProcess.stdout.pipe(process.stdout);
    buildProcess.addListener("exit", copy);
}
