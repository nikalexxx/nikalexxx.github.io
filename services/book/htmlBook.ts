import { bookGiudeRu } from './book-guide';
import { createBookBuilder, createBook } from './model';

const tag =
    <T extends string>(
        arg: TemplateStringsArray | T,
        props: Record<string, string> = {}
    ) =>
    (children: any) => {
        return `<${typeof arg === 'string' ? arg : arg[0]} ${Object.entries(props)
            .map(([name, value]) => `${name}="${value}"`)
            .join(' ')}>${children}</${arg[0]}>`;
    };

const htmlBuilder = createBookBuilder<string>({
    elements: {
        title: () => tag`h1`,
        authors: () => tag`span`,
        draft: () => tag`div${{ style: 'border: 5px solid red' }}`,
        header: ({ level }) => {
            console.log({ level });
            return tag(`h${level}`);
        },
        b: () => tag`b`,
        i: () => tag`i`,
        sub: () => tag`sub`,
        sup: () => tag`sup`,
        a: ({ href }) => tag`a${{ href }}`,
        code: ({ lang }) => tag`code${{ ['data-code-language']: lang }}`,
        pre: () => tag`pre`,
        label: () => tag`span`,
        tooltip: ({ content }) => tag`span${{ title: `${content}` }}`,
        link: ({ ref }) => tag`span`,
        image: ({ src, alt, position, height }) => tag`img${{ src, alt }}`,
        $: () => tag`span`,
        $$: () => tag`span`,
        area: ({ key, inline, meta }) => tag`div`,
        li: () => tag`li`,
        small: ({ inline }) => tag`span`,
        list: ({ order }) => (order ? tag`ol` : tag`ul`),
        external: ({ scope }) => tag`div`,
    },
    string: (e) => e,
});

const createHtmlBook = createBook({ builder: htmlBuilder });

(window as any).guide = createHtmlBook(bookGiudeRu).join('\n');
