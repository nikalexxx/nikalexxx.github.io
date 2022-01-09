import { Tooltip } from '../../blocks';
import { E as El } from '../../utils';
import { createBookBuilder, createBook, parseNewLines } from './model';

const E = El as any;

const parvisBuilder = createBookBuilder<any>({
    elements: {
        title: () => E.h1,
        authors: () => E.span,
        draft: () => E.div.style('border: 5px solid red'),
        header: ({ level }) => {
            return E[`h${level}`];
        },
        strong: () => E.strong,
        em: () => E.em,
        format: {
            b: () => E.b,
            i: () => E.i,
            sub: () => E.sub,
            sup: () => E.sup,
            pre: () => E.pre,
        },
        web: {
            video: ({ src }) =>
                E.iframe.width`560`.height`315`.src(src)
                    .title`YouTube video player`.frameborder`0`
                    .allow`encrypted-media; picture-in-picture`.allowfullscreen(
                    true
                ),
            audio: () => (e) => ``,
            message: () => (e) => ``,
        },
        code: ({ lang }) => E.code['data-code-language'](lang),
        label: () => E.span,
        tooltip: ({ content }) => Tooltip.text(content),
        link: ({ ref, href }) => (href ? E.a.href(href) : E.span),
        image: ({ src, alt, position, height }) => E.img.src(src).alt(alt),
        math: () => E.span,
        area: ({ key, inline, meta }) => E.div,
        item: () => E.li,
        small: ({ inline }) => E.span.style('font-size: 0.9em'),
        list: ({ order }) => (order ? E.ol : E.ul),
        video: ({ src }) => E.video.src(src),
        audio: ({ src }) => E.audio.src(src),
        separator: () => E.hr,
        external: (params) => (e) => E.div(E.div(JSON.stringify(params)), e),
    },
    string: parseNewLines(E.br),
});

export const createParvisBook = createBook({ builder: parvisBuilder });
