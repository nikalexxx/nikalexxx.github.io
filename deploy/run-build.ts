import ghpages from 'gh-pages';

const root = `${__dirname}/..`;
const targetBranch = 'build';

const errorCallback = (path: string, error: any) => {
    if (error) {
        console.error(error);
    } else {
        console.log('\x1b[32m%s\x1b[0m', `${path} done!`);
    }
};

let stepIndex = 0;
const getStep = (path: string, options: ghpages.PublishOptions) => (
    callbacks?: (() => any)[]
) => () => {
    ghpages.publish(path, {...options, add: stepIndex > 0}, (error) => {
        errorCallback(path, error);
        if (!error) {
            stepIndex++;
            callbacks?.forEach((e) => e());
        }
    });
};

// собранные страницы
const addDist = getStep(`${root}/dist`, {
    push: false,
    branch: targetBranch,
});

// собранные страницы
const addBooks = getStep(`${root}/dist/books`, {
    dest: 'data/books',
    push: true,
    branch: targetBranch,
});

// данные
const addData = getStep(`${root}/data`, {
    dest: 'data',
    branch: targetBranch,
    push: false,
});


addDist([addData([addBooks()])])();
