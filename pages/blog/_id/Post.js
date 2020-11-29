import './Post.less';

import { Breadcrumbs, Page404 } from '../../../components';
import {
    Component,
    E,
    block,
} from '../../../utils';

import { Spin } from '../../../blocks';
import blog from '../../../data/blog';
import {createBook} from '../../../services/book/book.js';

const b = block('post');

const Post = Component.Post(({props, state, hooks: {didMount}}) => {
    state.init({
        text: null
    })
    didMount(() => {
        const {id} = props();
        if (!blog.hasOwnProperty(id)) {
            return;
        }
        const {type} = blog[id];
        const path = `../data/blog/data/${id}/index.${type}?r=${window.appVersion}`;
        if (type === 'html') {
            fetch(path).then(e => {
                // console.log(e.clone().blob());
                return e.blob()
            }).then(data => {
                return 'html' || data.text();

            }).then(text => {
                // console.log(text);
                state.set({text: text});
            });
        } else if (type === 'js') {
            import(path).then(data => {
                // console.log(data);
                state.set({text: createBook(data.default).to('html')})
            }).catch(e => {
                console.error(e);
                state.set({text: 'Ошибка загрузки контента'});
            });
        }
    })

    return () => {
        const {id} = props();
        if (!blog.hasOwnProperty(id)) {
            return Page404;
        }
        const {type} = blog[id];
        const {text} = state();
        const {title, creationTime} = blog[id];
        const template = E.div.class(b('content'));
        let elem;
        if (type === 'html') {
            const iframe = E.iframe.id(`iframe-post-${id}`).src(`/data/blog/data/${id}/index.${type}`).style('width: 100%; border:none; object-fit: fill; height: 100vh;')
            setTimeout(() => {
                const iframeElem = document.getElementById(`iframe-post-${id}`);
                iframeElem.style.height = (iframeElem.contentWindow.document.body.clientHeight + 100) + 'px';
            }, 300)
            elem = template(iframe);
        } else if (type === 'js') {
            elem = template(text);
        } else {
            elem = 'Ошибка несоответствия типа контента'
        }
        return E.div.class(b())(
            Breadcrumbs.items([['Блог', 'blog'], [title, `blog/${id}`]]),
            E.h2(title),
            E.em((new Date(creationTime)).toLocaleString('ru', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                timezone: 'UTC',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric'
            })),
            text === null && E.div.class(b('loading'))(
                Spin.size('xl')
            ),
            E.div.class(b('container'))(elem)
        );
    }
});

export default Post;
