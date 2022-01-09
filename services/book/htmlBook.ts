import { block } from '../../utils';
import {
    createBookBuilder,
    createBook,
    BookElements,
    parseNewLines,
} from './model';

const css = block('book');

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
        title:
            ({ key }) =>
            (e) =>
                `<h1 style="text-align: center;" data-key="${key}">${e.join(
                    '\n'
                )}</h1>`,
        authors:
            ({ key }) =>
            (e) =>
                `<div style="text-align: center; padding: 1rem;" data-key="${key}">${e.join(
                    '\n'
                )}</div>`,
        draft:
            ({ key }) =>
            (e) =>
                `<div style="border: 5px solid red" class="book__draft" data-key="${key}">${e.join(
                    '\n'
                )}</div>`,
        header:
            ({ level, key }) =>
            (e) =>
                `<h${level} style="position: sticky; top: 0;" data-key="${key}">${e.join(
                    ''
                )}</h${level}>`,
        strong:
            ({ key }) =>
            (e) =>
                `<strong data-key="${key}">${e.join('\n')}</strong>`,
        em:
            ({ key }) =>
            (e) =>
                `<em data-key="${key}">${e.join('\n')}</em>`,
        format: {
            b:
                ({ key }) =>
                (e) =>
                    `<b data-key="${key}">${e.join('\n')}</b>`,
            i:
                ({ key }) =>
                (e) =>
                    `<i data-key="${key}">${e.join('\n')}</i>`,
            sub:
                ({ key }) =>
                (e) =>
                    `<sub data-key="${key}">${e.join('\n')}</sub>`,
            sup:
                ({ key }) =>
                (e) =>
                    `<sup data-key="${key}">${e.join('\n')}</sup>`,
            pre:
                ({ key }) =>
                (e) =>
                    `<pre data-key="${key}">${e}</pre>`,
        },
        web: {
            video: ({type, src, alt}) => e => {
                if (type === 'youtube') {
                    return `<div><iframe height="315" width="560" src=${src} frameborder="0" allow="encrypted-media; picture-in-picture" allowfullscreen /></div>`
                }
                return '';
            },
            audio: () => e => '',
            message: () => e => '',
        },
        code:
            ({ lang, key }) =>
            (e) =>
                `<pre data-key="${key}"><code ${
                    lang ? `data-code-language="${lang}"` : ''
                }>${e.join('').trim()}</code></pre>`,
        label:
            ({ key, ref }) =>
            (e, store) => {
                return `
                    <input type="checkbox" id="${`label-${key}`}" class="${css('label-mark')}" value="1"/>
                    <label data-key="${key}" for="${`label-${key}`}" style="cursor: pointer; text-decoration: underline;">${e}</label>
                    <div class="${css('label-data')}">
                    <label for="${`label-${key}`}">&nbsp;</label>
                    <div>${
                        store.dataByKeys[ref]
                    }</div></div>`;
            },
        tooltip:
            ({ content, key }) =>
            (e) =>
                `<details data-key="${key}"><summary>${e}</summary>${content}</details>`,
        link: ({ ref, href, key }) =>
            href
                ? (e) => `<a href="${href}" data-key="${key}">${e}</a>`
                : (e) => `<span data-key="${key}">${e}</span>`,
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
            ({ src, alt, position, height, key }) =>
            (e) =>
                `<video src="${src}" data-key="${key}">${e}</video>`,
        audio:
            ({ src, alt, key }) =>
            (e) =>
                `<div data-key="${key}"><audio controls src="${src}">${e}</audio></div>`,
        math: () => tag`span`,
        area: ({ key, inline, meta }) => tag`div`,
        item:
            ({ key }) =>
            (e) =>
                `<li data-key="${key}">${e.join('')}</li>`,
        small: ({ inline }) => tag`span`,
        list:
            ({ order, key }) =>
            (e) => {
                const items = e.join('\n');
                return order
                    ? `<ol data-key="${key}">${items}</ol>`
                    : `<ul data-key="${key}">${items}</ul>`;
            },
        separator:
            ({ key }) =>
            () =>
                `<hr data-key="${key}"/>`,
        external: ({ scope }) => tag`div`,
        // counter: ({})
    },
    string: (e) => parseNewLines('<br/>')(e).join(''),
});

export const createHtmlBook = createBook({ builder: htmlBuilder });

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
