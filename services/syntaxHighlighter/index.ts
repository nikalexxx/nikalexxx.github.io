// import './theme.css';

import {
    BeginEndPair,
    CaptureGroups,
    RuleCaptureConfig,
    TextElementGroup,
    TextElementRaw,
    getTextGroup,
    getTextRaw,
    groupAdapter,
} from './model';
import {
    LevelConfig,
    RichLines,
    RichText,
    Rule,
    RuleBeginConfigType,
    RuleBeginFields,
    RuleBeginFieldsType,
    RuleCapturesConfig,
    RuleConfig,
    RuleConfigType,
    RuleEndConfig,
    RuleEndFields,
    RuleGenType,
    RuleIncludeConfig,
    RuleIncludeFields,
    RuleMathConfig,
    RuleMathFields,
    RuleType,
    RuleWhileConfig,
    RuleWhileFields,
    TextElement,
    TextElementEndl,
    TextElementType,
} from './model';
import { TextGroup, TextGroupToFlatText } from './model';
import { checkRegex, prepareRegex } from './regex';
import { parentSymbol, patternsSymbol } from './symbols';

import { getCaptureGroups } from './captureGroups';
import { getPairs } from './beginEndUtils';
import { parseLines } from './textRawParsing';
import { promiseLike } from './async';

console.dir(
    checkRegex(
        '(?x)\n(?: [-a-zA-Z_]    | [^\\x00-\\x7F] )   # First letter\n(?: [-a-zA-Z0-9_] | [^\\x00-\\x7F]     # Remainder of identifier\n  | \\\\(?:[0-9a-fA-F]{1,6}|.)\n)*',
        'aaasss'
    )
);

class RuleTypeError extends Error {
    constructor(type?: 'begin') {
        const message = type
            ? `If there is 'begin' field, must to be field 'end' or while`
            : `Rule must to be include field 'include' or 'match' or 'begin'`;
        super(message);
    }
}

type RuleTypeConfigType<T> = RuleConfigType<
    T extends RuleType.INCLUDE
        ? RuleIncludeConfig
        : T extends RuleType.MATCH
        ? RuleMathConfig
        : RuleBeginConfigType<
              T extends RuleType.BEGIN_END ? RuleEndConfig : RuleWhileConfig
          >
>;

type RuleTypeRuleGenType<T> = RuleGenType<
    T extends RuleType.INCLUDE
        ? RuleIncludeFields
        : T extends RuleType.MATCH
        ? RuleMathFields
        : RuleBeginFieldsType<
              T extends RuleType.BEGIN_END ? RuleEndFields : RuleWhileFields
          >
>;

function getRuleType(rule: RuleConfig) {
    // console.log({rule});
    if ('include' in rule) {
        return RuleType.INCLUDE;
    } else if ('match' in rule) {
        return RuleType.MATCH;
    } else if ('begin' in rule) {
        if ('end' in rule) {
            return RuleType.BEGIN_END;
        } else if ('while' in rule) {
            return RuleType.BEGIN_WHILE;
        } else {
            throw new RuleTypeError('begin');
        }
    } else {
        throw new RuleTypeError();
    }
}

type CheckRuleByTypeProps<T extends RuleType> = {
    rule: RuleTypeRuleGenType<T>;
    repositoryRules: GlobalRepositoryRules;
};

type CheckMatchRuleProps = CheckRuleByTypeProps<RuleType.MATCH> & {
    group: TextElementGroup;
};

