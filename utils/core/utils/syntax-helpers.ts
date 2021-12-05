import { setType } from './type-helpers';

/** разбор тегового шаблона */
export function strToArray<T>(
    strings: TemplateStringsArray,
    ...elements: T[]
): (T | string)[] {
    const list: (T | string)[] = [strings[0]];
    for (let i = 1; i < strings.length; i++) {
        list.push(elements[i - 1], strings[i]);
    }
    return list;
}

export function isTemplateString(args: any[]): args is [TemplateStringsArray, ...any[]] {
    const arg = args[0];
    if (!Array.isArray(arg)) {
        return false;
    }
    setType<any[] & {raw: any}>(arg);
    if (!('raw' in arg)) {
        return false;
    }
    if (!Array.isArray(arg.raw)) {
        return false;
    }
    return typeof arg.raw[0] === 'string';
}
