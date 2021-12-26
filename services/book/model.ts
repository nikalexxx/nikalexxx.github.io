import { markerEnd, markerStart, markerSymbol } from './symbols';

type BookScope = 'html' | 'markdown' | 'tex' | 'custom';

type Primitive = string | number | boolean | null;
// type Serialize = Primitive | Serialize[] | Record<string, Serialize>;
type BookElementProps = Record<string, Primitive | unknown>;

type BookItem = BookElementSchema | string;
type BookSchema = BookItem[];
type BookElementSchema = {
    name: string;
    props: BookElementProps;
    children: BookSchema;
};

type GetSchema = <Children extends BookItem[]>(
    ...children: Children | [TemplateStringsArray, ...Children]
) => BookElementSchema;

type BookElement<Name extends string, Props extends BookElementProps = {}> = {
    api: {
        [K in keyof Props]: (
            value: Props[K]
        ) => BookElement<Name, Omit<Props, K>>['api']; // | BookElement<Name, Exclude<Props, K>>
    } & {
        [markerSymbol]: Name;
    } & GetSchema;
    props: Props;
};

type ElementName<T extends BookElement<any, any>> = T extends BookElement<
    infer Name,
    any
>
    ? Name
    : never;

type Api<T extends Record<keyof T, BookElement<string>>> = {
    [Name in keyof T]: T[Name]['api'];
};

type Elements = MetaApi & BlockApi & LayoutApi;
type ElementsApi = Api<Elements>;
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
    code: BookElement<'code', { lang: string }>;
    label: BookElement<'label', { ref: string }>;
    tooltip: BookElement<'tooltip', { content: BookSchema | string }>;
    link: BookElement<'link', { ref: string }>;
    image: BookElement<
        'image',
        { src: string; alt: string; position: string; height: string }
    >; // TODO
    pre: BookElement<'pre'>;
    $: BookElement<'$'>;
    $$: BookElement<'$$'>;
    external: BookElement<'external', { scope?: BookScope }>;
}


const getElement: (name: string) => (props: BookElementProps) => GetSchema =
    (name) =>
    (props) =>
    (...children) => {
        const list: BookItem[] = isTemplateParams(children)
            ? templateToList(...children)
            : children;

        console.log({name, props, list})

        return {
            name,
            props,
            children: list,
        };
    };

type TemplatePrepare = (text: TemplateStringsArray, ...elemets: any[]) => any;

const proxyBuilder = <T extends (...args: any[]) => any>(
    getBuild: (params: Record<string, any>) => T,
    prepare: TemplatePrepare
) => {
    const getProxy = (params: Record<string, any>) =>
        new Proxy(getBuild(params), {
            get(_, name) {
                return (...children: any[]) => {
                    const value: any = isTemplateParams(children)
                        ? prepare(...children)
                        : children[0];
                    // console.log({name, value})
                    return getProxy({ ...params, [name]: value });
                };
            },
        });

    return getProxy({});
};

function getElementProxy<T extends keyof BookApi>(
    name: T,
    prepare: TemplatePrepare = String.raw
) {
    const getElementWithProps = getElement(name);

    const builder = proxyBuilder(
        (params) => getElementWithProps(params),
        prepare
    );
    builder[markerSymbol] = name;

    return builder as BookApi[T];
}

export const bookCreator: UtilApi['book'] = (text, ...elements) => {
    console.log({text, elements})
    return { schema: templateToList(text, ...elements) };
};

bookCreator.root = bookCreator;