async function checkMatchRule({
    group,
    rule: matchRule,
    repositoryRules,
}: CheckMatchRuleProps): Promise<null> {
    const { match, name, captures } = matchRule;
    const existCaptures = captures !== undefined;

    /** найден первый неразобранный фрагмент, то есть мы больше не сдвигаем `group.group.currentRaw` */
    let firstNextRawExist: boolean = false;

    // текущий текстовый элемент, над которым мы проверяем правило
    let currentCheckRaw: TextElementRaw | null = group.group.currentRaw;

    const currentNextEndl = group.group.currentRaw?.nextEndl;

    // пока это текст до переноса строки и он вообще есть (для последней строки)
    while (
        currentCheckRaw !== null &&
        currentCheckRaw.nextRaw !== null && // захватит последний ?
        currentCheckRaw.nextEndl === currentNextEndl
    ) {
        const text = currentCheckRaw.raw;

        let currentElement: TextElement = currentCheckRaw;

        // await new Promise((r) => window.setTimeout(r, 100));

        // console.log({ text, nextRaw: currentCheckRaw.nextRaw });

        // индексы упорядочены
        const indexes = checkRegex(match, text);

        if (indexes.length > 0) {
            let currentIndex = 0;
            for (const groups of indexes) {
                const wholeGroup = groups[0];
                const [startIndex, endIndex] = wholeGroup;

                if (startIndex > currentIndex) {
                    // остатки неразобранного текста
                    const startRaw = text.slice(currentIndex, startIndex);
                    const startElementRaw = getTextRaw(startRaw);

                    groupAdapter.addAfter.any.raw(
                        group,
                        currentElement,
                        startElementRaw
                    );
                    currentElement = startElementRaw;

                    if (!firstNextRawExist) {
                        // нашли новый неразобранный текст
                        firstNextRawExist = true;
                        group.group.currentRaw = startElementRaw;
                    }
                }

                // совпадающий текст
                const wholeGroupText = text.slice(startIndex, endIndex);

                let textGroup: TextElementGroup | null = null;
                if (captures && Object.keys(groups).length > 1) {
                    // есть правила для совпадений групп
                    // есть совпадения по группам внутри текущего текста

                    const actualGroups = getCaptureGroups({
                        groups,
                        captureNames: Object.keys(captures),
                    });

                    // группы по возрастанию
                    const groupList = Object.keys(actualGroups)
                        .map(Number)
                        .sort((a, b) => a - b);
                    let lastIndex: number = startIndex;
                    for (let j = 0; j < groupList.length; j++) {
                        const groupNumber = groupList[j];
                        if (j === 0 && !textGroup) {
                            // создаём пустой узел группу
                            textGroup = getTextGroup();
                        }
                        const groupNumberStr = String(groupNumber);
                        const captureRuleConfig = captures[groupNumberStr];

                        // правила для группы захвата
                        const rules = Array.isArray(captureRuleConfig)
                            ? captureRuleConfig
                            : [captureRuleConfig];

                        // начало и конец группы захвата
                        const [startGroupIndex, endGroupIndex] = groups[
                            groupNumberStr
                        ];

                        // текст группы захвата
                        const captureText = text.slice(
                            startGroupIndex,
                            endGroupIndex
                        );

                        if (startGroupIndex > lastIndex) {
                            // текст до текущей группы
                            const lastText = text.slice(
                                lastIndex,
                                startGroupIndex
                            );
                            const lastTextRaw = getTextRaw(lastText);

                            groupAdapter.add.raw(textGroup!, lastTextRaw);
                        }

                        // сдвигаем границу
                        lastIndex = endGroupIndex;

                        if (captureText !== '') {
                            // есть что разбирать

                            // единственный текстовый элемент
                            const captureTextRaw = getTextRaw(captureText);

                            // группа из этого элемента
                            const captureTextGroup = getTextGroup();

                            groupAdapter.add.raw(
                                captureTextGroup,
                                captureTextRaw
                            );

                            // здесь обрабатывается вложенность
                            // можно использовать сразу checkRuleList, так как текст в одной строке
                            await checkRuleList({
                                group: captureTextGroup,
                                ruleList: rules as any,
                                repositoryRules,
                            });

                            groupAdapter.add.group(
                                textGroup!,
                                captureTextGroup
                            );
                        }
                    }
                    if (lastIndex < endIndex) {
                        // остаток текста до конца текущего совпадения
                        const endText = text.slice(lastIndex, endIndex);
                        const endTextRaw = getTextRaw(endText);

                        groupAdapter.add.raw(textGroup!, endTextRaw);
                    }
                }
                if (!textGroup) {
                    // внутренних совпадений нет
                    const wholeGroupTextRaw = getTextRaw(wholeGroupText);
                    textGroup = getTextGroup();

                    groupAdapter.add.raw(textGroup, wholeGroupTextRaw);
                }
                // разобранный текст
                textGroup.group.name = name ?? null;

                groupAdapter.addAfter.any.group(
                    group,
                    currentElement,
                    textGroup
                );
                currentElement = textGroup;

                currentIndex = endIndex;
            }

            if (currentIndex < text.length) {
                // остатки неразобранного текста до конца строки
                const endText = text.slice(currentIndex, text.length);
                const endTextRaw = getTextRaw(endText);

                groupAdapter.addAfter.any.raw(
                    group,
                    currentElement,
                    endTextRaw
                );

                if (!firstNextRawExist) {
                    // нашли новый неразобранный текст
                    firstNextRawExist = true;
                    group.group.currentRaw = endTextRaw;
                }
            }

            // удаляем первоначальный текст из группы, так как мы заменили его
            groupAdapter.remove.raw(group, currentCheckRaw);

            currentCheckRaw = groupAdapter.get.next.raw(currentElement);
        } else {
            // переход к следующему сырому фрагменту
            currentCheckRaw = currentCheckRaw.nextRaw;
        }
    }

    return promiseLike(null);
}

