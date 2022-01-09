import { BookElements, BookApi } from './api';
import { BookBuilder, BookElementSchema, BookHeader, BookMeta, BookSchema } from './model';


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

const getContents = getGroup({
    condition: (item) => item.name === 'header',
    map: (item) => {
        const headerProps = item.props as BookElements['header']['props'];

        const header: BookHeader = {
            text: item.children
                .map((value) =>
                    typeof value === 'string' ? value : JSON.stringify(value)
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
const getImages = <T>(
    schema: BookSchema,
): BookMeta['images'] => {
    const imageList = getImageList(schema);
    return {
        keysList: imageList.map(e => e.props.key as string),
        keysByHeader: getObjectsByHeader({condition: (e) => e.name === 'image'})(schema)
    };
};

function getElementsByKeys(schema: BookSchema): Record<string, BookElementSchema> {
    const result: Record<string, BookElementSchema>  = {};
    for (const item of schema) {
        if (typeof item === 'string') {
            continue;
        }
        result[item.props.key as string] = item;
    }
    return result;
}

export function getBookMeta<T, A extends BookApi>({
    schema,
    api
}: {
    schema: BookSchema;
    api: A;
}): BookMeta {
    return {
        contents: getContents(schema),
        images: getImages(schema),
        elementsByKeys: getElementsByKeys(schema),
    };
}
