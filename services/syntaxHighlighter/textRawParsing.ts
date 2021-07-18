import { TextElement, TextElementEndl, TextElementRaw, TextElementType } from './model';

/**
 * Парсим массив строк в связный список
 * Возвращаем голову списка или null, если строк нет
 */
export function parseLines(lines: string[]): TextElementRaw | null {
    let headTextElement: TextElementRaw | null = null;
    let prev: TextElement | null = null;
    let prevRaw: TextElementRaw | null = null;
    let prevEndl: TextElementEndl | null = null; // предыдущий перевод строки

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const textElementRaw: TextElementRaw = {
            type: TextElementType.Raw,
            raw: line,
            prev: i === 0 ? null : prev,
            next: null, // пока не знаем, запишем на следующем шаге
            prevEndl: i === 0 ? null : prevEndl,
            nextEndl: null, // пока не знаем, запишем на следующем шаге
            prevRaw: i === 0 ? null : prevRaw,
            nextRaw: null, // пока не знаем, запишем на следующем шаге
        };

        const textElementEndl: TextElementEndl = {
            type: TextElementType.Endl,
            prev: textElementRaw, // текущая строка
            next: null, // пока не знаем, запишем на следующем шаге
            prevRaw: textElementRaw, // текущая строка
            nextRaw: null, // пока не знаем, запишем на следующем шаге
        };

        if (i === 0) {
            // сохраняем первый элемент
            headTextElement = textElementRaw;
        }

        if (i !== lines.length) {
            // для любой строки, кроме последней, следующий элемент это перевод строки
            textElementRaw.next = textElementEndl;
            textElementRaw.nextEndl = textElementEndl;
            // для последней остаётся null
        }



        if (i !== 0) {
            // для любой строки, кроме первой, есть предыдущие строки и узлы
            const prevRawElement = textElementRaw.prevRaw; // предыдущий текстовый элемент
            prevRawElement!.nextRaw = textElementRaw; // ссылка на следующий текстовый элемент

            const prevEndlElement = textElementRaw.prevEndl; // предыдущий перевод строки
            prevEndlElement!.next = textElementRaw; // ссылка на следующий элемент
            prevEndlElement!.nextRaw = textElementRaw; // ссылка на следующий текстовый элемент
        }

        // сохраняем текущие элементы для использования на следующем шаге цикла
        prev = textElementEndl;
        prevEndl = textElementEndl;
        prevRaw = textElementRaw;
    }

    return headTextElement;
}
