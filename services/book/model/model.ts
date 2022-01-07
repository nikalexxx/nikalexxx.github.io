import { markerSymbol } from './symbols';

export type BookScope = 'html' | 'markdown' | 'tex' | 'custom';

type Primitive = string | number | boolean | null;
// type Serialize = Primitive | Serialize[] | Record<string, Serialize>;

interface Builder<T> {
    builder: T;
}

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

export type BookEnd = <T extends BookElement<any, any>['api']>(elem: T) => BookEndMark;

export type BookElementProps = Record<string, Primitive | unknown>;

export type BookItem = BookElementSchema | string;
export type BookSchema = BookItem[];
export type BookElementSchema = {
    name: string;
    props: BookElementProps;
    children: BookSchema;
};

export type BookRawItem = BookItem | BookStartMark | BookEndMark | BookResult;
export type BookRawSchema = BookRawItem[];

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

/**
 * Создаёт простой теговый шаблон для функции от строкового аргумента
 */
type SimpleStringTemplate<F extends (arg: string) => any> =
    ReturnType<F> extends infer R
        ? (strList: string[], ...values: any[]) => R
        : never;

export type BookResult = { schema: BookRawSchema };
export type BookCreator = (
    text: TemplateStringsArray,
    ...elements: BookSchema
) => BookResult;

export type BookBuilder<T = unknown> = (schema: BookSchema) => T[];