type CheckBeginEndRuleProps = CheckRuleByTypeProps<RuleType.BEGIN_END> & {
    group: TextElementGroup;
};

type RichGroups = {
    [lineIndex: string]: {
        // строка с совпадением
        [blockIndex: string]: RichText[]; // номер блока и результат
    };
};

async function checkBeginEndRule({
    group,
    rule: beginEndRule,
    repositoryRules,
}: CheckBeginEndRuleProps): Promise<null> {
    // begin ищем в первой строке, end - пока текст не кончится
    // только первая строка может быть с блоками, последующие - неразобранный текст
    const {
        begin,
        end,
        name,
        captures, // внутри и начала и конца
        beginCaptures, // внутри начала
        endCaptures, // внутри конца
        patterns, // между началом и концом
    } = beginEndRule;
    const existCaptures = Boolean(captures);
    const existBeginCaptures = Boolean(beginCaptures);
    const existEndCaptures = Boolean(endCaptures);
    const existPatterns = Boolean(patterns);

    // return { richLines, endLineIndex: 1 };

    /** найден первый неразобранный фрагмент, то есть мы больше не сдвигаем `group.group.currentRaw` */
    let firstNextRawExist: boolean = false;

    // текущий текстовый элемент, над которым мы проверяем правило
    let currentCheckRaw: TextElementRaw | null = group.group.currentRaw;

    let prevBeginData = null;

    const beginEndPairs: BeginEndPair[] = [];

    while (
        currentCheckRaw !== null && // элемент существует
        (currentCheckRaw.next === null || // он последний или
            (currentCheckRaw.next.type === TextElementType.Endl && // за ним перенос строки
                currentCheckRaw.next.next?.type === TextElementType.Raw)) // с неразобранным текстом
    ) {
        // текст, который подлежит разбору
        const text = currentCheckRaw.raw;

        // индексы упорядочены
        const beginIndexes = checkRegex(begin, text);
        const endIndexes = checkRegex(end, text);

        const { pairs, reserveStart } = getPairs(
            currentCheckRaw,
            beginIndexes,
            endIndexes,
            prevBeginData
        );

        // найденные пары
        beginEndPairs.concat(pairs);

        // висящий begin
        prevBeginData = reserveStart;

        currentCheckRaw = currentCheckRaw.nextRaw;
    }

    if (beginEndPairs.length > 0) {
        console.log({ beginEndPairs });
    }

    // const firstLine = richLines[0];
    // let existsBeginEnd = false;
    // for (let i = 0; i < firstLine.length; i++) {
    //     /** кусок первой строки */
    //     const text = firstLine[i];
    //     if (typeof text !== 'string') {
    //         // пропускаем уже разобранные части
    //         continue;
    //     }
    //     const beginIndexes = checkRegex(begin, text);
    //     if (beginIndexes.length > 0) {
    //         // есть совпадение с началом
    //         // console.log(name, { beginIndexes, begin, text, end });
    //         // break;

    //         // для каждого ищем end от текущего места в первой строке до конца всех строк
    //         // смотрим следующие строки только если мы в последнем блоке

    //         let currentLastIndex = 0;
    //         const isLastBlock = i === firstLine.length;
    //         for (const beginGroups of beginIndexes) {
    //             const wholeBeginGroup = beginGroups[0];
    //             const [startBeginIndex, endBeginIndex] = wholeBeginGroup;

    //             if (startBeginIndex < currentLastIndex) {
    //                 // часть текста уже была включена в предыдущую группу
    //                 continue;
    //             }

    //             // остаток от текущей строки
    //             const endLineText = text.slice(endBeginIndex, text.length);

    //             // строки для поиска конца
    //             let linesForEndSearch: RichLines;

    //             if (isLastBlock && richLines.length > 1) {
    //                 // также смотрим следующие строки
    //                 linesForEndSearch = [[endLineText], ...richLines.slice(1)];
    //             } else {
    //                 if (endLineText === '') {
    //                     // блок закончился, дальше искать негде
    //                     break;
    //                 }
    //                 linesForEndSearch = [[endLineText]];
    //             }

    //             // нужно только первое совпадение
    //             let firstEndGroups: CaptureGroups;
    //             let firstEndLineIndex: number;
    //             // console.log({ linesForEndSearch });
    //             for (let j = 0; j < linesForEndSearch.length; j++) {
    //                 const line = linesForEndSearch[j];
    //                 if (line.length > 1) {
    //                     // такого вообще быть не должно
    //                     // должны быть только сырые строки
    //                     break;
    //                 }
    //                 const endText = line[0];
    //                 if (typeof endText !== 'string') {
    //                     break;
    //                 }
    //                 // debugger;
    //                 const endIndexes = checkRegex(end, endText);
    //                 // debugger;
    //                 if (endIndexes.length > 0) {
    //                     // нужно только первое совпадение
    //                     const endGroups = endIndexes[0];
    //                     firstEndGroups = endGroups;
    //                     firstEndLineIndex = j;
    //                     break;
    //                 }
    //             }

    //             if (firstEndGroups) {
    //                 // конец был найден
    //                 console.log({
    //                     name,
    //                     text,
    //                     begin,
    //                     end,
    //                     beginGroups,
    //                     firstEndGroups,
    //                 });
    //                 const wholeEndGroup = firstEndGroups[0];
    //                 // индексы относительно endBeginIndex
    //                 const startEndIndex = wholeEndGroup[0] + endBeginIndex;
    //                 const endEndIndex = wholeEndGroup[1] + endBeginIndex;
    //                 if (firstEndLineIndex === 0) {
    //                     // всё в пределах одной строки

    //                     // конец разобранной группы
    //                     currentLastIndex = endEndIndex;

    //                     const textWithToken: RichText[] = [];
    //                     if (startBeginIndex > 0) {
    //                         // текст до начала совпадения
    //                         textWithToken.push(text.slice(0, startBeginIndex));
    //                     }
    //                     // TODO: // разобрать вглубь
    //                     textWithToken.push([
    //                         name,
    //                         [text.slice(startBeginIndex, endEndIndex)],
    //                         0,
    //                     ]);
    //                     if (endEndIndex < text.length) {
    //                         // текст после совпадения
    //                         textWithToken.push(
    //                             text.slice(endEndIndex, text.length)
    //                         );
    //                     }
    //                     if (!richGroups[0]) {
    //                         richGroups[0] = {};
    //                     }
    //                     // TODO: несколько групп
    //                     richGroups[0][i] = textWithToken;
    //                     existsBeginEnd = true;
    //                 } else {
    //                     // изменяем сразу несколько строк
    //                 }
    //             } else {
    //                 // конец не был найден
    //                 if (isLastBlock) {
    //                     // продлеваем до конца текста
    //                 } else {
    //                 }
    //             }
    //         }
    //     }
    // }
    // if (!existsBeginEnd) {
    //     // ничего не нашли
    //     return promiseLike(null);
    // }

    // if (Object.keys(richGroups).length > 0) {
    //     console.log({ name, begin, end, richGroups, text: richLines[0] });
    // }

    // for (const line of Object.keys(richGroups)) {
    //     const blocks = richGroups[line];
    //     const lineIndex = Number(line);
    //     for (const block of Object.keys(blocks)) {
    //         const richTexts = blocks[block];
    //         const blockIndex = Number(block);
    //         const currentLine = result[lineIndex];
    //         result[lineIndex] = [];
    //         if (blockIndex > 0) {
    //             result[lineIndex].push(...currentLine.slice(0, blockIndex));
    //         }
    //         result[lineIndex].push(...richTexts);
    //         if (blockIndex < currentLine.length - 1) {
    //             result[lineIndex].push(
    //                 ...currentLine.slice(blockIndex, currentLine.length)
    //             );
    //         }
    //     }
    // }
    return promiseLike(null);
}

