import './Post.less';

import { Breadcrumbs, Page404, BookBox } from '../../../components';
import { Component, E, block, RouteLink, textWithLink } from '../../../utils';

import { Button, Lang, Spin } from '../../../blocks';
import blog from '../../../data/blog';
import { postList, postOrder } from '../model';
import { GithubApi } from '../../../services/api';
import { createHtmlBook } from '@bookbox/preset-web';

const b = block('post');

const Post = Component.Post(({ props, state, hooks: { didMount } }) => {
    state.init({
        text: null,
        comments: null,
    });

    didMount(() => {
        const { id } = props();
        if (!blog.hasOwnProperty(id)) return;

        const { type, comments } = blog[id];
        const path = (file) =>
            `../data/blog/data/${id}/${file}?r=${window.appVersion}`;
        if (type === 'html') {
            fetch(path('index.html'))
                .then((e) => {
                    // console.log(e.clone().blob());
                    return e.blob();
                })
                .then((data) => {
                    return 'html' || data.text();
                })
                .then((text) => {
                    // console.log(text);
                    state.set({ text: text });
                });
        } else if (type === 'bookbox') {
            fetch(path('schema.json'))
                .then((data) => data.json())
                .then((data) => {
                    // console.log(data);
                    state.set({
                        text: createHtmlBook({
                            schema: data,
                            externalBuilder: {
                                parvis: {
                                    local:
                                        ({ key = '' }) =>
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
                                                            ''
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
                        }),
                    });
                })
                .catch((e) => {
                    console.error(e);
                    state.set({ text: 'Ошибка загрузки контента' });
                });
        }
        const existComments = comments && comments.githubIssue;
        if (existComments) {
            GithubApi.getIssueComments(
                'nikalexxx',
                'nikalexxx.github.io',
                comments.githubIssue
            )
                .then((list) => state.set({ comments: list }))
                .catch((e) => {
                    console.error(e);
                    state.set({
                        comments: 'Ошибка получения комментариев',
                    });
                });
        } else {
            state.set({
                comments: 'Комментарии для данного поста отключены',
            });
        }
    });

    return () => {
        const { id } = props();
        if (!blog.hasOwnProperty(id)) return Page404;

        const { type, comments: blogComments } = blog[id];
        const { text, comments } = state();
        const { title, creationTime } = blog[id];
        const template = E.div.class(b('content'));
        let elem;
        if (type === 'html') {
            const iframe = E.iframe
                .id(`iframe-post-${id}`)
                .src(`/data/blog/data/${id}/index.${type}`)
                .style(
                    'width: 100%; border:none; object-fit: fill; height: 100vh;'
                );
            setTimeout(() => {
                const iframeElem = document.getElementById(`iframe-post-${id}`)!;
                iframeElem.style.height =
                    (iframeElem as any).contentWindow.document.body.clientHeight +
                    100 +
                    'px';
            }, 300);
            elem = template(iframe as any);
        } else if (type === 'bookbox') {
            console.log({ text });
            elem = template(
                text
                    ? (BookBox.bookData(text) as any)
                          .name(`post-${id}`)
                          .options({
                              settingsOptions: {
                                  viewTumbler: false,
                                  contents: false,
                                  design: false,
                                  media: false,
                              },
                          })
                    : null
            );
        } else {
            elem = 'Ошибка несоответствия типа контента';
        }
        return E.div.class(b())(
            Breadcrumbs.items([
                [Lang.token`menu/blog`, 'blog'],
                [title, `blog/${id}`],
            ]),
            E.h2(title),
            E.em(prettyDate(new Date(creationTime))),
            E.span.style`margin-left: 16px`(),
            E.a
                .href(
                    `https://github.com/nikalexxx/nikalexxx.github.io/tree/master/data/blog/data/${id}`
                )
                .style('white-space: nowrap;')`Исходный код`,
            text === null && E.div.class(b('loading'))(Spin.size('xl')),
            E.div.class(b('container'))(elem),
            E.div.class(b('nav'))._forceUpdate(true)(
                postOrder[id] < postList.length - 1
                    ? RouteLink.href(`blog/${postList[postOrder[id] + 1]}`)(
                          E.div.class(b('link'))('← Предыдущий пост')
                      )
                    : E.div(),
                postOrder[id] > 0
                    ? RouteLink.href(`blog/${postList[postOrder[id] - 1]}`)(
                          E.div.class(b('link'))('Следующий пост →')
                      )
                    : E.div()
            ),
            E.br(),
            E.div.class(b('comments'))(
                E.div.class(b('comments-title'))(
                    E.em.style(`margin-right: 8px`)`Комментарии`,
                    blogComments &&
                        blogComments.githubIssue &&
                        E.a.href(
                            `https://github.com/nikalexxx/nikalexxx.github.io/issues/${blogComments.githubIssue}`
                        )(Button('Оставить комментарий (Github)'))
                ),
                comments === null && Spin.size`s`,
                Array.isArray(comments) &&
                    comments.map((comment) =>
                        E.div.class(b('comment'))(
                            E.div.class(b('comment-header'))(
                                E.a
                                    .href(comment.user.html_url)
                                    .target('_blank')(
                                    E.div.class(b('user'))(
                                        E.img
                                            .class(b('user-logo'))
                                            .src(comment.user.avatar_url)(),
                                        comment.user.login
                                    )
                                ),
                                E.em.class(b('comment-date'))(
                                    prettyDate(new Date(comment.created_at))
                                )
                            ),

                            E.pre(
                                textWithLink(`\n${comment.body}`).map(
                                    ({ type, body }) =>
                                        type === 'link'
                                            ? E.a.href(body)(body)
                                            : body
                                )
                            )
                        )
                    ),
                typeof comments === 'string' && comments
            )
        );
    };
});

export default Post;

function prettyDate(date) {
    return date.toLocaleString('ru', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timezone: 'UTC',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
    });
}
