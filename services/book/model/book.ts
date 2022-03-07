import {
    BookApi,
    BookElements,
    ElementsApi,
    LevelApiName,
    TextFormatApi,
    WebApi,
} from './api';
import { defaultBookApi } from './defaultApi';
import {
    getBookLinkedSchema,
    getLinkedLeafList,
    getSchemaFromLinkedList,
} from './linkedSchema';
import { BookMeta, getBookMeta } from './meta';
import {
    BookBuilder,
    BookElementProps,
    BookElementSchema,
    BookItem,
    BookRawSchema,
    BookSchema,
    GetSchema,
    BookResult,
    BookRawItem,
    BookStore,
    BookRawFlatSchema,
    LevelElements,
} from './model';
import { getStore } from './store';
import { flatList, templateToList } from './utils';
import { BookElement } from './model';
import { LevelApiNameSet } from './api';

export type Book = (api: BookApi) => { schema: BookRawSchema };

export type BookData<T> = {
    tokens: T[];
    meta: BookMeta<T>;
    store: BookStore<T>;
};

type Item<T extends any> = T extends (infer X)[] ? X : never;

function isBookResult(x: Item<BookRawSchema>): x is BookResult {
    return typeof x === 'object' && 'schema' in x;
}

/**
 * Составление дерева с учётом границ
 */
export function getPureSchema(schema: BookRawSchema): BookSchema {
    const result: BookSchema = [];
    const stack: BookElementSchema[] = [];
    const getTarget = () =>
        stack.length > 0 ? stack[stack.length - 1].children : result;

    for (const item of schema) {
        // console.log({ item });
        // куда класть текущие элементы
        const target = getTarget();

        if (typeof item === 'string') {
            target.push(item);
        } else if (isBookResult(item)) {
            // вложенные книги
            target.push(...getPureSchema(item.schema));
        } else if (
            (typeof item === 'object' &&
                (item as any).prototype &&
                item instanceof Proxy) ||
            typeof item === 'function'
        ) {
            // console.log('proxy', { item });
            target.push(...getPureSchema([(item as any)()]));
        } else if ('__start' in item) {
            // текущая область
            stack.push({
                name: item.__start,
                props: item.props,
                children: [],
            });
        } else if ('__end' in item) {
            const elem = stack.pop();
            const parentTarget = getTarget();

            parentTarget.push(elem);
        } else {
            item.children = getPureSchema(item.children);
            target.push(item);
        }
    }

    // замыкаем остатки стека
    while (stack.length > 0) {
        const elem = stack.pop();
        const target = getTarget();
        target.push(elem);
    }

    return result;
}

// function getFlatSchema(schema: BookRawSchema): BookRawFlatSchema {
//     const result: BookRawFlatSchema = [];
//     for (const item of schema) {
//         if (typeof item === 'string') {
//             result.push(item);
//         }
//         if (typeof item === 'function') {
//             const value = item();
//             result.push(...getFlatSchema([value]));
//         }
//     }
//     return result;
// }

/**
 * Добавление ключей по умолчанию всем элементам
 */
function addKeysToSchema(
    schema: BookSchema,
    keys: Map<string, number> = new Map()
): void {
    const bumpKey = (name: string) => {
        keys.set(name, (keys.get(name) ?? 0) + 1);
    };
    for (const item of schema) {
        if (typeof item === 'string') {
            continue;
        } else if (item.props.key !== undefined) {
            continue;
        } else {
            bumpKey(item.name);
            item.props.key = `${item.name}-${keys.get(item.name)}`;
            // console.log({ item });
            addKeysToSchema(item.children, keys);
        }
    }
}

function calculateCounters(
    schema: BookSchema,
    counters: Map<string, number> = new Map(),
    steps: Map<string, number> = new Map()
): void {
    for (const item of schema) {
        if (typeof item === 'string') {
            continue;
        }
        if (item.name !== 'counter') {
            calculateCounters(item.children, counters, steps);
            continue;
        }
        const props = item.props as BookApi['counter']['props'];
        if (props.start) {
            counters.set(props.start, props.initial ?? 0);
            if (props.step) {
                steps.set(props.start, props.step);
            }
            continue;
        }
        if (props.end) {
            counters.delete(props.end);
            steps.delete(props.end);
            continue;
        }
        if (props.use) {
            const value = counters.get(props.use) ?? 0;
            item.children = [`${value}`];
            // console.log('counter', { item });
            const step = steps.get(props.use) ?? 1;
            counters.set(props.use, value + step);
        }
    }
}