interface CheckRuleProps {
    group: TextElementGroup;
    rule: Rule;
    repositoryRules: GlobalRepositoryRules;
}

/** проверка правила в зависимости от его типа */
async function checkRule({
    group,
    rule,
    repositoryRules,
}: CheckRuleProps): Promise<null> {
    if (rule.disabled) {
        // отключенные правила
        return promiseLike(null);
    }

    const type = rule.type;

    // console.log(type, {rule});

    if (type === RuleType.INCLUDE) {
        // вложенные правила
        const includeRule = rule as RuleTypeRuleGenType<RuleType.INCLUDE>;
        const path = includeRule.include;

        // console.log({path});

        if (path[0] === '#') {
            // правила из репозитория
            const name = path.slice(1);
            const rules = repositoryRules.get(name)!;
            await checkRuleList({
                group,
                ruleList: rules,
                repositoryRules,
            });

            return promiseLike(null);
        } else if (path[0] === '$') {
            // специальные ссылки
            const name = path.slice(1);
            if (name === 'self') {
                // вся грамматика целиком
                const rules = repositoryRules.get(patternsSymbol)!;
                await checkRuleList({
                    group,
                    ruleList: rules,
                    repositoryRules,
                });

                return promiseLike(null);
            } else if (name === 'base') {
                // TODO: достать base
            }
        }
    } else if (type === RuleType.MATCH) {
        // однострочные правила по регулярному выражению
        const matchRule = rule as RuleTypeRuleGenType<RuleType.MATCH>;

        // мутируем группу внутри и смещаем указатель
        await checkMatchRule({
            group,
            rule: matchRule,
            repositoryRules,
        });

        return promiseLike(null);
    } else if (type === RuleType.BEGIN_END) {
        const beginEndRule = rule as RuleTypeRuleGenType<RuleType.BEGIN_END>;
        // console.log('begin-end', beginEndRule);
        // мутируем группу внутри и смещаем указатель
        await checkBeginEndRule({
            group,
            rule: beginEndRule,
            repositoryRules,
        });
        return promiseLike(null);
    }

    return promiseLike(null);
}

