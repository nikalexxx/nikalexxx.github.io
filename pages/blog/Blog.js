import './Blog.less';

import { Component, E, RouteLink, block } from '../../utils';

import blog from '../../data/blog';

const b = block('blog');

const DateTime = Component.DateTime(({ props }) => () => {
    const { time } = props();
    return E.span.class(b('time'))(
        new Date(time).toLocaleString('ru', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timezone: 'UTC',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
        })
    );
});

const Blog = Component.Blog(({ state }) => {
    state.init({
        activeTags: new Set(),
    });

    function onTagClick(tagName) {
        const { activeTags } = state();
        if (tagName === 'all') {
            state.set({ activeTags: new Set() });
            return;
        }
        if (activeTags.has(tagName)) {
            activeTags.delete(tagName);
        } else {
            activeTags.add(tagName);
        }
        state.set({ activeTags });
    }

    const allTags = Object.values(blog)
        .map((e) => e.tags)
        .flat()
        .reduce((obj, tag) => {
            if (!obj[tag]) {
                obj[tag] = 0;
            }
            obj[tag]++;
            return obj;
        }, {});

    const sortedTags = Object.keys(allTags).sort(
        (tagA, tagB) => allTags[tagB] - allTags[tagA]
    );

    return () => {
        const { activeTags } = state();
        let blogKeys = Object.keys(blog);
        if (activeTags.size > 0) {
            blogKeys = blogKeys.filter((key) => {
                const { tags } = blog[key];
                return tags.some((tag) => activeTags.has(tag));
            });
        }
        console.log({blogKeys});
        return E.div.class(b())(
            E.div.class(b('tag-panel'))(
                E.div
                    .class(b('tag', { active: activeTags.size === 0 }))
                    .onClick(() => onTagClick('all'))(E.i('all')),
                sortedTags.map((tag) =>
                    E.div['data-tag'](tag)
                        .class(b('tag', { active: activeTags.has(tag) }))
                        .onClick((e) => onTagClick(e.target.dataset.tag))(tag)
                )
            ),
            E.div._forceUpdate(true)(
                blogKeys
                    .sort((keyA, keyB) => {
                        const getMs = (key) =>
                            Number(new Date(blog[key].creationTime));
                        return getMs(keyB) - getMs(keyA);
                    })
                    .map((key) => {
                        const { creationTime, title, tags } = blog[key];
                        return E.div.class(b('post-card'))(
                            E.div.class(b('title'))(
                                E.h3(RouteLink.href(`blog/${key}`)(title))
                            ),
                            E.p(DateTime.time(creationTime)),
                            E.p(
                                tags.map((tag) =>
                                    E.div
                                        .class(
                                            b('tag', {
                                                active: activeTags.has(tag),
                                            })
                                        )
                                        ['data-tag'](tag)
                                        .onClick((e) =>
                                            onTagClick(e.target.dataset.tag)
                                        )(tag)
                                )
                            )
                        );
                    })
            )
        );
    };
});

export default Blog;
