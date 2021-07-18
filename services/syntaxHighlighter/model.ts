export interface RuleCaptureConfig<T> {
    name: string;
    patterns: T[];
}

export interface RuleCapturesConfig<T> {
    [name: string]: RuleCaptureConfig<T>;
    [index: number]: RuleCaptureConfig<T>;
}

/* #region  raw rule config types */

export type LevelConfig = {
    patterns?: RuleConfig[];
    repository?: RepositoryConfig;
};

export type RepositoryConfig = {
    [name: string]: RuleConfig | LevelConfig;
};

export type RuleConfigType<T> = {
    comment?: string;
    disabled?: boolean;
} & T;

export type RuleConfig = RuleConfigType<
    RuleIncludeConfig | RuleMathConfig | RuleBeginConfig
>;

export type RuleIncludeConfig = {
    include: string;
};

export type RuleMathConfig = {
    match: string;
    name?: string;
    captures?: RuleCapturesConfig<RuleConfig>;
};

export type RuleBeginConfigType<T> = {
    begin: string;
    name?: string;
    beginCaptures?: RuleCapturesConfig<RuleConfig>;
    captures?: RuleCapturesConfig<RuleConfig>;
} & T;

export type RuleBeginConfig = {
    begin: string;
    name?: string;
    beginCaptures?: RuleCapturesConfig<RuleConfig>;
    captures?: RuleCapturesConfig<RuleConfig>;
} & (RuleEndConfig | RuleWhileConfig);

export type RuleEndConfig = {
    end: string;
    contentName?: string;
    patterns?: RuleConfig[];
    endCaptures?: RuleCapturesConfig<RuleConfig>;
};

export type RuleWhileConfig = {
    while: string;
    whileCaptures?: RuleCapturesConfig<RuleConfig>;
};

/* #endregion */

export enum RuleType {
    INCLUDE,
    BEGIN_END,
    BEGIN_WHILE,
    MATCH,
}

export type RuleGenType<T> = {
    comment?: string;
    disabled?: boolean;
    type: RuleType;
} & T;

export type Rule = RuleGenType<
    RuleIncludeFields | RuleMathFields | RuleBeginFields
>;

/**
 * @from_type RuleIncludeConfig
 */
export type RuleIncludeFields = {
    include: string;
};

/**
 * @from_type RuleMathConfig
 */
export type RuleMathFields = {
    match: string;
    name?: string;
    captures?: RuleCapturesConfig<Rule>;
};

export type RuleBeginFieldsType<T> = {
    begin: string;
    name?: string;
    beginCaptures?: RuleCapturesConfig<Rule>;
    captures?: RuleCapturesConfig<Rule>;
} & T;

/**
 * @from_type RuleBeginConfig
 */
export type RuleBeginFields = {
    begin: string;
    name?: string;
    beginCaptures?: RuleCapturesConfig<Rule>;
    captures?: RuleCapturesConfig<Rule>;
} & (RuleEndFields | RuleWhileFields);

export type RuleEndFields = {
    end: string;
    contentName?: string;
    patterns?: Rule[];
    endCaptures?: RuleCapturesConfig<Rule>;
};

/**
 * @from_type RuleWhileConfig
 */
export type RuleWhileFields = {
    while: string;
    whileCaptures?: RuleCapturesConfig<Rule>;
};

export interface CaptureGroups {
    [groupName: string]: [number, number];
}

type Label = string; // имя лейбла, определяется грамматикой
type TokenGroup = number; // группа для несвязанных частей текста, 0 — без группы
type Token = [Label, RichText[], TokenGroup];

// неразмеченный текст либо токен
export type RichText = string | Token;

export type RichLines = RichText[][]; // строки из несвязанных кусков

export interface TextGroup {
    head: TextElement | null;
    tail: TextElement | null;
    headRaw: TextElementRaw | null;
    currentRaw: TextElementRaw | null;
    tailRaw: TextElementRaw | null;
    headEndl: TextElementEndl | null;
    tailEndl: TextElementEndl | null;
    name: string | null;
}

export enum TextElementType {
    Raw, // сырой текст
    Group, // группа
    Endl, // перевод строки
}
export interface TextElement {
    next: TextElement | null; // следующий элемент
    prev: TextElement | null; // предыдущий элемент
    type: TextElementType; // тип узла
}

