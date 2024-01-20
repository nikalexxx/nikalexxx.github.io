import "./Post.less";

import { Breadcrumbs, Page404, BookBox } from "../../../components";
import { block, RouteLink, textWithLink } from "../../../utils";

import { Button, Lang, Spin } from "../../../blocks";
import blog from "../../../data/blog";
import { PostId, postList, postOrder } from "../model";
import { GithubApi } from "../../../services/api";
import { createHtmlBook } from "@bookbox/preset-web";
import { BookData } from "@bookbox/core";
import { Component, TemplateTree } from "parvis";
import { Comment } from "../../../services/api/github/comments";

const b = block("post");

interface Props {
    id: PostId;
}

const Post = Component<Props>("Post", ({ props, state, hooks }) => {
    const [getText, setText] = state<string | null | BookData<string>>(null);
    const [getComments, setComments] = state<Comment[] | null | string>(null);

    function loadPost() {
        const { id } = props();
        if (!blog.hasOwnProperty(id)) return;

        setText(null);

        const { type, comments } = blog[id];
        console.log({type, id});
        const path = (file: string) =>
            `../data/blog/data/${id}/${file}?r=${window.appVersion}`;
        if (type === "html") {
            fetch(path("index.html"))
                .then((e) => {
                    // console.log(e.clone().blob());
                    return e.blob();
                })
                .then((data) => {
                    return "html" || data.text();
                })
                .then((text) => {
                    // console.log(text);
                    setText(text);
                });
        } else if (type === "bookbox") {
            fetch(path("schema.json"))
                .then((data) => data.json())
                .then((data) => {
                    console.log("book loaded", data);
                    setText(
                        createHtmlBook({
                            schema: data,
                            externalBuilder: {
                                parvis: {
                                    local:
                                        ({ key = "" }) =>
                                        ({ children, store }) => {
                                            const rawChildren =
                                                store.elementsByKeys[key]
                                                    .children;
                                            const id = `parvis-${key}`;
                                            eval(`window.setTimeout(() => {
                                                    const el = document.getElementById(id);
                                                    if (!el || el.childNodes.length > 0) return;
                                                    el.append(
                                                        DOM(
                                                            (${rawChildren.join(
                                                                ""
                                                            )})({ E, Component })
                                                        )
                                                    );
                                                }, 100);`);
                                            return `
                                                <div id="${id}"></div>
                                            `;
                                        },
                                },
                            },
                        })
                    );
                })
                .catch((e) => {
                    console.error(e);
                    setText("Ошибка загрузки контента");
                });
        }
        const existComments = comments && comments.githubIssue;
        if (existComments) {
            GithubApi.getIssueComments(
                "nikalexxx",
                "nikalexxx.github.io",
                String(comments.githubIssue)
            )
                .then((list) => setComments(list))
                .catch((e) => {
                    console.error(e);
                    setComments("Ошибка получения комментариев");
                });
        } else {
            setComments("Комментарии для данного поста отключены");
        }
    }

    hooks.mount(() => {
        loadPost();
    });

    hooks.effect(() => {
        console.log('change', props.id())
        loadPost();
    }, [props.id]);

    return () => {
        const { id } = props();
        if (!blog.hasOwnProperty(id)) return <Page404 />;
        console.log('render', props.id())


        const { type, comments: blogComments } = blog[id];
        const { title, creationTime } = blog[id];
        const text = getText();
        const comments = getComments();
        const template = (children: TemplateTree) => (
            <div class={b("content")}>{children}</div>
        );
        let elem;
        if (type === "html") {
            const iframe = (
                <iframe
                    id={`iframe-post-${id}`}
                    src={`/data/blog/data/${id}/index.${type}`}
                    style={
                        "width: 100%; border:none; object-fit: fill; height: 100vh;"
                    }
                />
            );
            setTimeout(() => {
                const iframeElem = document.getElementById(
                    `iframe-post-${id}`
                )!;
                iframeElem.style.height =
                    (iframeElem as any).contentWindow.document.body
                        .clientHeight +
                    100 +
                    "px";
            }, 300);
            elem = template(iframe);
        } else if (type === "bookbox") {
            console.log({ text });
            elem = template(
                text ? (
                    <BookBox
                        bookData={text as any}
                        name={`post-${id}`}
                        options={{
                            settingsOptions: {
                                viewTumbler: false,
                                contents: false,
                                design: false,
                                media: false,
                            },
                        }}
                        _debug
                    />
                ) : null
            );
        } else {
            elem = "Ошибка несоответствия типа контента";
        }

        return (
            <div class={b()}>
                <Breadcrumbs
                    items={[
                        [<Lang token={`menu/blog`} />, "blog"],
                        [title, `blog/${id}`],
                    ]}
                />
                <h2>{title}</h2>
                <em>{prettyDate(new Date(creationTime))}</em>
                <span style={`margin-left: 16px`} />
                <a
                    href={`https://github.com/nikalexxx/nikalexxx.github.io/tree/master/data/blog/data/${id}`}
                    style={"white-space: nowrap;"}
                >
                    Исходный код
                </a>
                {text === null && (
                    <div class={b("loading")}>
                        <Spin size={"xl"} />
                    </div>
                )}
                <div class={b("container")}>{elem}</div>
                <div class={b("nav")}>
                    {postOrder[id] < postList.length - 1 ? (
                        <RouteLink href={`blog/${postList[postOrder[id] + 1]}`}>
                            <div class={b("link")}>← Предыдущий пост</div>
                        </RouteLink>
                    ) : (
                        <div />
                    )}
                    {postOrder[id] > 0 ? (
                        <RouteLink href={`blog/${postList[postOrder[id] - 1]}`}>
                            <div class={b("link")}>Следующий пост →</div>
                        </RouteLink>
                    ) : (
                        <div />
                    )}
                </div>
                <br />
                <div class={b("comments")}>
                    <div class={b("comments-title")}>
                        <em style={`margin-right: 8px`}>Комментарии</em>
                        {blogComments && blogComments.githubIssue && (
                            <a
                                href={`https://github.com/nikalexxx/nikalexxx.github.io/issues/${blogComments.githubIssue}`}
                            >
                                <Button>Оставить комментарий (Github)</Button>
                            </a>
                        )}
                    </div>
                    {comments === null && <Spin size={`s`} />}
                    {Array.isArray(comments) &&
                        comments.map((comment) => (
                            <div class={b("comment")}>
                                <div class={b("comment-header")}>
                                    <a
                                        href={comment.user.html_url}
                                        target={"_blank"}
                                    >
                                        <div class={b("user")}>
                                            <img
                                                class={b("user-logo")}
                                                src={comment.user.avatar_url}
                                            />
                                            {comment.user.login}
                                        </div>
                                    </a>
                                    <em class={b("comment-date")}>
                                        {prettyDate(
                                            new Date(comment.created_at)
                                        )}
                                    </em>
                                </div>

                                <pre>
                                    {textWithLink(`\n${comment.body}`).map(
                                        ({ type, body }) =>
                                            type === "link" ? (
                                                <a href={body}>{body}</a>
                                            ) : (
                                                body
                                            )
                                    )}
                                </pre>
                            </div>
                        ))}
                    {typeof comments === "string" && comments}
                </div>
            </div>
        );
    };
});

export default Post;

function prettyDate(date: Date) {
    return date.toLocaleString("ru", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
    });
}
