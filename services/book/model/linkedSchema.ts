import { defaultBlockNames } from './api';
import {
    BookItem,
    BookLayoutView,
    BookLinkedItem,
    BookLinkedSchema,
    BookSchema,
} from './model';
import { getTextTokens } from './utils';
import { BookElementProps } from './model';

const onlyBlocks: Set<string> = new Set(['image']);
export function getElementView(item: BookItem): BookLayoutView {
    if (typeof item === 'string') {
        return 'inline';
    }
    const { props: userProps, name } = item;
    const props: BookElementProps = {
        block: defaultBlockNames.has(name as any),
        ...userProps,
    };
    if (props.inline) {
        return 'inline';
    }
    if (props.block) {
        return 'block';
    }
    return props.position === 'inline' ? 'inline' : 'block';
}

export const getTextLinkedItem: (text: string) => BookLinkedItem = (text) => ({
    bookElementSchema: {
        name: 'text',
        props: {},
        children: [],
    },
    raw: text,
    previous: null,
    next: null,
    previousLeaf: null,
    nextLeaf: null,
    parent: null,
    firstChild: null,
    lastChild: null,
    view: 'inline',
});

export const getPageLinkedItem: (count: number) => BookLinkedItem = (count) => {
    const text = `${count}`;
    const textItem = getTextLinkedItem(text);
    return {
        bookElementSchema: {
            name: 'page',
            props: {count},
            children: [],
        },
        raw: text,
        previous: null,
        next: null,
        previousLeaf: null,
        nextLeaf: null,
        parent: null,
        firstChild: textItem,
        lastChild: textItem,
        view: 'inline',
    };
};

function bindList(items: BookLinkedItem[]): void {
    for (let i = 1; i < items.length; i++) {
        const prev = items[i - 1];
        const current = items[i];

        current.previous = prev;
        prev.next = current;
    }
}

function bindLeafList(items: BookLinkedItem[]): void {
    for (let i = 1; i < items.length; i++) {
        const prev = items[i - 1];
        const current = items[i];

        current.previousLeaf = prev;
        prev.nextLeaf = current;
    }
}

function bindParent(items: BookLinkedItem[], parent: BookLinkedItem): void {
    for (const childItem of items) {
        childItem.parent = parent;
    }

    parent.firstChild = items[0] ?? null;
    parent.lastChild = items[items.length - 1] ?? null;
}

const isNotEmpty = (text: any) => text !== '';

export function getBookLinkedItem(item: BookItem): BookLinkedItem {
    if (typeof item === 'string') {
        const textItem = getTextLinkedItem(item);
        const children = getTextTokens(item)
            .filter(isNotEmpty)
            .map(getTextLinkedItem);

        bindList(children);
        bindParent(children, textItem);

        return textItem;
    }

    const linkedItem: BookLinkedItem = {
        bookElementSchema: item,
        firstChild: null,
        lastChild: null,
        raw: null,
        previous: null,
        next: null,
        previousLeaf: null,
        nextLeaf: null,
        parent: null,
        view: getElementView(item),
    };

    const children = getBookLinkedSchema(item.children).tree;

    bindList(children);
    bindParent(children, linkedItem);

    return linkedItem;
}

function getLinkedItemList(
    start: BookLinkedItem | null,
    end: BookLinkedItem | null
): BookLinkedItem[] {
    if (!start) {
        return [];
    }
    const result: BookLinkedItem[] = [];
    let current = start;
    while (current && current !== end) {
        result.push(current);
        // console.log('current', current);
        current = current.next;
    }
    if (end) {
        result.push(end);
    }

    return result;
}

function getLeafListLinkedItem(
    linkedItems: BookLinkedItem[]
): BookLinkedItem[] {
    const list: BookLinkedItem[] = [];
    for (const item of linkedItems) {
        if (item.firstChild === null) {
            list.push(item);
        } else {
            list.push(
                ...getLeafListLinkedItem(
                    getLinkedItemList(item.firstChild, item.lastChild)
                )
            );
        }
    }
    return list;
}

export function getBookLinkedSchema(
    schema: BookSchema,
    root?: boolean
): BookLinkedSchema {
    const linkedSchema: BookLinkedSchema = {
        start: null,
        end: null,
        tree: schema.filter(isNotEmpty).map(getBookLinkedItem),
    };
    bindList(linkedSchema.tree);

    if (schema.length === 0 || !root) {
        return linkedSchema;
    }

    const leafList: BookLinkedItem[] = getLeafListLinkedItem(linkedSchema.tree);

    bindLeafList(leafList);
    putPages(leafList);

    linkedSchema.start = leafList[0];
    linkedSchema.end = leafList[leafList.length - 1];
    linkedSchema.tree = getLinkedItemList(linkedSchema.tree[0], null);

    return linkedSchema;
}

export function getLinkedLeafList(
    linkedSchema: BookLinkedSchema
): BookLinkedItem[] {
    const list: BookLinkedItem[] = [];

    let current: BookLinkedItem | null = linkedSchema.start;
    while (current !== null) {
        list.push(current);
        current = current.nextLeaf;
    }
    return list;
}

export function getSchemaFromLinkedList(
    linkedList: BookLinkedItem[]
): BookSchema {
    const schema: BookSchema = [];

    for (const item of linkedList) {
        const {bookElementSchema, raw, firstChild, lastChild} = item;
        const {name, props} = bookElementSchema;
        if (name === 'text' && raw && firstChild === null) {
            schema.push(raw);
        } else if (name === 'text') {
            schema.push(
                ...getSchemaFromLinkedList(
                    getLinkedItemList(firstChild, lastChild)
                )
            );
        } else {
            schema.push({
                name: name,
                props: props,
                children: getSchemaFromLinkedList(
                    getLinkedItemList(firstChild, lastChild)
                ),
            });
        }
    }

    return schema;
}

function putAfterItem(
    sourceItem: BookLinkedItem,
    targetItem: BookLinkedItem
): void {
    const { next, nextLeaf, parent } = sourceItem;

    targetItem.next = next;
    if (next) {
        next.previous = targetItem;
    }

    targetItem.nextLeaf = nextLeaf;
    if (nextLeaf) {
        nextLeaf.previousLeaf = targetItem;
    }

    sourceItem.next = targetItem;
    targetItem.previous = sourceItem;

    sourceItem.nextLeaf = targetItem;
    targetItem.previousLeaf = sourceItem;

    targetItem.parent = parent;
    if (parent && parent.lastChild === sourceItem) {
        parent.lastChild = targetItem;
    }
}

const PAGE_SIZE = 50;
function putPages(items: BookLinkedItem[]): void {
    if (items.length === 0) {
        return;
    }
    let pageCount = 0;
    let currentBlockCount = 0;
    for (const item of items) {
        const { raw, view } = item;
        const isBlock = view === 'block';
        // const newLineCount = 0;
        const increment = !isBlock ? raw?.length ?? 0 : 0;
        currentBlockCount += increment;
        // console.log({ currentBlockCount, raw, increment });
        if (isBlock || currentBlockCount >= PAGE_SIZE) {
            // console.log(raw, item, pageCount);
            currentBlockCount = 0;
            const pageItem = getPageLinkedItem((pageCount++));
            putAfterItem(item, pageItem);
        }
    }
}
