import "./Blog.less";

import { RouteLink, block, hash, memo } from "../../utils";

import blog from "../../data/blog";
import { PageGrid, Tile } from "../../components";
import { postList } from "./model";
import { Component } from "parvis";

const b = block("blog");

const d = (f: string) => parseInt(f, 16) / 16;

const getCircles = (title: string) => {
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
        .map((e) => (
            <div
                style={`
                position: absolute;
                border-radius: 50%;
                height: ${e.size * 180}%;
                width: ${e.size * 180}%;
                top: ${e.y - e.size * 50}%;
                left: ${e.x - e.size * 50}%;
                box-shadow: 0 0 32px 4px hsl(${e.color}, 90%, 60%);
            `}
            />
        ));
};

const memoGetCircles = memo(getCircles);

const newMessage = (
    <span>Моделирование гравитации по теории тяготения Ньютона</span>
);

const newMessageLink = "physics/gravitation";

const messageDateStr = "2021-11-30";
const messageDate = new Date(messageDateStr);
const needNewMessage = () =>
    Math.floor((+new Date() - +messageDate) / 86400000) < 14;

const DateTime = Component<{ time: string }>("DateTime", ({ props }) => () => {
    const { time } = props();
    return (
        <span class={b("time")}>
            {new Date(time).toLocaleString("ru", {
                year: "numeric",
                month: "long",
                day: "numeric",
                timeZone: "UTC",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
            })}
        </span>
    );
});

const Blog = Component("Blog", ({ state, hooks }) => {
    const [getActiveTags, setActiveTags] = state(new Set<string>());

    function onTagClick(tagName: string) {
        const activeTags = getActiveTags();
        if (tagName === "all") {
            setActiveTags(new Set());
            return;
        }
        if (activeTags.has(tagName)) {
            activeTags.delete(tagName);
        } else {
            activeTags.add(tagName);
        }
        setActiveTags(new Set(activeTags));
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
        }, {} as Record<string, number>);

    const sortedTags = Object.keys(allTags).sort(
        (tagA, tagB) => allTags[tagB] - allTags[tagA]
    );

    return () => {
        const activeTags = getActiveTags();
        let blogKeys = [...postList];
        if (activeTags.size > 0) {
            blogKeys = blogKeys.filter((key) => {
                const { tags } = blog[key];
                return tags.some((tag) => activeTags.has(tag));
            });
        }
        return (
            <div>
                {needNewMessage() && (
                    <div style={`padding: 8px;`}>
                        <RouteLink href={newMessageLink}>
                            <Tile className={b("new")}>
                                <span class={b("new-mark")}>NEW!</span>
                                {newMessage}
                            </Tile>
                        </RouteLink>
                    </div>
                )}
                <div class={b("blog")}>
                    <div class={b("list")} _forceUpdate={true}>
                        <PageGrid itemWidth={300}>
                            {blogKeys.map((key) => {
                                const { creationTime, title, tags, image } =
                                    blog[key];
                                const circles = image
                                    ? []
                                    : memoGetCircles(title);
                                return (
                                    <RouteLink href={`blog/${key}`}>
                                        <Tile className={b("tile")}>
                                            <div class={b("post-card")}>
                                                <div
                                                    class={b("image")}
                                                    style={
                                                        image &&
                                                        !image.endsWith("svg")
                                                            ? `background: url(${image});background-size:cover`
                                                            : ""
                                                    }
                                                >
                                                    {image &&
                                                        image.endsWith(
                                                            "svg"
                                                        ) && (
                                                            <img
                                                                style={`max-width: 100%;max-height:100%`}
                                                                src={image}
                                                            />
                                                        )}
                                                    {!image && circles}
                                                    <div
                                                        class={b(
                                                            "image-opacity"
                                                        )}
                                                    />
                                                </div>
                                                <div class={b("title")}>
                                                    <h3>{title}</h3>
                                                </div>

                                                <p>
                                                    <DateTime
                                                        time={creationTime}
                                                    />
                                                </p>

                                                <div class={b("tags")}>
                                                    {tags.map((tag) => (
                                                        <div
                                                            class={b("tag", {
                                                                active: activeTags.has(
                                                                    tag
                                                                ),
                                                            })}
                                                            data-tag={tag}
                                                            on:click={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                onTagClick(
                                                                    e
                                                                        .currentTarget
                                                                        .dataset
                                                                        .tag ??
                                                                        ""
                                                                );
                                                            }}
                                                        >
                                                            {tag}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </Tile>
                                    </RouteLink>
                                );
                            })}
                        </PageGrid>
                    </div>
                    <div>
                        <div class={b("tag-panel")}>
                            <div
                                style={`font-size: 1.2em`}
                                class={b("tag", {
                                    active: activeTags.size === 0,
                                })}
                                on:click={() => onTagClick("all")}
                            >
                                <i>all</i>
                            </div>
                            {sortedTags.map((tag) => (
                                <div
                                    data-tag={tag}
                                    title={allTags[tag] + ""}
                                    style={`font-size: calc(0.8em + (${
                                        (allTags[tag] - 1) / maxTagCount
                                    } * 0.4em))`}
                                    class={b("tag", {
                                        active: activeTags.has(tag),
                                    })}
                                    on:click={(e) =>
                                        onTagClick(
                                            e.currentTarget.dataset.tag ?? ""
                                        )
                                    }
                                >
                                    {tag}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };
});

export default Blog;
