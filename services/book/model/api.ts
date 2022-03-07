import {
    Api,
    BookCreator,
    BookElement,
    BookEnd,
    BookSchema,
    BookScope,
    BookStart,
    ElementName,
    LevelApi,
} from './model';

export type BookElements = MetaApi &
    BlockApi &
    MediaApi &
    LayoutApi & { format: TextFormatApi; web: WebApi };

export type LevelApiName = 'format' | 'web';
export const LevelApiNameList: LevelApiName[] = ['format', 'web'];
export const LevelApiNameSet: Set<string> = new Set(LevelApiNameList);

export type LevelElementsApi = {
    format: LevelApi<TextFormatApi>;
    web: LevelApi<WebApi>;
};

export type ElementsApi = Api<Omit<BookElements, LevelApiName>> &
    LevelElementsApi;

export type BookApi = ElementsApi & UtilApi & StoreApi;

export interface MetaApi {
    title: BookElement<'title'>;
    authors: BookElement<'authors'>;
    draft: BookElement<'draft'>;
}

export type LayoutPosition = 'inline' | 'end' | 'start' | 'center';

export type LayoutProps = {
    block: boolean;
    inline: boolean;
    position: 'inline' | 'end' | 'start' | 'center';
};

export type MediaProps = {
    src: string;
    alt: string;
};

export type SizeProps = {
    width: string | number;
    height: string | number;
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

export const defaultBlockNameList: (keyof BlockApi)[] = [
    'strong',
    'em',
    'header',
    'code',
    'label',
    'link',
    'tooltip',
    'math',
    'external',
];
export const defaultBlockNames: Set<keyof BlockApi> = new Set(
    defaultBlockNameList
);

export interface MediaApi {
    image: BookElement<'image', MediaProps & SizeProps & LayoutProps>;
    video: BookElement<'video', MediaProps & SizeProps & LayoutProps>;
    audio: BookElement<'audio', MediaProps & { title: string }>;
}

export interface TextFormatApi {
    'format.b': BookElement<'format.b'>;
    'format.i': BookElement<'format.i'>;
    'format.sup': BookElement<'format.sup'>;
    'format.sub': BookElement<'format.sub'>;
    'format.pre': BookElement<'format.pre'>;
}

export interface WebApi {
    'web.video': BookElement<
        'web.video',
        { type: 'youtube' | 'vimeo' } & MediaProps & SizeProps & LayoutProps
    >;
    'web.audio': BookElement<
        'web.audio',
        { type: 'soundcloud' } & MediaProps & SizeProps & LayoutProps
    >;
    'web.message': BookElement<
        'web.message',
        { type: 'telegram' | 'twitter' } & MediaProps & SizeProps & LayoutProps
    >;
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
