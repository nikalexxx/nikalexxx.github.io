import blog from '../../data/blog';

export type PostId = `${keyof typeof blog}`;

const getMs = (key: PostId) => Number(new Date(blog[key].creationTime));

export const postList: PostId[] = Object.keys(blog).sort((keyA, keyB) => {
    return getMs(keyB as PostId) - getMs(keyA as PostId);
}) as PostId[];

export const postOrder = postList.reduce((obj, name, i) => {
    obj[name] = i;
    return obj;
}, {} as Record<PostId, number>);
