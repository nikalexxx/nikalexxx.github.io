import { CaptureGroups } from './model';

interface GetCaptureGroups {
    groups: CaptureGroups;
    captureNames: string[];
}

export function getCaptureGroups({
    groups,
    captureNames,
}: GetCaptureGroups): CaptureGroups {
    // исключение вложенных групп: есть есть правило для некоторой группы, все вложенные группы игнорируются
    const groupIndexes: Record<string, [boolean, string][]> = {}; // index: [isStartIndex, groupName]
    for (const groupName of captureNames) {
        if (!groups.hasOwnProperty(groupName)) {
            continue;
        }
        const [startGroupIndex, endGroupIndex] = groups[groupName];
        const startKey = String(startGroupIndex);
        const endKey = String(endGroupIndex);
        let isStart = true;
        for (const key of [startKey, endKey]) {
            if (!groupIndexes.hasOwnProperty(key)) {
                groupIndexes[key] = [];
            }
            groupIndexes[key].push([isStart, groupName]);
            isStart = false;
        }
    }

    // так как скобочная последовательность правильная в силу построения регулярного выражения, достаточно хранить множество открытых групп
    // верхний уровень - когда это множество пусто
    const actualGroupNames: string[] = [];
    const openGroupNames: Set<string> = new Set();
    const indexesList = Object.keys(groupIndexes)
        .map((e) => Number(e))
        .sort((a, b) => a - b);
    for (const index of indexesList) {
        const dataNames = groupIndexes[String(index)];
        const startNames = dataNames.filter((e) => e[0]);
        const endNames = dataNames.filter((e) => !e[0]);
        if (startNames.length > 0) {
            // добавляем имена открывающихся групп
            for (const [, name] of startNames) {
                openGroupNames.add(name);
            }
        }
        if (endNames.length > 0) {
            // ищем имена только на верхнем уровне вложенности
            // вложенные группы имеют больший номер, сортируем по убыванию
            for (const index of endNames
                .map((e) => Number(e[1]))
                .sort((a, b) => b - a)) {
                const name = String(index);
                openGroupNames.delete(name);
                if (openGroupNames.size === 0) {
                    // группа закрылась на верхнем уровне, добавляем её
                    actualGroupNames.push(name);
                }
            }
        }
    }

    const actualGroups: CaptureGroups = {};
    for (const name of actualGroupNames) {
        actualGroups[name] = groups[name];
    }
    return actualGroups;
}
