import blog from '../../data/blog';

const getMs = (key) => Number(new Date(blog[key].creationTime));

export const postList = Object.keys(blog).sort((keyA, keyB) => {
    return getMs(keyB) - getMs(keyA);
});

export const postOrder = postList.reduce((obj, name, i) => {
    obj[name] = i;
    return obj;
}, {});
