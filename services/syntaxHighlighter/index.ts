// import './theme.css';

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
} from './model';
import { checkRegex, prepareRegex } from './regex';
import { parentSymbol, patternsSymbol } from './symbols';

import { CaptureGroups } from './model';
import { getCaptureGroups } from './captureGroups';
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
    richLine: RichText[];
};

async function checkMatchRule({
    richLine,
    rule: matchRule,
    repositoryRules,
}: CheckMatchRuleProps): Promise<{ richLine: RichText[]; isRaw: boolean }> {
    const { match, name, captures } = matchRule;
    const existCaptures = Boolean(captures);

    let isRaw = false;
    const result: RichText[] = [];

    for (const text of richLine) {
        if (typeof text !== 'string') {
            // пропускаем уже разобранные части
            result.push(text);
            continue;
        }
        // const groups = text.match(match);

        // if (groups === null) {
        //     isRaw = true;
        // }
        const indexes = checkRegex(match, text);

        if (indexes.length > 0) {
            let currentIndex = 0;
            for (const groups of indexes) {
                const wholeGroup = groups[0];
                const [startIndex, endIndex] = wholeGroup;
                if (startIndex > currentIndex) {
                    // остатки неразобранного текста
                    result.push(text.slice(currentIndex, startIndex));
                }

                // совпадающий текст
                const wholeGroupText = text.slice(startIndex, endIndex);

                let groupText: RichText[];
                if (existCaptures && Object.keys(groups).length > 1) {
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
                        if (j === 0 && !groupText) {
                            groupText = [];
                        }
                        const groupNumberStr = String(groupNumber);
                        const captureRuleConfig = captures[groupNumberStr];
                        const rules = Array.isArray(captureRuleConfig)
                            ? captureRuleConfig
                            : [captureRuleConfig];
                        const [startGroupIndex, endGroupIndex] = groups[
                            groupNumberStr
                        ];
                        const captureText = text.slice(
                            startGroupIndex,
                            endGroupIndex
                        );

                        if (startGroupIndex > lastIndex) {
                            // текст до текущей группы
                            groupText.push(
                                text.slice(lastIndex, startGroupIndex)
                            );
                        }

                        // сдвигаем границу
                        lastIndex = endGroupIndex;

                        if (captureText !== '') {
                            // есть что разбирать

                            // можно использовать сразу checkRuleList, так как текст в одной строке
                            const {
                                richLines,
                                endLineIndex, // пока бесполезен
                            } = await checkRuleList({
                                lines: [[captureText]],
                                ruleList: rules as any,
                                repositoryRules,
                            });

                            // добавляем разобранный текст
                            groupText.push(richLines[0][0]);
                        }
                    }
                    if (lastIndex < endIndex) {
                        // остаток текста до конца текущего совпадения
                        groupText.push(text.slice(lastIndex, endIndex));
                    }
                }
                if (!groupText) {
                    // внутренних совпадений нет
                    groupText = [wholeGroupText];
                }
                // разобранный текст
                result.push([name ?? '', groupText, 0]);
                currentIndex = endIndex;
            }
            if (currentIndex < text.length) {
                // остатки неразобранного текста до конца строки
                result.push(text.slice(currentIndex, text.length));
            }
        } else {
            result.push(text);
            isRaw = true;
        }
    }

    return promiseLike({
        richLine: result,
        isRaw,
    });
}

type CheckBeginEndRuleProps = CheckRuleByTypeProps<RuleType.BEGIN_END> & {
    richLines: RichLines;
};

type RichGroups = {
    [lineIndex: string]: { // строка с совпадением
        [blockIndex: string]: RichText[]; // номер блока и результат
    }
}

