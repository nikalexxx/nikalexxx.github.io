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
    LayoutApi & { format: TextFormatApi };

export type ElementsApi = Api<Omit<BookElements, 'format'>> & {
    format: Api<TextFormatApi>;
};

export type BookApi = ElementsApi & UtilApi;

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

export interface UtilApi {
    /**
     * Использует заданную мета-информацию для вывода её части
     *
     * key — ключ, по которому ищется мета
     */
    use: BookElement<'use', { key: string }>;
    start: BookStart;
    end: BookEnd;
    book: BookCreator & { root: BookCreator };
}
