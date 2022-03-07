import { BookElements, BookApi, MediaApi } from './api';
import {
    BookBuilder,
    BookElementSchema,
    BookHeader,
    BookSchema,
    BookStore,
} from './model';

export type BookItemMeta = {
    keysList: string[];
    keysByHeader: Record<string, string[]>;
};
export type BookMeta<T> = {
    contents: BookHeader<T>[];
    media: Record<keyof MediaApi, BookItemMeta>;
};

function getGroup<T>({
    condition,
    map,
}: {
    condition: (item: BookElementSchema) => boolean;
    map: (item: BookElementSchema) => T;
}) {
    return (schema: BookSchema): T[] => {
        const result: T[] = [];

        const addContents = (schema: BookSchema) => {
            for (const item of schema) {
                if (typeof item === 'string') {
                    continue;
                }
                if (condition(item)) {
                    result.push(map(item));
                    continue;
                }
                addContents(item.children);
            }
        };

        addContents(schema);

        return result;
    };
}

function getObjectsByHeader({
    condition,
}: {
    condition: (item: BookElementSchema) => boolean;
}) {
    return (schema: BookSchema): Record<string, string[]> => {
        const result: Record<string, string[]> = {};
        let currentHeader = 'root';

        const addContents = (schema: BookSchema) => {
            for (const item of schema) {
                if (typeof item === 'string') {
                    continue;
                }
                if (item.name === 'header') {
                    currentHeader = item.props.key as string;
                }
                if (condition(item)) {
                    if (!result[currentHeader]) {
                        result[currentHeader] = [];
                    }
                    result[currentHeader].push(item.props.key as string);
                    continue;
                }
                addContents(item.children);
            }
        };

        addContents(schema);

        return result;
    };
}

const getContents = <T>(builder: BookBuilder<T>, store: BookStore<T>) =>
    getGroup({
        condition: (item) => item.name === 'header',
        map: (item) => {
            const headerProps = item.props as BookElements['header']['props'];

            const header: BookHeader<T> = {
                value: builder([item], store),
                text: item.children
                    .map((value) =>
                        typeof value === 'string'
                            ? value
                            : JSON.stringify(value)
                    )
                    .join(''),
                key: headerProps.key,
                level: headerProps.level,
            };
            return header;
        },
    });

const getImageList = getGroup({
    condition: (e) => e.name === 'image',
    map: (e) => e,
});
const getImages = <T>(schema: BookSchema): BookMeta<T>['media']['image'] => {
    const imageList = getImageList(schema);
    return {
        keysList: imageList.map((e) => e.props.key as string),
        keysByHeader: getObjectsByHeader({
            condition: (e) => e.name === 'image',
        })(schema),
    };
};

const getItemList = (name: string) =>
    getGroup({
        condition: (e) => e.name === name,
        map: (e) => e,
    });

const getItemMeta = (schema: BookSchema, name: string): BookItemMeta => {
    const imageList = getItemList(name)(schema);
    return {
        keysList: imageList.map((e) => (e.props.key ?? '') as string),
        keysByHeader: getObjectsByHeader({
            condition: (e) => e.name === name,
        })(schema),
    };
};

export function getBookMeta<T>({
    schema,
    store,
    builder,
}: {
    schema: BookSchema;
    store: BookStore<T>;
    builder: BookBuilder<T>;
}): BookMeta<T> {
    return {
        contents: getContents(builder, store)(schema),
        media: {
            image: getItemMeta(schema, 'image'),
            video: getItemMeta(schema, 'video'),
            audio: getItemMeta(schema, 'audio'),
        },
    };
}