export const defaultBookApi: BookApi = {
    title: getElementProxy('title'),
    authors: getElementProxy('authors'),
    draft: getElementProxy('draft'),
    i: getElementProxy('i'),
    b: getElementProxy('b'),
    sup: getElementProxy('sup'),
    sub: getElementProxy('sub'),
    header: getElementProxy('header'),
    code: getElementProxy('code'),
    a: getElementProxy('a'),
    label: getElementProxy('label'),
    link: getElementProxy('link'),
    tooltip: getElementProxy('tooltip'),
    image: getElementProxy('image'),
    pre: getElementProxy('pre'),
    $: getElementProxy('$'),
    $$: getElementProxy('$$'),
    external: getElementProxy('external'),
    area: getElementProxy('area'),
    list: getElementProxy('list'),
    li: getElementProxy('li'),
    small: getElementProxy('small'),
    use: getElementProxy('use'),
    start: getElementProxy('start'),
    end: getElementProxy('end'),
    book: bookCreator,
};

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
type SimpleStringTemplate<F extends (arg: string) => any> =
    ReturnType<F> extends infer R
        ? (strList: string[], ...values: any[]) => R
        : never;

/**
 * Использует заданную мета-информацию для вывода её части
 *
 * key — ключ, по которому ищется мета
 */
type BookUseBuilder = (key: string) => (meta: any) => any;
type BookUse = BookUseBuilder | SimpleStringTemplate<BookUseBuilder>;

export type BookCreator = (
    text: TemplateStringsArray,
    ...elements: BookSchema
) => { schema: BookSchema };

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

export type Book = (api: BookApi) => { schema: BookSchema };

function isTemplateParams(
    args: any[]
): args is [TemplateStringsArray, ...any[]] {
    return (
        args[0] &&
        Array.isArray(args[0]) &&
        'raw' in args[0] &&
        Array.isArray(args[0]['raw'])
    );
}

function templateToList<T>(
    text: TemplateStringsArray,
    ...elements: T[]
): (T | string)[] {
    const result: (T | string)[] = [text[0]];
    for (let i = 1; i < text.length; i++) {
        result.push(elements[i - 1], text[i]);
    }
    return result;
}



export type BookBuilder<T = unknown> = (schema: BookSchema) => T[];

export function createBookParser<A extends BookApi>({ api }: { api: A }) {
    return function <T>({
        builder,
    }: {
        builder: BookBuilder<T>;
    }): (book: Book) => T[] {
        return (book) => {

            const { schema } = book(api);
            console.log({schema})
            return builder(schema);
        };
    };
}

export const createBook = createBookParser({ api: defaultBookApi });

type BookBuilderParams<Token> = {
    elements: {
        [Name in keyof Elements]: <T>(
            props: Elements[Name]['props'] & {
                // self: <Token>({
                //     elements,
                // }: BookBuilderParams<Token>) => Token[];
            }
        ) => (children: Token[]) => Token;
    };
    string: (str: string) => Token;
};

export function createBookBuilder<Token>({
    elements,
    string,
}: BookBuilderParams<Token>): (schema: BookSchema) => Token[] {
    const builder: (schema: BookSchema) => Token[] = (schema) =>
        schema.map((item) => {
            console.log(item);
            if (typeof item === 'string') {
                return string(item);
            }
            return elements[item.name](item.props)(builder(item.children));
        });

    return builder;
}

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

export function elementBuilder<T extends keyof ElementsApi>(
    name: T
): ElementsApi[T] {
    const getProxy = (props: BookElementProps) => {
        const getSchema: GetSchema = (...children) => {
            const elementSchema: BookElementSchema = {
                name,
                props,
                children: getChildrenBookSchema(children),
            };
            return elementSchema;
        };
        return new Proxy(getSchema as ElementsApi[T], {
            get(target, name) {
                return (value) => getProxy({ ...props, [name]: value });
            },
        });
    };

    return getProxy({});
}

function getChildrenBookSchema<Children extends BookItem[]>(
    children: Children | [TemplateStringsArray, ...Children]
): BookSchema {
    const el0 = children[0];
    if (Array.isArray(el0) && 'raw' in el0 && typeof el0[0] === 'string') {
        return getArrayFromTemplate(
            ...(children as [TemplateStringsArray, ...Children])
        );
    }
    return children as Children;
}

export function getArrayFromTemplate<T>(
    strings: TemplateStringsArray,
    ...elements: T[]
): (T | string)[] {
    const result: (T | string)[] = [strings[0]];
    for (let i = 1; i < strings.length; i++) {
        result.push(strings[i], elements[i]);
    }
    return result;
}
