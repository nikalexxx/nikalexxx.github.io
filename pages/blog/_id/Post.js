import './Post.less';

import { Breadcrumbs, Page404 } from '../../../components';
import { Component, E, block, RouteLink } from '../../../utils';

import { Button, Lang, Spin } from '../../../blocks';
import blog from '../../../data/blog';
import { createBook } from '../../../services/book/book.js';
import { postList, postOrder } from '../model';
import { GithubApi } from '../../../services/api';

const b = block('post');

const Post = Component.Post(({ props, state, hooks: { didMount } }) => {
    state.init({
        text: null,
        comments: null,
    });

    didMount(() => {
        const { id } = props();
        if (!blog.hasOwnProperty(id)) {
            return;
        }
        const { type, comments } = blog[id];
        const path = `../data/blog/data/${id}/index.${type}?r=${window.appVersion}`;
        if (type === 'html') {
            fetch(path)
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
        } else if (type === 'js') {
            import(path)
                .then((data) => {
                    // console.log(data);
                    state.set({ text: createBook(data.default).to('html') });
                })
                .catch((e) => {
                    console.error(e);
                    state.set({ text: 'Ошибка загрузки контента' });
                });
        }
        const existComments = comments && comments.issue;
        if (existComments) {
            GithubApi.getIssueComments(
                'nikalexxx',
                'nikalexxx.github.io',
                comments.issue
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
        if (!blog.hasOwnProperty(id)) {
            return Page404;
        }
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
                const iframeElem = document.getElementById(`iframe-post-${id}`);
                iframeElem.style.height =
                    iframeElem.contentWindow.document.body.clientHeight +
                    100 +
                    'px';
            }, 300);
            elem = template(iframe);
        } else if (type === 'js') {
            elem = template(text);
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
            text === null && E.div.class(b('loading'))(Spin.size('xl')),
            E.div.class(b('container'))(elem),
            E.div.class(b('nav'))(
                postOrder[id] < postList.length
                    ? RouteLink.href(`blog/${postList[postOrder[id] + 1]}`)(
                          E.div.class(b('link'))('← Предыдущий пост')
                          //   Button.class(b('link'))('← Предыдущий пост')
                      )
                    : E.div(),
                postOrder[id] > 0
                    ? RouteLink.href(`blog/${postList[postOrder[id] - 1]}`)(
                          E.div.class(b('link'))('Следующий пост →')
                      )
                    : E.div()
            ),
            E.br,
            E.div.class(b('comments'))(
                E.div.class(b('comments-title'))(
                    E.em.style(`margin-right: 8px`)`Комментарии`,
                    blogComments &&
                        blogComments.issue &&
                        E.a.href(
                            `https://github.com/nikalexxx/nikalexxx.github.io/issues/${blogComments.issue}`
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
                                            .src(comment.user.avatar_url),
                                        comment.user.login
                                    )
                                ),
                                E.em.class(b('comment-date'))(
                                    prettyDate(new Date(comment.created_at))
                                )
                            ),

                            E.pre(`\n${comment.body}`)
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
