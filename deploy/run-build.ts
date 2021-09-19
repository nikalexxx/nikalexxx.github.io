import ghpages from 'gh-pages';

const root = `${__dirname}/..`;
const targetBranch = 'build';

const errorCallback = (error: any) => console.error(error);

// собранные страницы
ghpages.publish(
    `${root}/dist`,
    {
        push: false,
        branch: targetBranch,
    },
    (error) => {
        errorCallback(error);
        addData();
    }
);

function addData() {
    // данные
    ghpages.publish(
        `${root}/data`,
        {
            dest: 'data',
            branch: targetBranch,
            push: false,
            add: true,
        },
        errorCallback
    );
}
