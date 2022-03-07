/**
 * Парсинг переносов строк (аля ).
 *
 * Единичный перенос строк не учитывается.
 * Более двух переносов: начиная со второго каждый перенос засчитывается как новая строка
 * @param text исходный текст
 * @param newLine представление новой строки
 * @returns список текста и новых строк
 */
export function parseNewLines<T>(newLine: T): (text: string) => (T | string)[] {
    return (text) => {
        const result = [];
        const brs = text.match(/\n\n+/g);
        if (!brs) {
            return [text];
        }
        let tail = text;
        let i;
        for (const br of brs) {
            i = tail.indexOf(br);
            const subbrs = [];
            if (br.length === 2) {
                subbrs.push(newLine);
            } else {
                for (let j = 0; j < 2 * br.length - 4; j++) {
                    subbrs.push(newLine);
                }
            }
            result.push(tail.slice(0, i), ...subbrs);
            tail = tail.slice(i + br.length);
        }
        if (tail) {
            result.push(tail);
        }

        return result;
    };
}

/**
 * разбивает текст по границам пробельных символов
 */
export function getTextTokens(text: string): string[] {
    const notWords = text.match(/\s+/g);
    if (!notWords) {
        return [text];
    }
    const tokens: string[] = [];
    let tail = text;
    for (const notWord of notWords) {
        const i = tail.indexOf(notWord);
        tokens.push(tail.slice(0, i), notWord);
        tail = tail.slice(i + notWord.length);
    }
    if (tail) {
        tokens.push(tail);
    }
    return tokens;
}

export function flatList(elems: any[]): any[] {
    const stack = [elems];
    const result = [];
    while (stack.length) {
        const current = stack.pop();
        if (Array.isArray(current)) {
            for (let i = current.length - 1; i >= 0; i--) {
                stack.push(current[i]);
            }
        } else {
            result.push(current);
        }
    }

    return result;
}

export function templateToList<T>(
    text: TemplateStringsArray,
    ...elements: T[]
): (T | string)[] {
    const result: (T | string)[] = [text[0]];
    for (let i = 1; i < text.length; i++) {
        result.push(elements[i - 1], text[i]);
    }
    return result;
}

export function isTemplateParams(
    args: any[]
): args is [TemplateStringsArray, ...any[]] {
    return (
        args[0] &&
        Array.isArray(args[0]) &&
        'raw' in args[0] &&
        Array.isArray(args[0]['raw'])
    );
}
