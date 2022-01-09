import { BookApi, BookElements, ElementsApi } from './api';
import { defaultBookApi } from './defaultApi';
import { getBookMeta } from './meta';
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
    BookMeta,
    BookRawFlatSchema,
} from './model';
import { templateToList } from './utils';

export type Book = (api: BookApi) => { schema: BookRawSchema };

export type BookData<T> = {
    tokens: T[];
    meta: BookMeta;
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
        console.log({ item });
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
            console.log('proxy', { item });
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
            console.log({ item });
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
            console.log('counter', { item });
            const step = steps.get(props.use) ?? 1;
            counters.set(props.use, value + step);
        }
    }
}

function getStore<T>({
    builder,
    meta,
    schema,
}: {
    schema: BookSchema;
    builder: BookBuilder<T>;
    meta: BookMeta;
}): BookStore<T> {
    const result: BookStore<T> = { dataByKeys: {} };
    for (const [key, elem] of Object.entries(meta.elementsByKeys)) {
        // console.log({ key });
        result.dataByKeys[key] = builder([elem], (e) => result);
    }
    return result;
}

export function createBookParser<A extends BookApi>({ api }: { api: A }) {
    return function <T>({
        builder,
    }: {
        builder: BookBuilder<T>;
    }): (book: Book) => BookData<T> {
        return (book) => {
            const { schema: rawSchema } = book(api);
            const schema = getPureSchema(rawSchema);
            addKeysToSchema(schema);
            console.log({ schema });
            calculateCounters(schema);
            const meta = getBookMeta({ schema, api });
            console.log({ schema, meta });
            return {
                tokens: builder(schema, (e) =>
                    getStore({ builder: e, schema, meta })
                ),
                meta,
                store: getStore({ builder, schema, meta }),
            };
        };
    };
}

export const createBook = createBookParser({ api: defaultBookApi });

type BookBuilderParams<Token> = {
    elements: {
        [Name in keyof Omit<BookElements, 'format' | 'web'>]: (
            props: BookElements[Name]['props']
        ) => (children: Token[], store: BookStore<Token>) => Token;
    } & {
        format: {
            [Name in keyof BookElements['format']]: (
                props: BookElements['format'][Name]['props']
            ) => (children: Token[]) => Token;
        };
        web: {
            [Name in keyof BookElements['web']]: (
                props: BookElements['web'][Name]['props']
            ) => (children: Token[]) => Token;
        };
    };
    string: (str: string) => Token;
};

export function createBookBuilder<Token>({
    elements,
    string,
}: BookBuilderParams<Token>): BookBuilder<Token> {
    const builder: BookBuilder<Token> = (schema, getStore) =>
        schema
            .map((item) => {
                // console.log(item);
                if (typeof item === 'string') {
                    return string(item);
                }
                let elemBuilder;
                if (item.name.startsWith('web')) {
                    console.log(item.name.slice(4));
                    elemBuilder = elements.web[item.name.slice(4)];
                } else {
                    elemBuilder =
                        elements[item.name] ??
                        (() => (e: Token[]) => {
                            const r = string(`${e.join('')}`);
                            console.log('c', { e, r });
                            return r;
                        });
                }
                return elemBuilder(item.props)(
                    builder(item.children, getStore),
                    getStore(builder)
                );
            })
            .flat(Infinity);

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
