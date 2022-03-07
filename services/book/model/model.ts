import { markerSymbol } from './symbols';

export type BookScope = 'html' | 'markdown' | 'tex' | 'custom';

type Primitive = string | number | boolean | null;
// type Serialize = Primitive | Serialize[] | Record<string, Serialize>;


/**
 * Метка старта элемента. Нужна только для проставления символа начала области элемента
 */
export type BookStartMark = { __start: string; props: BookElementProps };

export type BookStart = <T extends BookElement<any, any>['api']>(
    elem: T
) => BookStartMark;

/**
 * Метка конца элемента. Нужна только для проставления символа конца области элемента
 */
export type BookEndMark = { __end: string; props: BookElementProps };

export type BookEnd = <T extends BookElement<any, any>['api']>(
    elem: T
) => BookEndMark;

export type BookElementProps = Record<string, Primitive | unknown>;

export type BookElementSchema = {
    name: string;
    props: BookElementProps;
    children: BookSchema;
};

export type BookItem = BookElementSchema | string;

// схема дерева
export type BookSchema = BookItem[];

export type BookLayoutView = 'block' | 'inline';

export type BookLinkedItem = {
    bookElementSchema: BookElementSchema;
    firstChild: BookLinkedItem | null;
    lastChild: BookLinkedItem | null;
    previous: BookLinkedItem | null;
    next: BookLinkedItem | null;
    previousLeaf: BookLinkedItem | null;
    nextLeaf: BookLinkedItem | null;
    parent: BookLinkedItem | null;
    raw: string | null;
    view: BookLayoutView;
};

// схема связного дерева
export type BookLinkedSchema = {
    start: BookLinkedItem | null;
    end: BookLinkedItem | null;
    tree: BookLinkedItem[];
};

export type BookRawItem = BookItem | BookStartMark | BookEndMark | BookResult;

// схема дерева до разбора
export type BookRawSchema = (
    | BookRawItem
    | ((...children: BookRawSchema) => BookRawItem)
)[];

export type BookRawFlatSchema = (
    | BookItem
    | BookStartMark
    | BookEndMark
    | BookResult<BookRawFlatSchema>
)[];

export type GetSchema = <Children extends BookItem[]>(
    ...children: Children | [TemplateStringsArray, ...Children]
) => BookElementSchema;

export type BookElement<
    Name extends string,
    Props extends BookElementProps = {}
> = {
    api: {
        [K in keyof Props | 'key']: (
            value: K extends 'key' ? string : Props[K]
        ) => BookElement<Name, Omit<Props, K>>['api']; // | BookElement<Name, Exclude<Props, K>>
    } & {
        [markerSymbol]: Name;
    } & GetSchema;
    props: Props & { key: string };
};

export type ElementName<T extends BookElement<any, any>> =
    T extends BookElement<infer Name, any> ? Name : never;

export type Api<T extends Record<keyof T, BookElement<string>>> = {
    [Name in keyof T]: T[Name]['api'];
};

export type LevelApi<T extends Record<keyof T, BookElement<string>>> = {
    [Name in keyof T as Name extends `${string}.${infer X}` ? X : Name]: T[Name]['api'];
};

export type LevelElements<T extends Record<keyof T, BookElement<string>>> = {
    [Name in keyof T as Name extends `${string}.${infer X}` ? X : Name]: T[Name];
};

/**
 * Создаёт простой теговый шаблон для функции от строкового аргумента
 */
type SimpleStringTemplate<F extends (arg: string) => any> =
    ReturnType<F> extends infer R
        ? (strList: string[], ...values: any[]) => R
        : never;

export type BookResult<S = BookRawSchema> = { schema: S };
export type BookCreator = (
    text: TemplateStringsArray,
    ...elements: BookSchema
) => BookResult;

export type BookHeader<T> = {
    value: T[];
    text: string;
    key: string;
    level: number;
};


export type BookStore<T> = {
    /**
     * хранилище элементов по ключам
     */
    elementsByKeys: Record<string, BookElementSchema>;

    /**
     * хранилище токенов по ключам
     */
    dataByKeys: Record<string, T[]>;
};

export type BookBuilder<T = unknown> = (
    schema: BookSchema,
    store: BookStore<T>
) => T[];
