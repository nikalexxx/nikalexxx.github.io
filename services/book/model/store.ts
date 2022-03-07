import { BookBuilder, BookElementSchema, BookSchema, BookStore } from './model';

export function getStore<T>({
    builder,
    schema,
}: {
    schema: BookSchema;
    builder: BookBuilder<T>;
}): BookStore<T> {
    const result: BookStore<T> = {
        dataByKeys: {},
        elementsByKeys: getElementsByKeys(schema),
    };
    for (const [key, elem] of Object.entries(result.elementsByKeys)) {
        // FIXME: поздние ключи могут использовать более ранние, но не наоборот
        result.dataByKeys[key] = builder([elem], result);
    }
    return result;
}

function getElementsByKeys(
    schema: BookSchema
): Record<string, BookElementSchema> {
    const result: Record<string, BookElementSchema> = {};
    for (const item of schema) {
        if (typeof item === 'string') {
            continue;
        }
        result[item.props.key as string] = item;
    }
    return result;
}