export function createBookParser<A extends BookApi>({ api }: { api: A }) {
    return function <T>({
        builder,
    }: {
        builder: BookBuilder<T>;
    }): (book: Book) => BookData<T> {
        return (book) => {
            const { schema: rawSchema } = book(api);
            let schema = getPureSchema(rawSchema);
            addKeysToSchema(schema);
            // console.log({ schema });
            calculateCounters(schema);
            const linkedSchema = getBookLinkedSchema(schema, true);
            const leafList = getLinkedLeafList(linkedSchema);
            const tokensSchema = getSchemaFromLinkedList(linkedSchema.tree);
            const store = getStore({ builder, schema });
            const meta = getBookMeta({ schema, store, builder });
            console.log({
                schema,
                meta,
                linkedSchema,
                leafList,
                tokensSchema,
                store,
            });
            schema = tokensSchema;
            return {
                tokens: builder(schema, store),
                meta,
                store,
            };
        };
    };
}

export const createBook = createBookParser({ api: defaultBookApi });

type GetToken<Token> = (params: {
    children: Token[];
    store: BookStore<Token>;
}) => Token;

type SynteticElements = {
    text: BookElement<'text', { raw: string }>;
    page: BookElement<'page', { count: number }>;
    counter: BookElement<'counter'>;
    error: BookElement<'error', { props: Record<string, any>; name: string }>;
};
const synteticElementNameSet = new Set(['text', 'page', 'counter', 'error']);

type TokenGetter<Props, Token> = (props: Partial<Props>) => GetToken<Token>;

type TokenGetterList<T extends Record<keyof T, BookElement<string>>, Token> = {
    [Name in keyof T]: TokenGetter<T[Name]['props'], Token>;
};

type BookBuilderParams<Token> = {
    elements: TokenGetterList<Omit<BookElements, LevelApiName>, Token> & {
        format: TokenGetterList<LevelElements<TextFormatApi>, Token>;
        web: TokenGetterList<LevelElements<WebApi>, Token>;
    };
    synteticElements: TokenGetterList<SynteticElements, Token>;
};

type BookBuilderElements<Token> = Token extends string
    ? Record<
          string,
          BookBuilderElements<Token> | TokenGetter<BookElementProps, Token>
      >
    : never;

export function createBookBuilder<Token>({
    elements,
    synteticElements,
}: BookBuilderParams<Token>): BookBuilder<Token> {
    const builder: BookBuilder<Token> = (schema, store) => {
        const getItemBuilder: (
            store: BookStore<Token>
        ) => (item: BookItem) => Token = (store) => (item) => {
            if (typeof item === 'string') {
                return synteticElements.text({ raw: item, key: '' })({
                    children: [],
                    store,
                });
            }
            const { name } = item;
            let targetElements =
                elements as unknown as BookBuilderElements<Token>;
            if (synteticElementNameSet.has(name)) {
                targetElements =
                    synteticElements as unknown as BookBuilderElements<Token>;
            }
            const path = name.split('.');
            let elemBuilder: TokenGetter<BookElementProps, Token> = path.reduce(
                (elems, name) => ((elems as any)[name] ?? {}) as any,
                targetElements as any
            );
            if (typeof elemBuilder !== 'function') {
                console.log(item);
                elemBuilder = synteticElements.error as TokenGetter<
                    BookElementProps,
                    Token
                >;
                return elemBuilder({ props: item.props, name: item.name })({
                    children: builder(item.children, store),
                    store,
                });
            }
            return elemBuilder(item.props)({
                children: builder(item.children, store),
                store,
            });
        };
        const itemBuilder = getItemBuilder(store);
        return flatList(schema.map(itemBuilder));
    };

    return builder;
}

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
        return templateToList(
            ...(children as [TemplateStringsArray, ...Children])
        );
    }
    return children as Children;
}
