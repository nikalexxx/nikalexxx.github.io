import { BookElementProps, Primitive } from '@bookbox/core';
import { BookRawItem } from '@bookbox/preset-web';
import { parse, Body, Block, Attribute } from '@bookbox/markup';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';

export * from './definitions';

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

function resolveImports(ast: Body, parentPath: string): Body {
    const resultAst: Body = { blocks: [] };
    for (const block of ast.blocks) {
        const name = block.tag?.name;
        if (name === '#import') {
            const childPath = block.tag?.body?.blocks
                .filter((x) => x.text)
                .map((x) => x.text)
                .join('');
            if (!childPath) continue;
            const childAst = readMakrup(
                resolve(dirname(parentPath), childPath)
            );
            resultAst.blocks.push(...childAst.blocks);
        } else {
            resultAst.blocks.push(block);
        }
    }
    return resultAst;
}

function readMakrup(path: string): Body {
    const text = readFileSync(path).toString('utf-8');
    const ast = parse(text);

    return resolveImports(ast, path);
}

const rootPath = resolve(import.meta.dirname, './book.bbm');
const markupAst: Body = readMakrup(rootPath);

writeFileSync(
    resolve(import.meta.dirname, './ast.json'),
    JSON.stringify(markupAst, null, 2)
);

const rawSchema: BookRawItem[] = markupAst.blocks.map(getRawItem);
export default rawSchema;
