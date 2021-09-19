import ghpages from 'gh-pages';

const root = '..';

// собранные страницы
ghpages.publish(`${root}/dist`, {
    push: false,
});

// данные
ghpages.publish(`${root}/data`, {
    dest: 'data',
    push: false,
    add: true,
});
