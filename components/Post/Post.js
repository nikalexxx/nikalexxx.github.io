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
import {Breadcrumbs} from '../index.js';
import {createBook} from '../../utils/book.js';

css(import.meta.url, 'Post.less');

const b = block('post');

const Post = Component.Post(({props, getState, setState, initState, didMount}) => {
    initState({
        text: null
    })
    didMount(() => {
        const {id} = props;
        const {type} = blog[id];
        const path = `/data/blog/data/${id}/index.${type}`;
        if (type === 'html') {
            fetch(path).then(e => {
                // console.log(e.clone().blob());
                return e.blob()
            }).then(data => {
                return data.text();

            }).then(text => {
                // console.log(text);
                setState({text: text});
            });
        } else if (type === 'js') {
            import(path).then(data => {
                // console.log(data);
                setState({text: createBook(data.default).to('html')})
            }).catch(e => {
                console.error(e);
                setState({text: 'Ошибка загрузки контента'});
            });
        }
    })

    return () => {
        const {id} = props;
        const {type} = blog[id];
        const {text} = getState();
        const {title, creationTime} = blog[id];
        const template = E.div.class(b('content'));
        let elem;
        if (type === 'html') {
            const iframe = E.iframe.src(`/data/blog/data/${id}/index.${type}`).style('width: 100%; border:none; object-fit: fill; height: 100vh;')
            // elem.innerHTML = text;
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
            elem
        );
    }
});

export default Post;
