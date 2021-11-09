import blog from '../../data/blog';

const getMs = (key: keyof typeof blog) =>
    Number(new Date(blog[key].creationTime));

export const postList = ((Object.keys(
    blog
) as any) as (keyof typeof blog)[]).sort((keyA, keyB) => {
    return getMs(keyB) - getMs(keyA);
});

export const postOrder = postList.reduce((obj, name, i) => {
    obj[name] = i;
    return obj;
}, {} as Record<keyof typeof blog, number>);
