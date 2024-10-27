import { BookElementProps, Primitive, BookItem } from '@bookbox/core';
import { BookRawItem } from '@bookbox/preset-web';
import { parse, Body, Block, Attribute } from '@bookbox/markup';
import { readFileSync, writeFileSync } from 'fs';

type Config = {
    name: string;
    getProps?(
        rawProps: BookElementProps,
        rawChildren: BookItem[]
    ): BookElementProps;
    getChildren?(
        rawProps: BookElementProps,
        rawChildren: BookItem[]
    ): BookRawItem[];
    addtoStart?: () => BookItem[];
};

export const definitions: Record<string, Config> = {
    'def.proof': {
        name: 'area',
        getChildren: (props, children) => ['ᐊ ', ...children, ' ᐅ'],
    },
    'def.theorem': {
        name: 'area',
        getChildren: (props, children) => [
            {
                name: 'area',
                props: { inline: true, key: `${props.key ?? ''}_name` },
                children: [
                    'Теорема ',
                    {
                        name: 'counter',
                        props: { use: 'theorem' },
                        children: [],
                    },
                ],
            },
            '. ',
            ...children,
        ],
        addtoStart: () => [
            {
                name: 'counter',
                props: {
                    start: 'theorem',
                    initial: 1,
                },
                children: [],
            },
        ],
    },
    'def.problem': {
        name: 'format.small',
        getChildren: (props, children) => [
            {
                name: 'format.b',
                props: {},
                children: [
                    {
                        name: 'area',
                        props: { inline: true, key: `${props.key ?? ''}_name` },
                        children: [
                            {
                                name: 'counter',
                                props: { use: 'problem' },
                                children: [],
                            },
                        ],
                    },
                    '. ',
                ],
            },
            ...children,
        ],
        addtoStart: () => [
            {
                name: 'counter',
                props: {
                    start: 'problem',
                },
                children: [],
            },
        ],
    },
    'def.chapter': {
        name: 'header',
        getProps: (props) => ({
            ...props,
            level: 2,
        }),
        getChildren: (props, children) => [
            {
                name: 'counter',
                props: {
                    end: 'section',
                },
                children: [],
            },
            {
                name: 'counter',
                props: {
                    use: 'chapter',
                },
                children: [],
            },
            {
                name: 'counter',
                props: {
                    start: 'section',
                    initial: 1,
                },
                children: [],
            },
            '. ',
            ...children,
        ],
        addtoStart: () => [
            {
                name: 'counter',
                props: {
                    start: 'chapter',
                    initial: 1,
                },
                children: [],
            },
        ],
    },
    'def.section': {
        name: 'header',
        getProps: (props) => ({
            ...props,
            level: 3,
        }),
        getChildren: (props, children) => [
            {
                name: 'counter',
                props: {
                    last: 'chapter',
                },
                children: [],
            },
            '.',
            {
                name: 'counter',
                props: {
                    use: 'section',
                },
                children: [],
            },
            '. ',
            ...children,
        ],
    },
    row: {
        name: 'row',
        getChildren: (props, children) => [
            // {
            //     __start: 'cell',
            //     props: {},
            // },
            ...children,
            // {
            //     __end: 'cell',
            //     props: {},
            // },
        ],
    },
    col: {
        name: '',
        getChildren: (props, children) => [
            {
                __end: 'cell',
                props: {},
            },
            {
                __start: 'cell',
                props: {},
            },
        ],
    },
};

function getProps(attrList: Attribute[]): BookElementProps {
    const props: BookElementProps = {};
    for (const attr of attrList) {
        const { name, value, empty } = attr;
        let v: Primitive = value;
        if (empty) {
            v = true;
        } else {
            const n = parseFloat(value);
            if (!Number.isNaN(n)) v = n;
        }
        props[name] = v;
    }
    return props;
}

function getName(tagName: string): string {
    return tagName.split(':').join('.');
}

function getRawItem(block: Block): BookRawItem {
    if (block.text) return block.text.replace(/\\./g, (s) => s[1]);
    if (block.include)
        // интерпретация только здесь
        return {
            name: 'math',
            props: {
                block: block.include.value.startsWith('\n'),
            },
            children: [block.include.value],
        };
    if (block.tag) {
        const { name, attrList, body, separator } = block.tag;
        const props = getProps(attrList);
        if (name.startsWith('#')) {
            const elemName = name.slice(name.split(':')[0].length + 1);
            if (name.startsWith('#start')) {
                return {
                    __start: getName(elemName),
                    props,
                };
            }
            if (name.startsWith('#end')) {
                return {
                    __end: getName(elemName),
                    props,
                };
            }
            return null;
        }
        return {
            name: getName(name),
            props: getProps(attrList),
            children: (body?.blocks ?? []).map(getRawItem),
        };
    }
    if (block.error) {
        return {
            name: 'error',
            props: {
                name: block.error.message ?? 'parsing error',
                error: block.error.value,
            },
            children: [],
        };
    }
    return null;
}

const text = readFileSync(
    './data/vereshagin-shen-firstord/1/1/text.bbm'
).toString('utf-8');
const markupAst: Body = parse(text);
writeFileSync('./ast.json', JSON.stringify(markupAst, null, 2));

const rawSchema: BookRawItem[] = markupAst.blocks.map(getRawItem);
export default rawSchema;
