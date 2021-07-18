import {
    BeginEndPair,
    CaptureData,
    CaptureGroups,
    TextElementRaw,
} from './model';

/**
 * Проверка, есть ли пересечение у группы захвата и пары begin-end
 *
 * Если есть все такие группы выкидываются из рассмотрения
 */
export function isPairIntersectionCapture(
    pair: BeginEndPair,
    data: CaptureData
): boolean {
    const { element, capture } = data;
    const [start, end] = capture[0];
    const pairStart = pair.start.capture[0][0];
    const pairEnd = pair.end.capture[0][1];
    const isStartElement = element === pair.start.element;
    const isEndElement = element === pair.end.element;
    if (isStartElement) {
        // конец группы после начала пары
        if (end >= pairStart) {
            if (!isEndElement || start <= pairEnd) {
                return true;
            }
        }
    }
    if (isEndElement) {
        // начало группы перед концом пары
        if (start <= pairEnd) {
            if (!isStartElement || end >= pairStart) {
                return true;
            }
        }
        return true;
    }
    return false;
}

export function getPairs(
    element: TextElementRaw,
    beginIndexes: CaptureGroups[],
    endIndexes: CaptureGroups[],
    reserveStart: CaptureData | null
): { pairs: BeginEndPair[]; reserveStart: CaptureData | null } {
    let process: boolean = beginIndexes.length > 0 || reserveStart !== null;
    let currentBeginData: CaptureData = reserveStart ?? {
        element,
        capture: beginIndexes[0],
    };

    let beginIndex = reserveStart ? -1 : 0;
    let endIndex = 0;

    const pairs: BeginEndPair[] = [];

    while (process) {
        if (endIndex >= endIndexes.length) {
            // если кончились end
            break;
        }
        if (!currentBeginData.capture) {
            // если кончились begin
            break;
        }
        const beginRightIndex: number = currentBeginData.capture[0][1];

        const currentEnd = endIndexes[endIndex];
        // console.log({ currentEnd });
        if (currentEnd[0][0] > beginRightIndex) {
            // нашли пару
            pairs.push({
                start: currentBeginData,
                end: { element, capture: currentEnd },
            });

            // смещаем начальный элемент
            if (beginIndex === -1) {
                currentBeginData.element = element;
            }
            currentBeginData.capture = beginIndexes[++beginIndex];
        }
        endIndex++;
    }

    let newReserv: CaptureData | null = null;
    if (currentBeginData.capture) {
        if (beginIndex !== undefined) {
            if (beginIndex < beginIndexes.length - 1) {
                // сдвиг на последний
                currentBeginData.capture =
                    beginIndexes[beginIndexes.length - 1];
            }
        }
        newReserv = currentBeginData;
    }

    return { pairs, reserveStart: newReserv };
}