async function checkBeginEndRule({
    richLines,
    rule: beginEndRule,
    repositoryRules,
}: CheckBeginEndRuleProps): Promise<{
    richLines: RichLines;
    endLineIndex: number;
}> {
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

    const result: RichLines = [...richLines];
    /**  */
    const richGroups: RichGroups = {};

    // return { richLines, endLineIndex: 1 };

    const firstLine = richLines[0];
    let existsBeginEnd = false;
    for (let i = 0; i < firstLine.length; i++) {
        /** кусок первой строки */
        const text = firstLine[i];
        if (typeof text !== 'string') {
            // пропускаем уже разобранные части
            continue;
        }
        const beginIndexes = checkRegex(begin, text);
        if (beginIndexes.length > 0) {
            // есть совпадение с началом
            // console.log(name, { beginIndexes, begin, text, end });
            // break;

            // для каждого ищем end от текущего места в первой строке до конца всех строк
            // смотрим следующие строки только если мы в последнем блоке

            let currentLastIndex = 0;
            const isLastBlock = i === firstLine.length;
            for (const beginGroups of beginIndexes) {
                const wholeBeginGroup = beginGroups[0];
                const [startBeginIndex, endBeginIndex] = wholeBeginGroup;

                if (startBeginIndex < currentLastIndex) {
                    // часть текста уже была включена в предыдущую группу
                    continue;
                }

                // остаток от текущей строки
                const endLineText = text.slice(endBeginIndex, text.length);

                // строки для поиска конца
                let linesForEndSearch: RichLines;

                if (isLastBlock && richLines.length > 1) {
                    // также смотрим следующие строки
                    linesForEndSearch = [[endLineText], ...richLines.slice(1)];
                } else {
                    if (endLineText === '') {
                        // блок закончился, дальше искать негде
                        break;
                    }
                    linesForEndSearch = [[endLineText]];
                }

                // нужно только первое совпадение
                let firstEndGroups: CaptureGroups;
                let firstEndLineIndex: number;
                // console.log({ linesForEndSearch });
                for (let j = 0; j < linesForEndSearch.length; j++) {
                    const line = linesForEndSearch[j];
                    if (line.length > 1) {
                        // такого вообще быть не должно
                        // должны быть только сырые строки
                        break;
                    }
                    const endText = line[0];
                    if (typeof endText !== 'string') {
                        break;
                    }
                    // debugger;
                    const endIndexes = checkRegex(end, endText);
                    // debugger;
                    if (endIndexes.length > 0) {
                        // нужно только первое совпадение
                        const endGroups = endIndexes[0];
                        firstEndGroups = endGroups;
                        firstEndLineIndex = j;
                        break;
                    }
                }

                if (firstEndGroups) {
                    // конец был найден
                    console.log({
                        name,
                        text,
                        begin,
                        end,
                        beginGroups,
                        firstEndGroups,
                    });
                    const wholeEndGroup = firstEndGroups[0];
                    // индексы относительно endBeginIndex
                    const startEndIndex = wholeEndGroup[0] + endBeginIndex;
                    const endEndIndex = wholeEndGroup[1] + endBeginIndex;
                    if (firstEndLineIndex === 0) {
                        // всё в пределах одной строки

                        // конец разобранной группы
                        currentLastIndex = endEndIndex;

                        const textWithToken: RichText[] = [];
                        if (startBeginIndex > 0) {
                            // текст до начала совпадения
                            textWithToken.push(text.slice(0, startBeginIndex));
                        }
                        // TODO: // разобрать вглубь
                        textWithToken.push([name, [text.slice(startBeginIndex, endEndIndex)], 0]);
                        if (endEndIndex < text.length) {
                            // текст после совпадения
                            textWithToken.push(text.slice(endEndIndex, text.length));
                        }
                        if (!richGroups[0]) {
                            richGroups[0] = {};
                        }
                        // TODO: несколько групп
                        richGroups[0][i] = textWithToken;
                        existsBeginEnd = true;
                    } else {
                        // изменяем сразу несколько строк
                    }
                } else {
                    // конец не был найден
                    if (isLastBlock) {
                        // продлеваем до конца текста
                    } else {
                    }
                }
            }
        }
    }
    if (!existsBeginEnd) {
        // ничего не нашли
        return promiseLike({ richLines, endLineIndex: 1 });
    }

    if (Object.keys(richGroups).length > 0) {
        console.log({name, begin, end, richGroups, text: richLines[0]});
    }

    for (const line of Object.keys(richGroups)) {
        const blocks = richGroups[line];
        const lineIndex = Number(line);
        for (const block of Object.keys(blocks)) {
            const richTexts = blocks[block];
            const blockIndex = Number(block);
            const currentLine = result[lineIndex];
            result[lineIndex] = [];
            if (blockIndex > 0) {
                result[lineIndex].push(...currentLine.slice(0, blockIndex));
            }
            result[lineIndex].push(...richTexts);
            if (blockIndex < currentLine.length - 1) {
                result[lineIndex].push(...currentLine.slice(blockIndex, currentLine.length));
            }
        }
    }
    return promiseLike({richLines: result, endLineIndex: 1});

}

interface CheckRuleProps {
    richLines: RichLines;
    rule: Rule;
    repositoryRules: GlobalRepositoryRules;
}

