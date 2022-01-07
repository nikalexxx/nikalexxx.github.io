import { BookElements } from './api';
import { BookBuilder, BookElementSchema, BookSchema } from './model';

type BookHeader = {
    text: string;
    key: string;
    level: number;
};

export type BookMeta<T> = {
    contents: BookHeader[];
    images: Map<string, T[]>;
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
    builder: BookBuilder<T>
): BookMeta<T>['images'] => {
    const imageList = getImageList(schema);
    let i = 0;
    return new Map(imageList.map((image) => [`${i++}`, builder([image])]));
};

export function getBookMeta<T>({
    schema,
    builder,
}: {
    schema: BookSchema;
    builder: BookBuilder<T>;
}): BookMeta<T> {
    return {
        contents: getContents(schema),
        images: getImages(schema, builder),
    };
}