export interface TextElementRaw extends TextElement {
    type: TextElementType.Raw;
    raw: string; // сырой текст
    nextRaw: TextElementRaw | null; // следующий текстовый элемент
    prevRaw: TextElementRaw | null; // предыдущий текстовый элемент
    nextEndl: TextElementEndl | null; // следующий перевод строки
    prevEndl: TextElementEndl | null; // предыдущий перевод строки
}

export interface TextElementGroup extends TextElement {
    type: TextElementType.Group;
    group: TextGroup; // группа
}

export interface TextElementEndl extends TextElement {
    type: TextElementType.Endl;
    nextRaw: TextElementRaw | null; // следующий текстовый элемент
    prevRaw: TextElementRaw | null; // предыдущий текстовый элемент
}

export type FlatGroup = [string, number];
export interface FlatTextNode {
    prev: FlatTextNode | null;
    next: FlatTextNode | null;
    raw: string;
    groups: FlatGroup[] | null;
}

export type FlatText = [string, FlatGroup[] | null];

export type FlatLine = FlatText[];
export type FlatLines = FlatLine[];



export type CaptureData = {
    element: TextElementRaw; // элемент с совпадением
    capture: CaptureGroups;
};

export type BeginEndPair = {
    start: CaptureData;
    end: CaptureData;
};

export function getTextRaw(raw: string): TextElementRaw {
    return {
        type: TextElementType.Raw,
        next: null,
        prev: null,
        nextRaw: null,
        prevRaw: null,
        nextEndl: null,
        prevEndl: null,
        raw,
    };
}

export function getTextGroup(): TextElementGroup {
    return {
        type: TextElementType.Group,
        next: null,
        prev: null,
        group: {
            name: null,
            head: null,
            tail: null,
            headRaw: null,
            tailRaw: null,
            currentRaw: null,
            headEndl: null,
            tailEndl: null,
        },
    };
}

function getNextRaw(element: TextElement): TextElementRaw | null {
    if (element.type === TextElementType.Raw) {
        return (element as TextElementRaw).nextRaw;
    } else if (element.type === TextElementType.Endl) {
        return (element as TextElementEndl).nextRaw;
    } else if (element.next === null) {
        return null;
    } else if (element.next.type === TextElementType.Raw) {
        return element.next as TextElementRaw;
    } else {
        return getNextRaw(element.next);
    }
}

function getPrevRaw(element: TextElement): TextElementRaw | null {
    if (element.type === TextElementType.Raw) {
        return (element as TextElementRaw).prevRaw;
    } else if (element.type === TextElementType.Endl) {
        return (element as TextElementEndl).prevRaw;
    } else if (element.prev === null) {
        return null;
    } else if (element.prev.type === TextElementType.Raw) {
        return element.prev as TextElementRaw;
    } else {
        return getPrevRaw(element.prev);
    }
}

function getNextEndl(element: TextElement): TextElementEndl | null {
    if (element.type === TextElementType.Raw) {
        return (element as TextElementRaw).nextEndl;
    } else if (element.next === null) {
        return null;
    } else if (element.next.type === TextElementType.Endl) {
        return element.next as TextElementEndl;
    } else {
        return getNextEndl(element.next);
    }
}

function getPrevEndl(element: TextElement): TextElementEndl | null {
    if (element.type === TextElementType.Raw) {
        return (element as TextElementRaw).prevEndl;
    } else if (element.prev === null) {
        return null;
    } else if (element.prev.type === TextElementType.Endl) {
        return element.prev as TextElementEndl;
    } else {
        return getPrevEndl(element.prev);
    }
}

/** добавление элемента в конец группы */
function addElementToGroup(
    elementGroup: TextElementGroup,
    element: TextElement
): void {
    const group = elementGroup.group;
    if (group.tail === null) {
        // добавляем первый элемент
        group.head = element;
        group.tail = element;
    } else {
        // добавляем элемент в конец
        group.tail.next = element;

        // обратная ссылка
        element.prev = group.tail;

        // смещаем хвост
        group.tail = element;
    }
}

/** добавление текстового элемента в конец группы */
function addElementRawToGroup(
    elementGroup: TextElementGroup,
    elementRaw: TextElementRaw
): void {
    const group = elementGroup.group;

    // общие действия по добавлению
    addElementToGroup(elementGroup, elementRaw);

    if (group.tailRaw === null) {
        // текстовых элементов ещё нет, добавляем первый
        group.headRaw = elementRaw;
        group.tailRaw = elementRaw;
        group.currentRaw = elementRaw;
    } else {
        // к последнему текстовому добавляем ссылку
        group.tailRaw.nextRaw = elementRaw;

        // обратная ссылка на предыдущий текстовый
        elementRaw.prevRaw = group.tailRaw;

        // смещаем последний
        group.tailRaw = elementRaw;
    }

    if (group.tailEndl !== null) {
        // если есть переносы строк, то обновляем последний текст для последнего перевода
        group.tailEndl.nextRaw = elementRaw;

        // и указываем перевод как предыдущий для текста
        elementRaw.prevEndl = group.tailEndl;
    }
}