interface CheckRuleListProps {
    group: TextElementGroup;
    ruleList: Rule[];
    repositoryRules: GlobalRepositoryRules;
}

async function checkRuleList({
    group,
    ruleList,
    repositoryRules,
}: CheckRuleListProps): Promise<null> {
    // console.log({ruleList});

    // текущий сырой элемент
    const currentRaw = group.group.currentRaw;
    const currentEndl = group.group.currentRaw?.nextEndl ?? null;

    for (const rule of ruleList) {
        // console.log({ rule }, currentRaw.raw);
        // указатель на текущий элемент смещается внутри
        await checkRule({
            group,
            rule,
            repositoryRules,
        });

        // console.log('rules', {richLines, endIndex});

        if (group.group.currentRaw === null) {
            // дошли до конца текста
            break;
        }

        // console.log(
        //     { currentEndl, nextEndl: group.group.currentRaw.nextEndl },
        //     currentEndl !== group.group.currentRaw.nextEndl
        // );
        if (currentEndl !== group.group.currentRaw.nextEndl) {
            // строка - то есть всё от текущего указателя до endl, разобрана
            // смещение по begin/end(while), либо полностью заполнена строка с match
            break;
        }
    }

    return promiseLike(null);
}

interface CheckSyntaxProps {
    lines: string[]; // строки до конца текста
    lineIndex: number;
    charIndex: number;
    repositoryRules: GlobalRepositoryRules;
}

interface ParserProps {
    text: string;
    syntaxConfig: LevelConfig;
    repositoryRules: GlobalRepositoryRules;
}

