import {
    createBookBuilder,
    createBook,
    BookElements,
    parseNewLines,
    WebApi,
    BookData,
} from '../model';

import './htmlBook.css';
import { getCssSizeStyle, getLayoutParams, parseSize } from './layout';

type HtmlToken = string;

const listToHtml = (children: HtmlToken[]): HtmlToken =>
    children.join('').trim();

const htmlBuilder = createBookBuilder<HtmlToken>({
    elements: {
        title:
            ({ key }) =>
            ({ children }) => {
                const childrenHtml = listToHtml(children);
                return `<h1 class="book-box-title" data-key="${key}" data-name="title">${childrenHtml}</h1>`;
            },
        authors:
            ({ key }) =>
            ({ children }) => {
                const childrenHtml = listToHtml(children);
                return `<div class="book-box-authors" data-key="${key}" data-name="authors">${childrenHtml}</div>`;
            },
        draft:
            ({ key }) =>
            ({ children }) => {
                const childrenHtml = listToHtml(children);
                return `<div class="book-box-draft" data-key="${key}" data-name="draft">${childrenHtml}</div>`;
            },
        header:
            ({ level, key }) =>
            ({ children }) => {
                const childrenHtml = listToHtml(children);
                const elem = `h${level}`;
                return `<${elem} class="book-box-header" data-key="${key}" data-name="header">${childrenHtml}</${elem}>`;
            },
        strong:
            ({ key }) =>
            ({ children }) =>
                `<strong data-key="${key}" data-name="strong">${listToHtml(
                    children
                )}</strong>`,
        em:
            ({ key }) =>
            ({ children }) =>
                `<em data-key="${key}" data-name="em">${listToHtml(
                    children
                )}</em>`,
        format: {
            b:
                ({ key }) =>
                ({ children }) => {
                    const childrenHtml = listToHtml(children);
                    return `<b data-key="${key}" data-name="format.b">${childrenHtml}</b>`;
                },
            i:
                ({ key }) =>
                ({ children }) => {
                    const childrenHtml = listToHtml(children);
                    return `<i data-key="${key}" data-name="format.i">${childrenHtml}</i>`;
                },
            sub:
                ({ key }) =>
                ({ children }) =>
                    `<sub data-key="${key}" data-name="format.sub">${listToHtml(
                        children
                    )}</sub>`,
            sup:
                ({ key }) =>
                ({ children }) =>
                    `<sup data-key="${key}" data-name="format.sup">${listToHtml(
                        children
                    )}</sup>`,
            pre:
                ({ key }) =>
                ({ children }) =>
                    `<pre data-key="${key}" data-name="format.pre">${listToHtml(
                        children
                    )}</pre>`,
        },
        web: {
            video:
                (props) =>
                ({ children }) => {
                    const {
                        type,
                        src,
                        alt,
                        width,
                        height,
                        inline,
                        block,
                        position,
                        key,
                    } = props;
                    const heightSize = parseSize(height);
                    const widthSize = parseSize(width);

                    const sizeBlockStyle = getCssSizeStyle({
                        width: widthSize,
                        height: heightSize,
                    });

                    const video = `<iframe style="width: 100vw; height:100vh; ${sizeBlockStyle}" src=${src} frameborder="0" allow="encrypted-media; picture-in-picture" allowfullscreen ></iframe>`;
                    const content = getFigure(video, listToHtml(children));
                    const { view, position: layoutPosition } = getLayoutParams({
                        inline,
                        block,
                        position,
                    });
                    return `<div class="book-box-web-video book-box_media-${view} book-box_media-${layoutPosition}" data-key="${key}" data-name="web.video">
                        ${content}
                    </div>`;
                },
            audio:
                ({ src, alt, key, inline, block, position, width, height }) =>
                ({ children }) => {
                    const heightSize = parseSize(height);
                    const widthSize = parseSize(width);

                    const sizeBlockStyle = getCssSizeStyle({
                        width: widthSize,
                        height: heightSize,
                    });
                    const audio = `<iframe style="width: 100vw; height: 150px; ${sizeBlockStyle}" scrolling="no" frameborder="no" src="${src}"></iframe>`;
                    const content = getFigure(audio, listToHtml(children));
                    const { view, position: layoutPosition } = getLayoutParams({
                        inline,
                        block,
                        position,
                    });
                    return `<div class="book-box-web-audio book-box_media-${view} book-box_media-${layoutPosition}" data-key="${key}" data-name="web.audio">
                        ${content}
                    </div>`;
                },
            message:
                ({ src, type }) =>
                (e) => {
                    // if (type === 'telegram') {
                    //     const postId = src.replace(/https?:\/\/t\.me\//, '').replace('?embed=1', '');
                    //     return `<div><script src="https://telegram.org/js/telegram-widget.js?15" data-telegram-post="${postId}" data-width="100%"></script></div>`
                    // }
                    return `<iframe width="100%" height="400" frameborder="no"" src="${src}"></iframe>`;
                },
        },
        code:
            ({ lang, key }) =>
            ({ children }) => {
                const langAttribute = lang
                    ? `data-code-language="${lang}"`
                    : '';
                const childrenHtml = listToHtml(children);
                return `<pre data-key="${key}" data-name="code"><code ${langAttribute}>${childrenHtml}</code></pre>`;
            },
        label:
            ({ key, ref }) =>
            ({ children, store }) => {
                const childrenHtml = listToHtml(children);
                const labelId = `label-${key}`;
                const data = store.dataByKeys[ref];
                return `
                    <div class="book-box-label" data-key="${key}" data-name="label">
                        <input type="checkbox" id="${labelId}" class="book-box-label-input" value="1"/>
                        <label for="${labelId}" class="book-box-label-mark">
                            ${childrenHtml}
                        </label>
                        <div class="book-box-label-data">
                            <label for="${labelId}">&nbsp;</label>
                            <div>${listToHtml(data)}</div>
                        </div>
                    </div>
                `;
            },
        tooltip:
            ({ content, key }) =>
            ({ children }) =>
                `<details data-key="${key}"><summary>${children}</summary>${content}</details>`,
        link:
            ({ ref, href, key }) =>
            ({ children }) => {
                const childrenHtml = listToHtml(children);
                return href
                    ? `<a href="${href}" data-key="${key}" data-name="link">${childrenHtml}</a>`
                    : `<span data-key="${key}">${childrenHtml}</span>`;
            },
        image:
            ({
                src,
                alt,
                position = 'center',
                height = 1,
                width = 1,
                block = true,
                inline = false,
                key,
            }) =>
            ({ children }) => {
                const isSvg = src.endsWith('.svg');

                const heightSize = parseSize(height ?? 1);
                const widthSize = parseSize(width ?? 1);

                const sizeBlockStyle = getCssSizeStyle({
                    width: widthSize,
                    height: heightSize,
                });

                const svgSource = isSvg
                    ? `<source type="image/svg+xml" srcSet="${src}" />`
                    : '';
                const image = `<picture style="${sizeBlockStyle}">
                    ${svgSource}
                    <img style="${sizeBlockStyle}" src="${src}" alt="${alt}" />
                </picture>`;

                const { view, position: layoutPosition } = getLayoutParams({
                    inline,
                    block,
                    position,
                });

                const content = getFigure(image, listToHtml(children));

                return `<div class="book-box-image book-box_media-${view} book-box_media-${layoutPosition}" data-key="${key}">
                    ${content}
                </div>`;
            },
        video:
            ({ src, alt, position, height, key }) =>
            ({ children }) =>
                `<video src="${src}" data-key="${key}">${listToHtml(
                    children
                )}</video>`,
        audio:
            ({ src, alt, key }) =>
            ({ children }) =>
                `<div data-key="${key}"><audio controls src="${src}">${listToHtml(
                    children
                )}</audio></div>`,
        math:
            ({ key }) =>
            ({ children }) =>
                `<span data-key="${key}">${listToHtml(children)}</span>`,
        area:
            ({ key, inline, meta }) =>
            ({ children }) =>
                `<div>${listToHtml(children)}</>`,
        item:
            ({ key }) =>
            ({ children }) =>
                `<li data-key="${key}">${listToHtml(children)}</li>`,
        small:
            ({ inline, key }) =>
            ({ children }) => {
                const childrenHtml = listToHtml(children);
                const elem = inline ? 'span' : 'div';

                return `<${elem} data-key="${key}" class="book-box-small" data-name="small">${childrenHtml}</${elem}>`;
            },
        list:
            ({ order, key }) =>
            ({ children }) => {
                const childrenHtml = listToHtml(children);
                const elem = order ? 'ol' : 'ul';
                return `<${elem} data-key="${key}" data-name="list">${childrenHtml}</${elem}>`;
            },
        separator:
            ({ key }) =>
            () =>
                `<hr data-key="${key}" data-name="separator"/>`,
        external:
            ({ scope }) =>
            ({ children }) =>
                `<div>${listToHtml(children)}</div>`,
    },
    synteticElements: {
        text:
            ({ raw }) =>
            () =>
                `<span>${parseNewLines('<br/>')(raw).join('')}</span>`,
        page:
            ({ count, key }) =>
            ({ children }) =>
                `<a id="${count}" class="book-box-page" data-page="${count}" data-key="${key}" data-name=".page" href="#${count}">${listToHtml(
                    children
                )}</a>`,
        error:
            ({ props, name }) =>
            ({ children }) => {
                const childrenHtml = listToHtml(children);
                const propsStr = JSON.stringify(props);
                return `<div data-name=".error">
                    <p style="color: red">
                        Unknown name: ${name}
                        <pre>${propsStr}</pre>
                    </p>
                    ${childrenHtml}
                <div>`;
            },
        counter:
            () =>
            ({ children }) =>
                `<span>${listToHtml(children)}<span>`,
    },
});

export const createHtmlBook = createBook({ builder: htmlBuilder });

function getFigure(content: string, caption: string): string {
    return `<figure class="book-box_media-figure">
        ${content}
        <figcaption class="book-box_media-figure-caption">${caption}</figcaption>
    </figure>`;
}

export function getBookBoxHtml({
    bookData,
}: {
    bookData: BookData<HtmlToken>;
}): HtmlToken {
    const { tokens, meta, store } = bookData;
    return `<div>${listToHtml(tokens)}</div>`;
}