/** Замена элемента в группе */
function replaceElementInGroup(
    elementGroup: TextElementGroup,
    oldElement: TextElement,
    newElement: TextElement
): void {
    const group = elementGroup.group;

    if (oldElement.prev !== null) {
        // указываем на предыдущий
        newElement.prev = oldElement.prev;
        // меняем ссылку с предыдущего
        newElement.prev.next = newElement;
    }
    if (oldElement.next !== null) {
        // указываем на следующий
        newElement.next = oldElement.next;
        // меняем ссылку со следующего
        newElement.next.prev = newElement;
    }
    if (group.head === oldElement) {
        // заменяем первый
        group.head = newElement;
    }
    if (group.tail === oldElement) {
        // заменяем последний
        group.tail = newElement;
    }
}

/** Удаление элемента в группе */
function removeElementInGroup(
    elementGroup: TextElementGroup,
    element: TextElement
): void {
    const group = elementGroup.group;

    if (element.prev !== null) {
        // меняем ссылку с предыдущего
        element.prev.next = element.next;
    }
    if (element.next !== null) {
        // меняем ссылку со следующего
        element.next.prev = element.prev;
    }
    if (group.head === element) {
        // заменяем первый
        group.head = element.next;
    }
    if (group.tail === element) {
        // заменяем последний
        group.tail = element.prev;
    }
}

/** Добавление элемента после элемента в группе */
function addAfterElementInGroup(
    elementGroup: TextElementGroup,
    element: TextElement,
    newElement: TextElement
): void {
    const group = elementGroup.group;

    if (element.next !== null) {
        // указываем на следующий
        newElement.next = element.next;
        // меняем ссылку со следующего
        newElement.next.prev = newElement;
    }

    element.next = newElement;
    newElement.prev = element;

    if (group.tail === element) {
        // заменяем последний
        group.tail = newElement;
    }
}

/** Добавление элемента перед элементом в группе */
function addBeforeElementInGroup(
    elementGroup: TextElementGroup,
    element: TextElement,
    newElement: TextElement
): void {
    const group = elementGroup.group;

    if (element.prev !== null) {
        // указываем на предыдущий
        newElement.prev = element.prev;
        // меняем ссылку с предыдущего
        newElement.prev.next = newElement;
    }

    element.prev = newElement;
    newElement.next = element;

    if (group.head === element) {
        // заменяем последний
        group.head = newElement;
    }
}

function replaceElementRawToRawInGroup(
    elementGroup: TextElementGroup,
    oldElementRaw: TextElementRaw,
    newElementRaw: TextElementRaw
): void {
    const group = elementGroup.group;

    // общие действия по замене
    replaceElementInGroup(elementGroup, oldElementRaw, newElementRaw);

    if (oldElementRaw.prevRaw !== null) {
        newElementRaw.prevRaw = oldElementRaw.prevRaw;
        newElementRaw.prevRaw.nextRaw = newElementRaw;
    }

    if (oldElementRaw.nextRaw !== null) {
        newElementRaw.nextRaw = oldElementRaw.nextRaw;
        newElementRaw.nextRaw.prevRaw = newElementRaw;
    }

    if (oldElementRaw.prevEndl !== null) {
        newElementRaw.prevEndl = oldElementRaw.prevEndl;
        newElementRaw.prevEndl.nextRaw = newElementRaw;
    }

    if (oldElementRaw.nextEndl !== null) {
        newElementRaw.nextEndl = oldElementRaw.nextEndl;
        newElementRaw.nextEndl.prevRaw = newElementRaw;
    }

    if (group.headRaw === oldElementRaw) {
        group.headRaw = newElementRaw;
    }

    if (group.tailRaw === oldElementRaw) {
        group.tailRaw = newElementRaw;
    }
}