async function parser({
    text,
    repositoryRules,
}: ParserProps): Promise<TextElementGroup> {
    // разбиваем текст на строки
    const lines = text.split('\n');

    const rootTextElementRaw = parseLines(lines);

    // корневая группа
    const rootGroup = getTextGroup();
    if (rootTextElementRaw) {
        groupAdapter.add.raw(rootGroup, rootTextElementRaw);
    }

    console.log({ rootGroup });

    while (
        rootGroup.group.currentRaw !== null &&
        rootGroup.group.currentRaw.next !== null
    ) {
        // пока не дойдём до конца цепочки
        console.log(rootGroup.group.currentRaw?.raw);

        const currentRaw = rootGroup.group.currentRaw;

        // проверка всех правил
        // мутируем цепь и меняем текущий элемент, он указывает на последний разобранный
        await checkRuleList({
            group: rootGroup,
            repositoryRules,
            ruleList: repositoryRules.get(patternsSymbol)!,
        });

        // если прогнали все правила, и ничего не нашли,
        // указатель на текущий смещается на следующую строку, если она есть
        if (currentRaw === rootGroup.group.currentRaw) {
            rootGroup.group.currentRaw =
                rootGroup.group.currentRaw.nextEndl?.nextRaw ?? null;
        }
    }

    // двигаемся дальше по тексту
    // lineIndex =
    //     endIndex > lineIndex
    //         ? endIndex // продвинулись за счет правил begin/end(while, если не было пустот)
    //         : lineIndex + 1; // в текущей строке остался неразобранный текст, но правила кончились
    // charIndex = endCharIndex;

    return promiseLike(rootGroup);
}

type GlobalRepositoryConfig = Map<string | Symbol, RuleConfig[]>;

function addRules(
    globalRepository: GlobalRepositoryConfig,
    key: string | Symbol,
    Rules: RuleConfig[]
): void {
    if (globalRepository.has(key)) {
        throw new Error(`Такое правило уже есть: ${key}`);
    } else {
        globalRepository.set(key, Rules);
    }
}

function isRepositoryConfig(config: RuleConfig | LevelConfig): boolean {
    if ('repository' in config) {
        return true;
    }
    if ('patterns' in config && Object.keys(config).length === 1) {
        return true;
    }
    return false;
}

/**
 * преобразуем вложенные репозитории в линейную структуру
 * @param config уровень конфига
 * @param globalRepository мутабельный объект, в него записываются правила
 * @param name имя для группы правил
 */
const generateGlobalRepository = (
    config: LevelConfig,
    globalRepository: GlobalRepositoryConfig,
    name: string | Symbol
) => {
    if ('repository' in config) {
        const repository = config.repository!;
        for (const key of Object.keys(repository)) {
            const subTree = repository[key];
            // subTree[parentSymbol] = repository;

            if (isRepositoryConfig(subTree)) {
                // именованный репозиторий
                generateGlobalRepository(
                    subTree as LevelConfig,
                    globalRepository,
                    key
                );
            } else {
                // именованное правило
                addRules(globalRepository, key, [subTree as RuleConfig]);
            }
            // удаляем поддерево, все данные из него мы перенесли
            delete repository[key];
        }
    }
    if ('patterns' in config) {
        // именованная группа правил
        addRules(globalRepository, name, config.patterns!);
    }
};

function getRegex(s: string): RegExp {
    try {
        const regexString = prepareRegex(s)
            .replace(/\[\:alnum\:\]/g, '[\\d\\w]')
            .replace(/\[\:alpha\:\]/g, '[\\w]')
            .replace(/\(\?x\)/, '');
        // console.log({s, regexString});
        return new RegExp(regexString, 'g');
    } catch (e) {
        console.error(e);
        console.log(s);
        // TODO: временная мера, пока нет парсера origumy regex
        return /EMPTY/;
        throw new Error(`Regexp doesnt to be created from string '${s}'`);
    }
}

type GlobalRepositoryRules = Map<string | Symbol, Rule[]>;

// отмечать
type RulesDependenciesMap = Map<string, string>;

function setMeta(rule: Rule, config: RuleConfig) {
    if ('comment' in config) {
        rule.comment = config.comment;
    }
    if ('disabled' in config) {
        rule.disabled = config.disabled;
    }
}

interface SetCapturesProps {
    rule: RuleGenType<RuleMathFields | RuleBeginFields>;
    capturesName:
        | 'captures'
        | 'beginCaptures'
        | 'endCaptures'
        | 'whileCaptures';
    captures: RuleCapturesConfig<RuleConfig>;
    key: string;
    globalRepository: GlobalRepositoryConfig;
}

