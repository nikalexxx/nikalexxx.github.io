export interface CodeData {
    title: string;
    description: string;
    links?: string[];
    codeLinks?: string[];
    artefactLinks?: string[];
}

export const codeList: CodeData[] = [
    {
        title: 'parvis',
        description: 'Light framework for user interfaces',
        codeLinks: ['https://github.com/nikalexxx/parvis'],
        artefactLinks: ['https://www.npmjs.com/package/parvis'],
    },
    {
        title: 'bookbox',
        description: 'book tool for internet',
        links: [
            'https://bookbox-format.github.io',
            'https://nikalexxx.github.io/?/blog/21',
        ],
        codeLinks: ['https://github.com/bookbox-format/bookbox'],
        artefactLinks: [
            'https://www.npmjs.com/package/@bookbox/core',
            'https://www.npmjs.com/package/@bookbox/generator-js',
            'https://www.npmjs.com/package/@bookbox/view-html',
            'https://www.npmjs.com/package/@bookbox/preset-web',
        ],
    },
    {
        title: 'htmp-tag-types',
        description: 'All html tags in typescript',
        codeLinks: ['https://github.com/nikalexxx/html-tag-types'],
        artefactLinks: ['https://www.npmjs.com/package/html-tag-types'],
    },
    {
        title: 'dot-tree-syntax',
        description: 'Dot syntax for building trees',
        codeLinks: ['https://github.com/nikalexxx/dot-tree-syntax'],
        artefactLinks: ['https://www.npmjs.com/package/dot-tree-syntax'],
    },
    {
        title: 'ts-pro',
        description: 'Advanced utility types for TypeScript',
        codeLinks: ['https://github.com/nikalexxx/ts-pro'],
        artefactLinks: ['https://www.npmjs.com/package/ts-pro'],
    },
    {
        title: 'fp-magic',
        description: 'Functional programming in javascript',
        codeLinks: ['https://github.com/nikalexxx/fp-magic'],
        artefactLinks: ['https://www.npmjs.com/package/fp-magic'],
    },
];