function replaceElementRawToGroupInGroup(
    elementGroup: TextElementGroup,
    oldElementRaw: TextElementRaw,
    newElementGroup: TextElementGroup
): void {
    const group = elementGroup.group;

    // общие действия по замене
    replaceElementInGroup(elementGroup, oldElementRaw, newElementGroup);

    // ссылки на сырые элементы
    if (oldElementRaw.prevRaw !== null) {
        // есть сырой предыдущий
        if (oldElementRaw.nextRaw === null) {
            // нет сырого следующего - уничтожаем ссылки
            oldElementRaw.prevRaw.nextRaw = null;
        } else {
            // есть сырой следующий - перебрасываем ссылки
            oldElementRaw.prevRaw.nextRaw = oldElementRaw.nextRaw;
        }
    }

    // симметричная ситуация
    if (oldElementRaw.nextRaw !== null) {
        // есть сырой следующий
        if (oldElementRaw.prevRaw === null) {
            // нет сырого предыдущего - уничтожаем ссылки
            oldElementRaw.nextRaw.prevRaw = null;
        } else {
            // есть сырой предыдущий - перебрасываем ссылки
            oldElementRaw.nextRaw.prevRaw = oldElementRaw.prevRaw;
        }
    }

    // ссылки на перевод строки
    if (oldElementRaw.prevEndl !== null) {
        // есть предыдущий перевод
        if (oldElementRaw.nextRaw === null) {
            // нет сырого следующего - уничтожаем ссылки
            oldElementRaw.prevEndl.nextRaw = null;
        } else {
            // есть сырой следующий - перебрасываем ссылки
            oldElementRaw.prevEndl.nextRaw = oldElementRaw.nextRaw;
        }
    }

    // симметричная ситуация
    if (oldElementRaw.nextEndl !== null) {
        // есть следующий перевод
        if (oldElementRaw.prevRaw === null) {
            // нет сырого предыдущего - уничтожаем ссылки
            oldElementRaw.nextEndl.prevRaw = null;
        } else {
            // есть сырой предыдущий - перебрасываем ссылки
            oldElementRaw.nextEndl.prevRaw = oldElementRaw.prevRaw;
        }
    }

    if (group.headRaw === oldElementRaw) {
        group.headRaw = oldElementRaw.nextRaw;
    }

    if (group.tailRaw === oldElementRaw) {
        group.tailRaw = oldElementRaw.prevRaw;
    }
}

function removeElementRawInGroup(
    elementGroup: TextElementGroup,
    elementRaw: TextElementRaw
): void {
    const group = elementGroup.group;

    // общие действия по удалению
    removeElementInGroup(elementGroup, elementRaw);

    if (elementRaw.prevRaw !== null) {
        elementRaw.prevRaw.nextRaw = elementRaw.nextRaw;
    }

    if (elementRaw.nextRaw !== null) {
        elementRaw.nextRaw.prevRaw = elementRaw.prevRaw;
    }

    if (elementRaw.prevEndl !== null) {
        elementRaw.prevEndl.nextRaw = elementRaw.nextRaw;
    }

    if (elementRaw.nextEndl !== null) {
        elementRaw.nextEndl.prevRaw = elementRaw.prevRaw;
    }

    if (group.headRaw === elementRaw) {
        group.headRaw = elementRaw.nextRaw;
    }

    if (group.tailRaw === elementRaw) {
        group.tailRaw = elementRaw.prevRaw;
    }
}

function addAfterElementRawToRawInGroup(
    rootGroup: TextElementGroup,
    elementRaw: TextElementRaw,
    newElementRaw: TextElementRaw
): void {
    const group = rootGroup.group;

    // общие действия по добавлению после элемента
    addAfterElementInGroup(rootGroup, elementRaw, newElementRaw);

    if (elementRaw.nextRaw !== null) {
        newElementRaw.nextRaw = elementRaw.nextRaw;
        newElementRaw.nextRaw.prevRaw = newElementRaw;
    }

    if (elementRaw.nextEndl !== null) {
        newElementRaw.nextEndl = elementRaw.nextEndl;
        newElementRaw.nextEndl.prevRaw = newElementRaw;
    }

    elementRaw.nextRaw = newElementRaw;
    newElementRaw.prevRaw = elementRaw;
    newElementRaw.prevEndl = elementRaw.prevEndl;

    console.log('compare', {newNextRaw: newElementRaw.nextRaw, oldNextRaw: elementRaw.nextRaw});

    if (group.tailRaw === elementRaw) {
        group.tailRaw = newElementRaw;
    }
}