function setCaptures({
    rule,
    captures,
    capturesName,
    key,
    globalRepository,
}: SetCapturesProps): void {
    // mutable rule
    (rule as any)[capturesName] = Object.keys(captures).reduce(
        (res, groupKey) => {
            res[groupKey] = {} as RuleCaptureConfig<any>;
            return res;
        },
        {} as any
    );
    for (const groupKey of Object.keys(captures)) {
        const groupConfig = captures[groupKey];
        const groupRule = (rule as any)[capturesName][groupKey];
        const name = groupConfig.name;
        const patterns = groupConfig.patterns;
        if (name) {
            groupRule.name = name;
        }
        if (patterns) {
            groupRule.patterns = patterns.map((pattern, i) => {
                return createRule({
                    level: 1,
                    key: `${key}/:${capturesName}/${groupKey}/${i}`,
                    ruleConfig: pattern,
                    globalRepository,
                });
            });
        }
    }
}

interface CreateRuleProps {
    level: number;
    key: string;
    ruleConfig: RuleConfig;
    rulesDependenciesMap?: RulesDependenciesMap;
    globalRepository: GlobalRepositoryConfig;
}

function createRule({
    level = 0,
    key,
    ruleConfig,
    rulesDependenciesMap = new Map(),
    globalRepository,
}: CreateRuleProps): Rule {
    const type = getRuleType(ruleConfig);
    return {
        [RuleType.INCLUDE]: () => {
            const config = ruleConfig as RuleTypeConfigType<RuleType.INCLUDE>;
            const path = config.include;
            if (path[0] === '#') {
                const ruleName = path.slice(1);
                if (!globalRepository.has(ruleName)) {
                    throw new Error(
                        `Rule '${ruleName}' doesn't exist in repository.`
                    );
                }
                if (level === 0) {
                    // для нулевого уровня вложенности проверяем циклические зависимости
                    if (rulesDependenciesMap.has(ruleName)) {
                        const dependence = rulesDependenciesMap.get(ruleName);
                        if (dependence === key) {
                            throw new Error(
                                `There is circular dependence between ${key} and ${ruleName} rules.`
                            );
                        }
                    }
                    // фиксируем зависимость
                    rulesDependenciesMap.set(key, ruleName);
                }
                const rule = {} as RuleTypeRuleGenType<RuleType.INCLUDE>;
                rule.type = RuleType.INCLUDE;
                setMeta(rule, config);
                rule.include = config.include;

                return rule;
            } else if (path[0] === '$') {
                const name = path.slice(1);
                if (!['self', 'base'].includes(name)) {
                    throw new Error(
                        `Grammar alias must to be equal $self or $base`
                    );
                }
            } else {
                // throw new Error(`Include rule must to be start with '#' or '$'`);
            }
        },
        [RuleType.MATCH]: () => {
            const config = ruleConfig as RuleTypeConfigType<RuleType.MATCH>;
            const name = config.name;
            const captures = config.captures;
            // if (!(name || captures)) {
            //     throw new Error(`The rule '${key}' doesn't include fields 'name' and/or 'captures'`);
            // }
            const rule = {} as RuleTypeRuleGenType<RuleType.MATCH>;
            rule.type = RuleType.MATCH;
            setMeta(rule, config);
            rule.match = config.match;
            if (name) {
                rule.name = config.name;
            }
            if (captures) {
                setCaptures({
                    rule,
                    captures,
                    capturesName: 'captures',
                    key,
                    globalRepository,
                });
            }
            return rule;
        },
        [RuleType.BEGIN_END]: () => {
            const config = ruleConfig as RuleTypeConfigType<RuleType.BEGIN_END>;
            const rule = {} as RuleTypeRuleGenType<RuleType.BEGIN_END>;
            setMeta(rule, config);
            const {
                begin,
                end,
                name,
                contentName,
                patterns,
                beginCaptures,
                endCaptures,
            } = config;
            rule.type = RuleType.BEGIN_END;
            rule.begin = begin;
            rule.end = end;
            if (name) {
                rule.name = name;
            }
            if (contentName) {
                rule.contentName = contentName;
            }
            if (patterns) {
                rule.patterns = patterns.map((pattern, i) => {
                    return createRule({
                        level: 1,
                        key: `${key}/:patterns/${i}`,
                        ruleConfig: pattern,
                        globalRepository,
                    });
                });
            }
            if (beginCaptures) {
                setCaptures({
                    rule,
                    captures: beginCaptures,
                    capturesName: 'beginCaptures',
                    key,
                    globalRepository,
                });
            }
            if (endCaptures) {
                setCaptures({
                    rule,
                    captures: endCaptures,
                    capturesName: 'endCaptures',
                    key,
                    globalRepository,
                });
            }
            return rule;
        },
        [RuleType.BEGIN_WHILE]: () => {
            const config = ruleConfig as RuleTypeConfigType<RuleType.BEGIN_WHILE>;
            const rule = {} as RuleTypeRuleGenType<RuleType.BEGIN_WHILE>;
            setMeta(rule, config);
            const {
                begin,
                while: whileString,
                name,
                beginCaptures,
                whileCaptures,
            } = config;
            rule.type = RuleType.BEGIN_WHILE;
            rule.begin = begin;
            rule.while = whileString;
            if (name) {
                rule.name = name;
            }
            if (beginCaptures) {
                setCaptures({
                    rule,
                    captures: beginCaptures,
                    capturesName: 'beginCaptures',
                    key,
                    globalRepository,
                });
            }
            if (whileCaptures) {
                setCaptures({
                    rule,
                    captures: whileCaptures,
                    capturesName: 'whileCaptures',
                    key,
                    globalRepository,
                });
            }
            return rule;
        },
    }[type]() as Rule;
}