async function checkRule({
    richLines,
    rule,
    repositoryRules,
}: CheckRuleProps): Promise<{ richLines: RichLines; endLineIndex: number }> {
    if (rule.disabled) {
        // отключенные правила
        return promiseLike({
            richLines,
            endLineIndex: 0,
        });
    }

    const type = rule.type;

    // console.log(type, {rule});

    if (type === RuleType.INCLUDE) {
        const includeRule = rule as RuleTypeRuleGenType<RuleType.INCLUDE>;
        const path = includeRule.include;

        // console.log({path});

        if (path[0] === '#') {
            const name = path.slice(1);
            const rules = repositoryRules.get(name);
            const { richLines: lines, endLineIndex } = await checkRuleList({
                lines: richLines,
                ruleList: rules,
                repositoryRules,
            });

            return promiseLike({
                richLines: lines,
                endLineIndex,
            });
        } else if (path[0] === '$') {
            const name = path.slice(1);
            if (name === 'self') {
                const rules = repositoryRules.get(patternsSymbol);
                const { richLines: lines, endLineIndex } = await checkRuleList({
                    lines: richLines,
                    ruleList: rules,
                    repositoryRules,
                });

                return promiseLike({
                    richLines: lines,
                    endLineIndex,
                });
            } else if (name === 'base') {
                // TODO: достать base
            }
        }
    } else if (type === RuleType.MATCH) {
        const matchRule = rule as RuleTypeRuleGenType<RuleType.MATCH>;
        const richLine = richLines[0];
        const {
            richLine: line,
            isRaw, // ещё есть неразобранные куски
        } = await checkMatchRule({
            richLine,
            rule: matchRule,
            repositoryRules,
        });
        richLines[0] = line;
        return promiseLike({
            richLines,
            endLineIndex: isRaw ? 0 : 1,
        });
    } else if (type === RuleType.BEGIN_END) {
        const beginEndRule = rule as RuleTypeRuleGenType<RuleType.BEGIN_END>;
        // console.log('begin-end', beginEndRule);
        const {
            richLines: resultRichLines,
            endLineIndex,
        } = await checkBeginEndRule({
            richLines,
            rule: beginEndRule,
            repositoryRules,
        });
        return promiseLike({
            richLines: resultRichLines,
            endLineIndex,
        });
    }

    return promiseLike({
        richLines,
        endLineIndex: 0,
    });
}

interface CheckRuleListProps {
    lines: RichLines;
    ruleList: Rule[];
    repositoryRules: GlobalRepositoryRules;
}

async function checkRuleList({
    lines,
    ruleList,
    repositoryRules,
}: CheckRuleListProps): Promise<{
    richLines: RichLines;
    endLineIndex: number;
}> {
    // последняя строка с полностью разобранным текстом
    let endLineIndex = 0;

    let currentRichLines: RichLines = lines;

    // console.log({ruleList});

    for (const rule of ruleList) {
        const { richLines, endLineIndex: endIndex } = await checkRule({
            richLines: currentRichLines,
            rule,
            repositoryRules,
        });

        // console.log('rules', {richLines, endIndex});

        // обновляем разобранный текст, рассмотреть мутабельный объект
        currentRichLines = richLines;

        if (endIndex > 0) {
            // смещение по begin/end(while), либо полностью заполнена строка с match
            break;
        }
    }
    return promiseLike({
        richLines: currentRichLines,
        endLineIndex,
    });
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
}: ParserProps): Promise<RichLines> {
    // разбиваем текст на строки
    const lines = text.split('\n');

    // текущая строка в исходном тексте
    let lineIndex = 0;

    // текущий символ
    let charIndex = 0;

    // разобранный текст
    const resultRichLines: RichLines = [];

    // текст, подлежащий разбору
    let currentRichLines: RichLines = lines.map((s) => [s]);

    // let currentLineIndex

    while (lineIndex < lines.length) {
        // const line = lines[lineIndex];

        // проверка всех правил
        const {
            richLines, // частично разобранный текст
            endLineIndex, // последняя строка в разобранной части текста, после идёт сырой; если в строке остались неразобранные части, равен 0
        } = await checkRuleList({
            lines: lines.slice(lineIndex).map((s) => [s]),
            repositoryRules,
            ruleList: repositoryRules.get(patternsSymbol),
        });
        // console.log({ richLines, endLineIndex });

        // добавляем разобранную часть к остальным
        resultRichLines.push(
            ...richLines.slice(0, endLineIndex > 0 ? endLineIndex : 1)
        );

        // последняя разобранная строка в общем тексте
        const endIndex = lineIndex + endLineIndex;

        // двигаемся дальше по тексту
        lineIndex =
            endIndex > lineIndex
                ? endIndex // продвинулись за счет правил begin/end(while, если не было пустот)
                : lineIndex + 1; // в текущей строке остался неразобранный текст, но правила кончились
        // charIndex = endCharIndex;
    }
    // console.log({ resultRichLines });
    return promiseLike(resultRichLines);
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
        const repository = config.repository;
        for (const key of Object.keys(repository)) {
            const subTree = repository[key];
            subTree[parentSymbol] = repository;

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
        addRules(globalRepository, name, config.patterns);
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
    capturesName: string;
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
    rule[capturesName] = Object.keys(captures).reduce((res, groupKey) => {
        res[groupKey] = {};
        return res;
    }, {});
    for (const groupKey of Object.keys(captures)) {
        const groupConfig = captures[groupKey];
        const groupRule = rule[capturesName][groupKey];
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
    rulesDependenciesMap,
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
    }[type]();
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
        for (const ruleConfig of globalRepository.get(key)) {
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
        .then((lines) => {
            console.log({ lines });

            // console.log("input:", text);
            // console.log("output:", lines);
            console.log('output:', JSON.stringify(lines, null, 2));
            return lines;
        });
}