function addAfterElementGroupToRawInGroup(
    rootGroup: TextElementGroup,
    elementGroup: TextElementGroup,
    newElementRaw: TextElementRaw
): void {
    const group = rootGroup.group;


    // console.log('compare_2__before', {newNextRaw: newElementRaw.nextRaw?.raw, newElementRaw: newElementRaw.raw});


    const nextRaw = getNextRaw(elementGroup);

    if (nextRaw !== null) {
        newElementRaw.nextRaw = nextRaw;
        newElementRaw.nextRaw.prevRaw = newElementRaw;
    }

    // console.log('compare_2', {newNextRaw: newElementRaw.nextRaw, newElementRaw});
    // console.log('compare_2__', {newNextRaw: newElementRaw.nextRaw.raw, newElementRaw: newElementRaw.raw});


    // общие действия по добавлению после элемента
    addAfterElementInGroup(rootGroup, elementGroup, newElementRaw);


    const prevRaw = getPrevRaw(elementGroup);

    if (prevRaw !== null) {
        newElementRaw.prevRaw = prevRaw;
        newElementRaw.prevRaw.nextRaw = newElementRaw;
    }

    const nextEndl = getNextEndl(elementGroup);

    if (nextEndl !== null) {
        newElementRaw.nextEndl = nextEndl;
        newElementRaw.nextEndl.prevRaw = newElementRaw;
    }

    const prevEndl = getPrevEndl(elementGroup);

    if (prevEndl !== null) {
        newElementRaw.prevEndl = prevEndl;
        newElementRaw.prevEndl.nextRaw = newElementRaw;
    }

    if (group.headRaw === null) {
        group.headRaw = newElementRaw;
    } else if (group.headRaw === nextRaw) {
        group.headRaw = newElementRaw;
    }

    if (group.tailRaw === null) {
        group.tailRaw = newElementRaw;
    } else if (group.tailRaw === prevRaw) {
        group.tailRaw = newElementRaw;
    }
}

function addAfterElementEndlToRawInGroup(
    rootGroup: TextElementGroup,
    elementEndl: TextElementEndl,
    newElementRaw: TextElementRaw
): void {
    const group = rootGroup.group;

    // общие действия по добавлению после элемента
    addAfterElementInGroup(rootGroup, elementEndl, newElementRaw);

    const nextRaw = getNextRaw(elementEndl);

    if (nextRaw !== null) {
        newElementRaw.nextRaw = nextRaw;
        newElementRaw.nextRaw.prevRaw = newElementRaw;
    }

    const prevRaw = getPrevRaw(elementEndl);

    if (prevRaw !== null) {
        newElementRaw.prevRaw = prevRaw;
        newElementRaw.prevRaw.nextRaw = newElementRaw;
    }

    const nextEndl = getNextEndl(elementEndl);

    if (nextEndl !== null) {
        newElementRaw.nextEndl = nextEndl;
        newElementRaw.nextEndl.prevRaw = newElementRaw;
    }

    const prevEndl = getPrevEndl(elementEndl);

    if (prevEndl !== null) {
        newElementRaw.prevEndl = prevEndl;
        newElementRaw.prevEndl.nextRaw = newElementRaw;
    }

    if (group.headRaw === null) {
        group.headRaw = newElementRaw;
    } else if (group.headRaw === nextRaw) {
        group.headRaw = newElementRaw;
    }

    if (group.tailRaw === null) {
        group.tailRaw = newElementRaw;
    } else if (group.tailRaw === prevRaw) {
        group.tailRaw = newElementRaw;
    }
}

function addAfterElementAnyToRawInGroup(
    rootGroup: TextElementGroup,
    element: TextElement,
    newElementRaw: TextElementRaw
): void {
    if (element.type === TextElementType.Raw) {
        addAfterElementRawToRawInGroup(
            rootGroup,
            element as TextElementRaw,
            newElementRaw
        );
    } else if (element.type === TextElementType.Group) {
        addAfterElementGroupToRawInGroup(
            rootGroup,
            element as TextElementGroup,
            newElementRaw
        );
    } else {
        addAfterElementEndlToRawInGroup(
            rootGroup,
            element as TextElementEndl,
            newElementRaw
        );
    }
}

function addBeforeElementRawToRawInGroup(
    elementGroup: TextElementGroup,
    elementRaw: TextElementRaw,
    newElementRaw: TextElementRaw
): void {
    const group = elementGroup.group;

    // общие действия по добавлению перед элементом
    addBeforeElementInGroup(elementGroup, elementRaw, newElementRaw);

    if (elementRaw.prevRaw !== null) {
        newElementRaw.prevRaw = elementRaw.prevRaw;
        newElementRaw.prevRaw.nextRaw = newElementRaw;
    }

    if (elementRaw.prevEndl !== null) {
        newElementRaw.prevEndl = elementRaw.prevEndl;
        newElementRaw.prevEndl.nextRaw = newElementRaw;
    }

    elementRaw.prevRaw = newElementRaw;
    newElementRaw.nextRaw = elementRaw;
    newElementRaw.nextEndl = elementRaw.nextEndl;

    if (group.headRaw === elementRaw) {
        group.headRaw = newElementRaw;
    }
}

