import { block } from '../../utils';
import {
    createBookBuilder,
    createBook,
    BookElements,
    parseNewLines,
} from './model';

const tag =
    <T extends string>(
        arg: TemplateStringsArray | T,
        props: Record<string, string> = {}
    ) =>
    (children: any) => {
        const name = typeof arg === 'string' ? arg : arg[0];
        return `<${name} ${Object.entries(props)
            .map(([name, value]) => `${name}="${value}"`)
            .join(' ')}>${children}</${name}>`;
    };

const htmlBuilder = createBookBuilder<string>({
    elements: {
        title: () => (e) =>
            `<h1 style="text-align: center;">${e.join('\n')}</h1>`,
        authors: () => (e) =>
            `<div style="text-align: center; padding: 1rem;">${e.join(
                '\n'
            )}</div>`,
        draft: () => (e) =>
            `<div style="border: 5px solid red" class="book__draft">${e.join(
                '\n'
            )}</div>`,
        header:
            ({ level }) =>
            (e) =>
                `<h${level} style="position: sticky; top: 0;">${e.join(
                    '\n'
                )}</h${level}>`,
        strong: () => (e) => `<strong>${e.join('\n')}</strong>`,
        em: () => (e) => `<em>${e.join('\n')}</em>`,
        format: {
            b: () => (e) => `<b>${e.join('\n')}</b>`,
            i: () => (e) => `<i>${e.join('\n')}</i>`,
            sub: () => (e) => `<sub>${e.join('\n')}</sub>`,
            sup: () => (e) => `<sup>${e.join('\n')}</sup>`,
            pre: () => tag`pre`,
        },
        code:
            ({ lang }) =>
            (e) =>
                `<pre><code ${lang ? `data-code-language="${lang}"` : ''}>${e
                    .join('')
                    .trim()}</code></pre>`,
        label: () => tag`span`,
        tooltip:
            ({ content }) =>
            (e) =>
                `<details><summary>${e}</summary>${content}</details>`,
        link: ({ ref, href }) =>
            href
                ? (e) => `<a href="${href}">${e}</a>`
                : (e) => `<span>${e}</span>`,
        image:
            ({ src, alt, position, height, width, block, inline, key }) =>
            (children) =>
                getImage({
                    src,
                    alt,
                    position,
                    height,
                    width,
                    children,
                    block,
                    inline,
                    key,
                }),
        video:
            ({ src, alt, position, height }) =>
            (e) =>
                `<video src="${src}">${e}</video>`,
        audio:
            ({ src, alt }) =>
            (e) =>
                `<div><audio controls src="${src}">${e}</audio></div>`,
        math: () => tag`span`,
        area: ({ key, inline, meta }) => tag`div`,
        item: () => e => `<li>${e.join('')}</li>`,
        small: ({ inline }) => tag`span`,
        list:
            ({ order }) =>
            (e) => {
                const items = e.join('\n');
                return order ? `<ol>${items}</ol>` : `<ul>${items}</ul>`;
            },
        separator: () => () => `<hr/>`,
        external: ({ scope }) => tag`div`,
    },
    string: (e) => parseNewLines('<br/>')(e).join(''),
});

export const createHtmlBook = createBook({ builder: htmlBuilder });
const css = block('book');

function getImage({
    src,
    alt,
    height = 1,
    width = 1,
    position = 'center',
    children,
}: BookElements['image']['props'] & { children: string[] }) {
    const isSvg = src.endsWith('.svg');

    const heightSize = Math.floor(+height * 100);
    const widthSize = Math.floor(+width * 100);
    const sizeWindowStyle = `${
        height ? `max-height: ${heightSize}%; max-height: ${heightSize}vh;` : ''
    }${width ? `max-width: ${widthSize}%; max-width: ${widthSize}vw;` : ''}`;

    const sizeBlockStyle = `${
        height ? `max-height: ${heightSize}%; max-height: ${heightSize}vh;` : ''
    }${width ? `max-width: ${widthSize}%; max-width: ${widthSize}%;` : ''}`;

    const image = `<picture style="${sizeBlockStyle}">${
        isSvg ? `<source type="image/svg+xml" srcSet="${src}" />` : ''
    }
        <img style="${sizeBlockStyle}" src="${src}" alt="${alt}" />
    </picture>`;
    const content =
        children.length > 0
            ? `<figure class="${css('img-figure', { position })}">
              ${image}
              <figcaption>${children.join('')}</figcaption>
          </figure>`
            : image;

    const img = `<div class="${css('img', { position })}" data-image="imageKey">
        ${content}
    </div>`;
    return img;
}
