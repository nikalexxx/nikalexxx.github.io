import {
    Api,
    BookCreator,
    BookElement,
    BookEnd,
    BookSchema,
    BookScope,
    BookStart,
    ElementName,
} from './model';

export type BookElements = MetaApi &
    BlockApi &
    MediaApi &
    LayoutApi & { format: TextFormatApi; web: WebApi};

export type ElementsApi = Api<Omit<BookElements, 'format' | 'web'>> & {
    format: Api<TextFormatApi>;
    web: Api<WebApi>;
};

export type BookApi = ElementsApi & UtilApi & StoreApi;

export interface MetaApi {
    title: BookElement<'title'>;
    authors: BookElement<'authors'>;
    draft: BookElement<'draft'>;
}

export type LayoutProps = {
    block: boolean;
    inline: boolean;
    position: 'inline' | 'right' | 'left' | 'center';
};

export type MediaProps = {
    src: string;
    alt: string;
};

/**
 * Блоки-атомы, из которых состоит книга, не считая обычного текста.
 */
export interface BlockApi {
    strong: BookElement<'strong'>;
    em: BookElement<'em'>;
    header: BookElement<'header', { level: 1 | 2 | 3 | 4 | 5 | 6 }>;
    code: BookElement<'code', { lang: string } & LayoutProps>;
    label: BookElement<'label', { ref: string }>;
    link: BookElement<'link', { ref: string; href: string }>;
    tooltip: BookElement<'tooltip', { content: BookSchema | string }>;
    math: BookElement<'math', LayoutProps>;
    external: BookElement<'external', { scope?: BookScope }>;
}

export interface MediaApi {
    image: BookElement<
        'image',
        MediaProps & {
            height: string | number;
            width: string | number;
        } & LayoutProps
    >;
    video: BookElement<
        'video',
        MediaProps & { height: string; width: string } & LayoutProps
    >;
    audio: BookElement<'audio', MediaProps & { title: string }>;
}

export interface TextFormatApi {
    b: BookElement<'b'>;
    i: BookElement<'i'>;
    sup: BookElement<'sup'>;
    sub: BookElement<'sub'>;
    pre: BookElement<'pre'>;
}

export interface WebApi {
    video: BookElement<'web-video', {type: 'youtube'} & MediaProps>;
    audio: BookElement<'web-audio', {type: 'souncloud'} & MediaProps>;
    message: BookElement<'web-message', {type: 'telegram' | 'twitter'} & MediaProps>;
}

/**
 * Элементы, которые определяют верстку остальных элементов
 */
export interface LayoutApi {
    area: BookElement<'area', { key: string; inline: boolean; meta: unknown }>;
    list: BookElement<'list', { order: boolean }>;
    item: BookElement<'item'>;
    separator: BookElement<'separator'>;
    small: BookElement<'small', { inline: boolean }>;
}

export interface StoreApi {
    /**
     * Использует заданную мета-информацию для вывода её части
     *
     * key — ключ, по которому ищется мета
     */
    use: BookElement<'use', { ref: string }>;
    counter: BookElement<
        'counter',
        {
            start: string;
            end: string;
            use: string;
            initial: number;
            step: number;
        }
    >;
}

export interface UtilApi {
    start: BookStart;
    end: BookEnd;
    book: BookCreator & { root: BookCreator };
}