// не вставляем endl
export const groupAdapter = {
    get: {
        next: {
            raw: getNextRaw,
        }
    },
    add: {
        group: addElementToGroup,
        raw: addElementRawToGroup,
    },
    replace: {
        raw: {
            raw: replaceElementRawToRawInGroup,
            group: replaceElementRawToGroupInGroup,
        },
    },
    addAfter: {
        raw: {
            raw: addAfterElementRawToRawInGroup,
            group: addAfterElementInGroup, // только основные связи
        },
        group: {
            raw: addAfterElementGroupToRawInGroup,
        },
        endl: {
            raw: addAfterElementEndlToRawInGroup,
        },
        any: {
            raw: addAfterElementAnyToRawInGroup,
            group: addAfterElementInGroup,
        },
    },
    addBefore: {
        raw: {
            raw: addBeforeElementRawToRawInGroup,
            group: addAfterElementInGroup, // только основные связи
        },
    },
    remove: {
        raw: removeElementRawInGroup,
    },
};

function getFlatTextNode(
    raw: string,
    groups: FlatGroup[] | null = null
): FlatTextNode {
    return {
        prev: null,
        next: null,
        raw,
        groups,
    };
}

function getGroupCounter() {
    let i = 0;
    return () => i++;
}

export function TextGroupToFlatTextNode(
    group: TextGroup,
    counter: () => number,
    flatGroups: FlatGroup[] | null = null
): { head: FlatTextNode; tail: FlatTextNode } {
    let currentElement = group.head;

    const headTextNode = getFlatTextNode('', flatGroups);
    let currentTextNode: FlatTextNode = headTextNode;

    while (currentElement !== null) {
        if (currentElement.type === TextElementType.Raw) {
            const rawTextNode = getFlatTextNode(
                (currentElement as TextElementRaw).raw,
                flatGroups
            );
            currentTextNode.next = rawTextNode;
            rawTextNode.prev = currentTextNode;
            currentTextNode = rawTextNode;
        } else if (currentElement.type === TextElementType.Endl) {
            const endlTextNode = getFlatTextNode('\n');
            currentTextNode.next = endlTextNode;
            endlTextNode.prev = currentTextNode;
            currentTextNode = endlTextNode;
        } else {
            const currentElementGroup = currentElement as TextElementGroup;
            const group: FlatGroup = [
                currentElementGroup.group.name ?? '',
                counter(),
            ];
            const {
                head,
                tail,
            } = TextGroupToFlatTextNode(currentElementGroup.group, counter, [
                ...(flatGroups ?? []),
                group,
            ]);
            currentTextNode.next = head;
            head.prev = currentTextNode;
            currentTextNode = tail;
        }
        currentElement = currentElement.next;
    }
    return {
        head: headTextNode,
        tail: currentTextNode,
    };
}

export function FlatTextNodeToFlatText(textNode: FlatTextNode | null): FlatLines {
    const lines: FlatLines = [];

    let currentTextNode = textNode;
    let currentLine: FlatLine = [];

    while (currentTextNode !== null && currentTextNode.next !== null) {
        if (currentTextNode.raw === '\n') {
            lines.push(currentLine);
            currentLine = [];
        } else {
            const { raw, groups } = currentTextNode;
            currentLine.push([raw, groups]);
        }

        currentTextNode = currentTextNode.next;
    }

    return lines;
}

export function TextGroupToFlatText(textGroup: TextGroup): FlatLines {
    const counter = getGroupCounter();
    return FlatTextNodeToFlatText(
        TextGroupToFlatTextNode(textGroup, counter).head.next
    );
}

/*
    ruleList: Rule[];
превращается:
['line', [
    '    ',
    ['key', 'ruleList', 0],
    ': ',
    ['typeName', 'Rule', 0],
    '[];'
], 0]
пример, как это может выглядеть в html:
<pre>
    <span class="js.line">
        <span>    </span>
        <span class="js.key">ruleList</span>
        <span>: </span>
        <span class="js.typeName">Rule</span>
        <span>[];</span>
    </span>
</pre>
*/