// превращаем строки в регулярные выражения
function generateRepositoryRules(
    globalRepository: GlobalRepositoryConfig
): GlobalRepositoryRules {
    const repository: GlobalRepositoryRules = new Map();
    // карта отмеченных правил для избежания циклических ссылок
    const rulesDependenciesMap: RulesDependenciesMap = new Map();
    for (const key of globalRepository.keys()) {
        const rules: Rule[] = [];
        for (const ruleConfig of globalRepository.get(key)!) {
            const ruleKey = typeof key === 'string' ? key : ':root';
            const rule = createRule({
                level: 0,
                key: ruleKey,
                ruleConfig,
                rulesDependenciesMap,
                globalRepository,
            });
            if (rule) {
                rules.push(rule);
            }
        }
        repository.set(key, rules);
    }
    return repository;
}

const text = `
const checkWasmRegex = module.check_regex as typeof wasmTypes.check_regex;

function checkRegex(regexSource: string, text: string) {
    try {
        const indexes = checkWasmRegex(regexSource, text);
        const result: Array<Record<string, [number, number]>> = [];
        let current: Record<string, [number, number]> = {};
        for (let i = 0; i < indexes.length; i += 3) {
            const groupName = indexes[i];
            if (groupName === 0) {
                if (Object.keys(current).length > 0) {
                    result.push(JSON.parse(JSON.stringify(current)));
                }
                current = {};
            }
            current[groupName] = [indexes[i + 1], indexes[i + 2]];
        }
        if (Object.keys(current).length > 0) {
            result.push(JSON.parse(JSON.stringify(current)));
        }

        return result;
    } catch(e) {
        // console.error(e);
        // console.log({regexSource, text});
        return [];
    }
}
`;

export function tokenize(text: string, lang: string = '') {
    const path = `/data/syntaxes/${lang}/language.json`;

    return fetch(path)
        .then((e) => {
            // console.log(e);
            return e.blob();
        })
        .then((e) => {
            // console.log(e);
            return e.text();
        })
        .then((e) => {
            // return;
            const syntaxConfig: LevelConfig = JSON.parse(e);
            // console.log(JSON.parse(JSON.stringify(syntaxConfig)));
            const globalRepository = new Map<string, RuleConfig[]>();
            generateGlobalRepository(
                syntaxConfig,
                globalRepository,
                patternsSymbol
            );

            // console.log({ globalRepository });
            // console.log({ syntaxConfig });
            const repositoryRules = generateRepositoryRules(globalRepository);
            // console.log(repositoryRules);
            // const text = "const a = 5 + 1;";
            return parser({
                text,
                syntaxConfig,
                repositoryRules,
            });
        })
        .then((group) => {
            const lines = TextGroupToFlatText(group.group);
            console.log({ lines });

            // console.log("input:", text);
            // console.log("output:", lines);
            console.log('output:', JSON.stringify(lines, null, 2));
            return lines;
        });
}
