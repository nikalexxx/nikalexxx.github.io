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
