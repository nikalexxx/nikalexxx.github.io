import './Blog.less';

import { Component, E, RouteLink, block, hash } from '../../utils';

import blog from '../../data/blog';
import { PageGrid, Tile } from '../../components';
import { postList } from './model';

const b = block('blog');

const d = (f) => parseInt(f, 16) / 16;

const getCircles = (title) => {
    const h1 = hash(title);
    const h = h1 + hash(h1 + title);
    const circles = [];
    for (let i = 0; i < 4; i++) {
        const c = i * 4;
        const x = d(h[c]) * 100;
        const y = d(h[c + 1]) * 100;
        const size = 0.3 + d(h[c + 2]) * 0.7;
        const color = Math.trunc(360 * d(h[c + 3]));
        circles.push({ x, y, size, color });
    }
    return circles
        .sort((a1, a2) => a2.size - a1.size)
        .map((e) =>
            E.div.style`
                position: absolute;
                border-radius: 50%;
                height: ${e.size * 180}%;
                width: ${e.size * 180}%;
                top: ${e.y - e.size * 50}%;
                left: ${e.x - e.size * 50}%;
                border: 2px solid gray;
                border-color: hsl(${e.color}, 50%, 60%);
            `()
        );
};

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

    let maxTagCount = 0;
    const allTags = Object.values(blog)
        .map((e) => e.tags)
        .flat()
        .reduce((obj, tag) => {
            if (!obj[tag]) {
                obj[tag] = 0;
            }
            obj[tag]++;
            maxTagCount = Math.max(maxTagCount, obj[tag]);
            return obj;
        }, {});

    const sortedTags = Object.keys(allTags).sort(
        (tagA, tagB) => allTags[tagB] - allTags[tagA]
    );

    return () => {
        const { activeTags } = state();
        let blogKeys = [...postList];
        if (activeTags.size > 0) {
            blogKeys = blogKeys.filter((key) => {
                const { tags } = blog[key];
                return tags.some((tag) => activeTags.has(tag));
            });
        }
        return E.div.class(b())(
            E.div.class(b('list'))._forceUpdate(true)(
                PageGrid.itemWidth(300)(
                    blogKeys.map((key) => {
                        const { creationTime, title, tags, image } = blog[key];
                        const circles = image ? [] : getCircles(title);
                        return RouteLink.href(`blog/${key}`)(
                            Tile.className(b('tile'))(
                                E.div.class(b('post-card'))(
                                    E.div
                                        .class(b('image'))
                                        .style(
                                            image && !image.endsWith('svg')
                                                ? `background: url(${image});background-size:cover`
                                                : ''
                                        )(
                                        image &&
                                            image.endsWith('svg') &&
                                            E.img
                                                .style`max-width: 100%;max-height:100%`.src(
                                                image
                                            ),
                                        !image && circles,
                                        E.div.class(b('image-opacity'))()
                                    ),
                                    E.div.class(b('title'))(E.h3(title)),

                                    E.p(DateTime.time(creationTime)),
                                    E.div.class(b('tags'))(
                                        tags.map((tag) =>
                                            E.div
                                                .class(
                                                    b('tag', {
                                                        active: activeTags.has(
                                                            tag
                                                        ),
                                                    })
                                                )
                                                ['data-tag'](tag)
                                                .onClick((e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    onTagClick(
                                                        e.target.dataset.tag
                                                    );
                                                })(tag)
                                        )
                                    )
                                )
                            )
                        );
                    })
                )
            ),
            E.div.class(b('panel'))(
                E.div.class(b('tag-panel'))(
                    E.div.style`font-size: 1.2em`
                        .class(b('tag', { active: activeTags.size === 0 }))
                        .onClick(() => onTagClick('all'))(E.i('all')),
                    sortedTags.map((tag) =>
                        E.div['data-tag'](tag)
                            .title(allTags[tag])
                            .style(
                                `font-size: calc(0.8em + (${
                                    (allTags[tag] - 1) / maxTagCount
                                } * 0.4em))`
                            )
                            .class(b('tag', { active: activeTags.has(tag) }))
                            .onClick((e) => onTagClick(e.target.dataset.tag))(
                            tag
                        )
                    )
                )
            )
        );
    };
});

export default Blog;
