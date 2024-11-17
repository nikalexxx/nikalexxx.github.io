import { BookElementProps, BookItem } from '@bookbox/core';
import { BookRawItem } from '@bookbox/preset-web';

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

function print(rawChildren: BookItem[]): string {
    return rawChildren
        .map((x) => (typeof x === 'string' ? x : print(x.children)))
        .join('');
}

export const definitions: Record<string, Config> = {
    'def.proof': {
        name: 'area',
        getChildren: (props, children) => ['ᐊ ', ...children, ' ᐅ'],
    },
    'def.theorem': {
        name: 'area',
        getChildren: (props, children) => [
            {
                name: 'format.b',
                props: { inline: true, key: `${props.key ?? ''}_name` },
                children: [
                    'Теорема ',
                    {
                        name: 'counter',
                        props: {
                            use: 'theorem',
                            key: `${props.key ?? ''}_link`,
                        },
                        children: [],
                    },
                    ...(props.name ? [' (', String(props.name), ')'] : []),
                    '. ',
                ],
            },
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
    'def.link': {
        name: 'label',
        getChildren: (props, children) => [
            {
                name: 'use',
                props: {
                    ref: `${print(children)}_link`,
                },
                children: [],
            },
        ],
        getProps: (props, children) => ({
            ref: print(children),
        }),
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
                        props: { inline: true, key: `${props.key ?? ''}_link` },
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
                    end: 'table',
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
                },
                children: [],
            },
            {
                name: 'counter',
                props: {
                    start: 'table',
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
    'def.table': {
        name: 'table',
        getChildren: (props, children) => [
            ...children,
            {
                name: 'area',
                props: { inline: true },
                children: [
                    'Таблица ',
                    {
                        name: 'area',
                        props: {
                            inline: true,
                            key: `${props.key ?? ''}_link`,
                        },
                        children: [
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
                                    use: 'table',
                                    key: `${props.key ?? ''}_counter`,
                                },
                                children: [],
                            },
                        ],
                    },
                    '. ',
                    String(props.name),
                ],
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
