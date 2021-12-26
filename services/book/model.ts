import { markerEnd, markerStart, markerSymbol } from './symbols';

type BookScope = 'html' | 'markdown' | 'tex' | 'custom';

type BookElementProps = Record<string, unknown>;

type BookItem = BookElementSchema | string;
type BookSchema = BookItem[];
type BookElementSchema = {
    props: BookElementProps;
    children: BookSchema;
};

type BookElement<Name extends string, Props extends BookElementProps = {}> = {
    [K in keyof Props]: (value: Props[K]) => BookElement<Name, Omit<Props, K>>; // | BookElement<Name, Exclude<Props, K>>
} & {
    [markerSymbol]: Name;
} & (<Children extends [BookItem, ...BookItem[]], Result extends BookElementSchema>(
        ...children: Children | [TemplateStringsArray, ...(Children | [])]
    ) => Result);

type ElementName<T extends BookElement<any, any>> = T extends BookElement<
    infer Name,
    any
>
    ? Name
    : never;

type ElementsApi = MetaApi & BlockApi & LayoutApi;
type BookApi = ElementsApi & UtilApi;

interface MetaApi {
    title: BookElement<'title'>;
    authors: BookElement<'authors'>;
    draft: BookElement<'draft'>;
}

/**
 * Блоки-атомы, из которых состоит книга, не считая обычного текста.
 */
interface BlockApi {
    b: BookElement<'b'>;
    i: BookElement<'i'>;
    sup: BookElement<'sup'>;
    sub: BookElement<'sub'>;
    header: BookElement<'header', { level: 1 | 2 | 3 | 4 | 5 | 6 }>;
    a: BookElement<'a', { href: string }>;
    code: BookElement<'code'>;
    label: BookElement<'label', { ref: string }>;
    tooltip: BookElement<'tooltip', { content: BookElementSchema | string }>;
    link: BookElement<'link', { ref: string }>;
    image: BookElement<
        'image',
        { src: string; alt: string; position: string; height: string }
    >; // TODO
    pre: BookElement<'pre'>;
    $: BookElement<'$'>;
    $$: BookElement<'$$'>;
    external: BookElement<'external', {scope?: BookScope}>;
}

/**
 * Элементы, которые определяют верстку остальных элементов
 */
interface LayoutApi {
    area: BookElement<'area', { key: string; inline: boolean; meta: unknown }>;
    list: BookElement<'list', { order: boolean }>;
    li: BookElement<'li'>;
    small: BookElement<'small', { inline: boolean }>;
}

interface UtilApi {
    use: BookUse;
    start: BookStart;
    end: BookEnd;
    book: BookCreator & { root: BookCreator };
}

/**
 * Создаёт простой теговый шаблон для функции от строкового аргумента
 */
type SimpleStringTemplate<
    F extends (arg: string) => any
> = ReturnType<F> extends infer R
    ? (strList: string[], ...values: any[]) => R
    : never;

/**
 * Использует заданную мета-информацию для вывода её части
 *
 * key — ключ, по которому ищется мета
 */
type BookUseBuilder = (key: string) => (meta: any) => any;
type BookUse = BookUseBuilder | SimpleStringTemplate<BookUseBuilder>;

type BookCreator = (
    text: TemplateStringsArray,
    ...elements: BookSchema
) => BookSchema;

interface Builder<T> {
    builder: T;
}

/**
 * Метка старта элемента. Нужна только для проставления символа начала области элемента
 */
type BookStart = <T extends BookElement<any, any>>(
    elem: T
) => Builder<T> & { [markerStart]: ElementName<T> };

/**
 * Метка конца элемента. Нужна только для проставления символа конца области элемента
 */
type BookEnd = <T extends BookElement<any, any>>(
    elem: T
) => Builder<T> & { [markerEnd]: ElementName<T> };

export type Book = (api: BookApi) => BookSchema;

// const api = {
//     meta: {
//         title: () => String,
//         authors: () => Array,
//     },
//     control: {
//         start: marker,
//         end: marker,
//     },
//     text: {
//         [props]: {
//             key: [String, Symbol],
//         },
//         a: () => ({
//             href: String,
//         }),
//         ref: () => ({}),
//     },
//     block: {
//         [props]: {
//             key: [String, Symbol],
//         },
//         [props]: {
//             position: ['center', 'left', 'right'],
//         },
//         img: () => ({
//             src: String,
//             alt: String,
//         }),
//     },
//     math: {
//         formula: {
//             inline: () => String,
//             block: () => String,
//         },
//     },
// };
