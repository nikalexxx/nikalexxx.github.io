import { BookApi, TextFormatApi, UtilApi, WebApi } from './api';
import {
    Api,
    BookElementProps,
    BookEnd,
    BookItem,
    BookStart,
    GetSchema,
} from './model';
import { markerEnd, markerStart, markerSymbol } from './symbols';
import { isTemplateParams, templateToList } from './utils';

type TemplatePrepare = (text: TemplateStringsArray, ...elemets: any[]) => any;

const getElement: (name: string) => (props: BookElementProps) => GetSchema =
    (name) =>
    (props) =>
    (...children) => {
        const list: BookItem[] = isTemplateParams(children)
            ? templateToList(...children)
            : children;

        // console.log({ name, props, list });

        return {
            name,
            props,
            children: list,
        };
    };

const proxyBuilder = <T extends (...args: any[]) => any>(
    getBuild: (params: Record<string, any>) => T,
    prepare: TemplatePrepare
) => {
    const getProxy = (params: Record<string, any>) =>
        new Proxy(getBuild(params), {
            get(_, name) {
                return (...children: any[]) => {
                    const value: any = isTemplateParams(children)
                        ? prepare(...children)
                        : children[0];
                    // console.log({name, value})
                    return getProxy({ ...params, [name]: value });
                };
            },
        });

    return getProxy({});
};

function getElementProxy<CApi extends Api<any>>() {
    return function g<T extends keyof CApi>(
        name: T,
        prepare: TemplatePrepare = String.raw
    ) {
        const getElementWithProps = getElement(name as string);

        const builder = proxyBuilder(
            (params) => getElementWithProps(params),
            prepare
        );
        builder[markerSymbol] = name;

        return builder as unknown as CApi[T];
    };
}

export const bookStart: BookStart = (elem) => {
    const { name, props } = elem();
    return {
        __start: name,
        props,
    };
};

export const bookEnd: BookEnd = (elem) => {
    const { name, props } = elem();
    return {
        __end: name,
        props,
    };
};

export const bookCreator: UtilApi['book'] = (text, ...elements) => {
    // console.log({ text, elements });
    return { schema: templateToList(text, ...elements) };
};

bookCreator.root = bookCreator;

const getRootProxy =
    getElementProxy<Omit<BookApi, 'format' | 'book' | 'start' | 'end'>>();
const getFormatProxy = getElementProxy<Api<TextFormatApi>>();
const getWebProxy = getElementProxy<Api<WebApi>>();
export const defaultBookApi: BookApi = {
    title: getRootProxy('title'),
    authors: getRootProxy('authors'),
    draft: getRootProxy('draft'),
    em: getRootProxy('em'),
    strong: getRootProxy('strong'),
    format: {
        sup: getFormatProxy('sup'),
        sub: getFormatProxy('sub'),
        pre: getFormatProxy('pre'),
        i: getFormatProxy('i'),
        b: getFormatProxy('b'),
    },
    web: {
        video: getWebProxy('web-video' as any),
        audio: getWebProxy('web-audio' as any),
        message: getWebProxy('web-message' as any),
    },
    header: getRootProxy('header'),
    code: getRootProxy('code'),
    label: getRootProxy('label'),
    link: getRootProxy('link'),
    tooltip: getRootProxy('tooltip'),
    image: getRootProxy('image'),
    external: getRootProxy('external'),
    area: getRootProxy('area'),
    list: getRootProxy('list'),
    separator: getRootProxy('separator'),
    item: getRootProxy('item'),
    small: getRootProxy('small'),
    math: getRootProxy('math'),
    video: getRootProxy('video'),
    audio: getRootProxy('audio'),
    use: getRootProxy('use'),
    counter: getRootProxy('counter'),

    start: bookStart,
    end: bookEnd,
    book: bookCreator,
};
