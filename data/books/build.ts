import { BookItem, BookElementProps, BookSchema } from '@bookbox/core';
import { BookRawItem, getBookSchema } from '@bookbox/preset-web';
import { readdirSync, writeFileSync } from 'fs';
type Config = {
    name: string;
    getProps?(
        rawProps: BookElementProps,
        rawChildren: BookItem[]
    ): BookElementProps;
    getChildren?(
        rawProps: BookElementProps,
        rawChildren: BookItem[]
    ): BookItem[];
    addtoStart?(): BookItem[];
};

type Defs = Record<string, Config>;
const firstDef = new Set<string>();
function expandDefinition(
    elem: BookItem,
    defs: Defs,
    startSchema: BookSchema
): BookRawItem[] {
    if (typeof elem === 'string') return [elem];
    if (!defs.hasOwnProperty(elem.name)) {
        if (elem.name?.startsWith('def.')) return [''];
        return [
            {
                ...elem,
                children: expandAllDefinitions(
                    elem.children ?? [],
                    defs,
                    startSchema
                ),
            },
        ];
    }
    const localName = elem.name;
    if (!(localName in defs)) return [''];
    const config = defs[localName];
    if (!firstDef.has(localName)) {
        const add = config.addtoStart;
        if (add) startSchema.push(...add());
        firstDef.add(localName);
    }

    const children = expandAllDefinitions(
        config.getChildren?.(elem.props, elem.children) ?? elem.children ?? [],
        defs,
        startSchema
    );

    if (!config.name) return children;

    return [
        {
            name: config.name,
            props: config.getProps?.(elem.props, elem.children) ?? elem.props,
            children,
        },
    ];
}

function expandAllDefinitions(
    bookSchema: BookSchema,
    defs: Defs,
    startSchema: BookSchema
): BookRawItem[] {
    return bookSchema.flatMap((elem) =>
        expandDefinition(elem, defs, startSchema)
    );
}

const watchFilePath = process.argv[2] || '';
const watchDir = watchFilePath.split('/')[3] || '';

const update = process.argv[3] || '';

const dirList = watchDir
    ? [watchDir]
    : readdirSync(`./data`, { withFileTypes: true })
          .filter((dirent) => dirent.isDirectory())
          .map((dirent) => dirent.name);

const getCommand = (dirName: string) => {
    const sourceDir = `./data/${dirName}`;
    return {
        command: async () => {
            const data = await import(`${sourceDir}/index.js`);
            const params =
                typeof data.default === 'function'
                    ? { book: data.default }
                    : { rawSchema: data.default };
            let bookSchema = getBookSchema(params).schema;
            const startSchema = [];
            if (data.definitions) {
                let rawBookSchema = expandAllDefinitions(
                    bookSchema,
                    data.definitions,
                    startSchema
                );
                bookSchema = getBookSchema({ rawSchema: rawBookSchema }).schema;
                rawBookSchema = expandAllDefinitions(
                    bookSchema,
                    data.definitions,
                    startSchema
                );
                bookSchema = getBookSchema({ rawSchema: rawBookSchema }).schema;
            }
            writeFileSync(
                `${sourceDir}/schema.json`,
                JSON.stringify([...startSchema, ...bookSchema], null, 2)
            );
        },
    };
};

for (const dirName of dirList) {
    const { command } = getCommand(dirName);
    const now = Date.now();
    process.stdout.write(`compile ${dirName}`);
    command();
    if (update) {
        writeFileSync(update, '0');
    }
    process.stdout.write(
        ` — \x1b[32mok\x1b[0m \x1b[36m${Math.ceil(
            (Date.now() - now) / 1000
        )}s\x1b[0m\n`
    );

    // buildProcess.stdout.pipe(process.stdout);
    // buildProcess.stderr.pipe(process.stderr);
    // buildProcess.addListener("exit", copy);
}
