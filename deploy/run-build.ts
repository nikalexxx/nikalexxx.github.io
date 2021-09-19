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

const getStep = (path: string, options: ghpages.PublishOptions) => (
    callbacks?: (() => any)[]
) => () => {
    ghpages.publish(path, options, (error) => {
        errorCallback(path, error);
        if (!error) {
            callbacks?.forEach((e) => e());
        }
    });
};

// собранные страницы
const addDist = getStep(`${root}/dist`, {
    add: true,
    push: true,
    branch: targetBranch,
});

// данные
const addData = getStep(`${root}/data`, {
    dest: 'data',
    branch: targetBranch,
    push: false,
});


addData([addDist()])();
