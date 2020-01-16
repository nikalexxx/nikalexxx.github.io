import {
    E,
    M,
    Component,
    RouteLink,
    css,
    block,
    style
} from '../../utils/index.js';

import blog from '../../data/blog/index.js';
import {Button} from '../../blocks/index.js';

css(import.meta.url, 'Blog.less');

const b = block('blog');

const Blog = Component.Blog(({getState, setState, initState}) => {
    const total = Object.keys(blog).length;
    // console.log(`total ${total}`);

    return () => E.div.class(b())(
        Object.keys(blog).sort((keyA, keyB) => {
            const getMs = key => Number(new Date(blog[key].creationTime));
            return getMs(keyB) - getMs(keyA);
        })
        .map(key => {
            const {type, creationTime, title, tags} = blog[key];
            return E.div.class(b('post-card'))(
                E.h3.class(b('title'))(
                    title,
                    E.div.class(b('read-button'))(
                        RouteLink.href(`blog/${key}`)(
                            Button('Читать')
                        )
                    )
                ),
                E.p(
                    E.span.class(b('time'))(
                        (new Date(creationTime)).toLocaleString('ru', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            timezone: 'UTC',
                            hour: 'numeric',
                            minute: 'numeric',
                            second: 'numeric'
                        })
                    )
                ),
                E.p(
                    tags.map(tag => E.div.class(b('tag'))(tag))
                )
            )
        })
    );
});

export default Blog;
