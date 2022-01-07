import { BookApi, BookElements, ElementsApi } from "./api";
import { defaultBookApi } from "./defaultApi";
import { BookMeta, getBookMeta } from "./meta";
import { BookBuilder, BookElementProps, BookElementSchema, BookItem, BookRawSchema, BookSchema, GetSchema, BookResult, BookRawItem } from './model';
import { templateToList } from './utils';

export type Book = (api: BookApi) => { schema: BookRawSchema };

export type BookData<T> = {
    tokens: T[];
    meta: BookMeta<T>;
};

function isBookResult(x: BookRawItem): x is BookResult {
    return typeof x === 'object' && 'schema' in x;
}

/**
 * Составление дерева с учётом границ
 */
export function getPureSchema(schema: BookRawSchema): BookSchema {
    const result: BookSchema = [];
    const stack: BookElementSchema[] = [];
    const getTarget = () => stack.length > 0 ? stack[stack.length - 1].children : result;

    for (const item of schema) {
        // куда класть текущие элементы
        const target = getTarget();

        if (typeof item === 'string') {
            target.push(item);
        } else if (isBookResult(item)) {
            // вложенные книги
            target.push(...getPureSchema(item.schema))
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

export function createBookParser<A extends BookApi>({ api }: { api: A }) {
    return function <T>({
        builder,
    }: {
        builder: BookBuilder<T>;
    }): (book: Book) => BookData<T> {
        return (book) => {
            const { schema: rawSchema } = book(api);
            const schema = getPureSchema(rawSchema);
            console.log({ schema });
            return {
                tokens: builder(schema),
                meta: getBookMeta({schema, builder})
            };
        };
    };
}

export const createBook = createBookParser({ api: defaultBookApi });

type BookBuilderParams<Token> = {
    elements: {
        [Name in keyof Omit<BookElements, 'format'>]: (
            props: BookElements[Name]['props']
        ) => (children: Token[]) => Token;
    } & {
        format: {
            [Name in keyof BookElements['format']]: (
                props: BookElements['format'][Name]['props']
            ) => (children: Token[]) => Token;
        };
    };
    string: (str: string) => Token;
};

export function createBookBuilder<Token>({
    elements,
    string,
}: BookBuilderParams<Token>): (schema: BookSchema) => Token[] {
    const builder: (schema: BookSchema) => Token[] = (schema) =>
        schema
            .map((item) => {
                console.log(item);
                if (typeof item === 'string') {
                    return string(item);
                }
                return elements[item.name](item.props)(builder(item.children));
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
